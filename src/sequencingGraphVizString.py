import pandas as pd
from collections import Counter, defaultdict
import numpy as np
from flask import Flask, request, jsonify
import matplotlib.pyplot as plt
from scipy.interpolate import interp2d

app = Flask(__name__)


# @app.route('/get-data', methods=['POST'])

# def whatever(threshold, file, gradient_sequence):
#     return
def load_and_sort_data(filepath):
    df = pd.read_csv(filepath)
    return df.sort_values(by=['Session Id', 'Time'])


def create_step_sequences(data_sorted):
    return data_sorted.groupby('Session Id')['Step Name'].apply(list)


def create_outcome_sequences(data_sorted):
    return data_sorted.groupby('Session Id')['Outcome'].apply(list)


def count_sequences(step_sequences, outcome_sequences):
    sequence_counts = Counter(zip([tuple(seq) for seq in step_sequences], [tuple(seq) for seq in outcome_sequences]))
    return sequence_counts


def count_edges(sequence_counts):
    edge_counts = defaultdict(int)
    total_node_edges = defaultdict(int)
    ratio_edges = {}
    edge_outcome_counts = defaultdict(lambda: defaultdict(int))

    for (step_sequence, outcome_sequence), count in sequence_counts.items():
        # Ensure we have a valid sequence with at least 2 steps
        if len(step_sequence) < 2:
            continue

        for i in range(len(step_sequence) - 1):
            current_step = step_sequence[i]
            next_step = step_sequence[i + 1]
            outcome = outcome_sequence[i + 1]

            # Update edge counts
            edge_counts[(current_step, next_step)] += count

            # Update outcome counts for the edge
            edge_outcome_counts[(current_step, next_step)][outcome] += count

            # Update total edge counts for the current node
            total_node_edges[current_step] += count

    # Calculate ratio edges
    for edge, count in edge_counts.items():
        total_for_current_step = total_node_edges[edge[0]]
        ratio_edges[edge] = count / total_for_current_step if total_for_current_step > 0 else 0

    return edge_counts, total_node_edges, ratio_edges, edge_outcome_counts


def normalize_thicknesses(edge_counts, threshold):
    edge_count_values = np.array(list(edge_counts.values()))
    min_val = np.min(edge_count_values)
    max_val = np.max(edge_count_values)
    normalized_data = 1 + ((edge_count_values - min_val) / (max_val - min_val)) * 9
    return {edge: thickness for edge, thickness in zip(edge_counts.keys(), normalized_data) if thickness > threshold}


def get_most_common_sequence(sequence_counts):
    step_sequences_counts = Counter()
    for (step_sequence, _), count in sequence_counts.items():
        step_sequences_counts[step_sequence] += count
    most_common_sequences = step_sequences_counts.most_common(40)#[0][0]
    i = 0
    most_common_sequence = most_common_sequences[i][0]
    print(most_common_sequence)
    while len(most_common_sequence) <= 1:
        i += 1
        most_common_sequence = most_common_sequences[i][0]
    return most_common_sequence


def interpolate_color(start_color, end_color, t):
    """Interpolate between start_color and end_color by t, where t is between 0 and 1."""
    start_rgb = [int(start_color[i:i + 2], 16) for i in (1, 3, 5)]
    end_rgb = [int(end_color[i:i + 2], 16) for i in (1, 3, 5)]
    interpolated_rgb = [int(start + (end - start) * t) for start, end in zip(start_rgb, end_rgb)]
    return f'#{interpolated_rgb[0]:02x}{interpolated_rgb[1]:02x}{interpolated_rgb[2]:02x}'


def calculate_color(step_rank, total_steps):
    # Define the gradient colors from white to #72acd4
    start_color = '#ffffff'  # White
    end_color = '#72acd4'  # Light Blue
    t = (step_rank - 1) / (total_steps - 1)

    return interpolate_color(start_color, end_color, t)


def create_gradient_image():
    # Define the corner colors
    colors = np.array([
        [1, 0, 0],  # Red
        [0, 1, 0],  # Green
        [0, 0, 1],  # Blue
        [1, 1, 0]  # Yellow
    ])

    # Reshape to (2, 2, 3)
    C = colors.reshape((2, 2, 3))

    # Number of pixels
    n = 700
    img = np.zeros((n, n, 3))

    for i in range(3):
        interp_func = interp2d([0, 1], [0, 1], C[:, :, i], kind='linear')
        img[:, :, i] = interp_func(np.linspace(0, 1, n), np.linspace(0, 1, n))

    # Save the gradient image
    gradient_image_path = 'gradient.png'
    plt.imsave(gradient_image_path, img)

    return gradient_image_path


def calculate_edge_colors(outcomes):
    """Calculate edge color based on outcome distribution."""
    color_map = {
        'ERROR': '#ff0000',  # Red
        'OK': '#00ff00',  # Green
        'INITIAL_HINT': '#0000ff',  # Blue
        'HINT_LEVEL_CHANGE': '#0000ff',  # Blue
        'JIT': '#ffff00',  # yellow # Orange
        'FREEBIE_JIT': '#ff8000'  # Orange
    }

    if not outcomes:
        return '#00000000'  # Return black if there are no outcomes

    total_count = sum(outcomes.values())
    weighted_r = weighted_g = weighted_b = 0

    for outcome, count in outcomes.items():
        color = color_map.get(outcome, '#000000')  # Default to black if outcome is unknown
        r, g, b = [int(color[i:i + 2], 16) for i in (1, 3, 5)]
        weight = count / total_count
        weighted_r += r * weight
        weighted_g += g * weight
        weighted_b += b * weight

    return f'#{int(weighted_r):02x}{int(weighted_g):02x}{int(weighted_b):02x}90'


def generate_dot_string(normalized_thicknesses, most_common_sequence, ratio_edges,
                        edge_outcome_counts, edge_counts, total_node_edges, gradient_im_path):
    dot_string = 'digraph G {\n'
    dot_string += '    graph [layout=dot];\n'
    # dot_string += '    node [shape=ellipse, style=filled];\n'

    # Add the gradient image as a separate node
    # dot_string += (f'  imgnode [shape=plaintext, image="gradient.png",'
    #                f' labelloc="b", label="", image_scaling="TRUE"];')

    total_steps = len(most_common_sequence)
    # print(most_common_sequence)
    # Create rank assignments and gradient color for nodes
    for rank, step in enumerate(most_common_sequence):
        color = calculate_color(rank + 1, total_steps)
        dot_string += f'    "{step}" [rank={rank + 1}, style=filled, fillcolor="{color}"];\n'

    # Add edges with normalized thickness and color
    for (current_step, next_step), thickness in normalized_thicknesses.items():
        outcomes = edge_outcome_counts.get((current_step, next_step), {})
        edge_count = edge_counts.get((current_step, next_step), 0)
        total_count = total_node_edges.get(current_step, 0)
        color = calculate_edge_colors(outcomes)
        outcomes_str = '\n\t\t '.join([f"{outcome}: {count}" for outcome, count in outcomes.items()])
        tooltip = (f"{current_step} to {next_step}\n"
                   f"- Edge Count: \n\t\t {edge_count}\n"
                   f"- Total visits to {current_step}: \n\t\t{total_count}\n"
                   f"- Ratio: \n\t\t{(ratio_edges[(current_step, next_step)]) * 100:.2f}% of students at {current_step} go to {next_step}\n"
                   f"- Outcomes: \n\t\t {outcomes_str}")

        dot_string += (f'    "{current_step}" -> "{next_step}" [penwidth={thickness},'
                       f' color="{color}", tooltip="{tooltip}"];\n')

    dot_string += '}'
    return dot_string


@app.route('/get-results', methods=['GET'])
def get_results(filepath='../../sampleDatasets/7x_tutor_transactions_deidentified_ratio_proportion_change4_INPUT_OMITTED.csv'):
    # filepath='../../sampleDatasets/problemDatasets/ratio_proportion_mix4a-cms-042.csv'

    data_sorted = load_and_sort_data(filepath)
    step_sequences = create_step_sequences(data_sorted)
    outcome_sequences = create_outcome_sequences(data_sorted)
    sequence_counts = count_sequences(step_sequences, outcome_sequences)
    edge_counts, total_node_edges, ratio_edges, edge_outcome_counts = count_edges(sequence_counts)
    normalized_thicknesses = normalize_thicknesses(ratio_edges, 1.5)

    most_common_sequence = get_most_common_sequence(sequence_counts)
    gradient_image_path = create_gradient_image()

    dot_string = generate_dot_string(normalized_thicknesses, most_common_sequence, ratio_edges,
                                     edge_outcome_counts, edge_counts, total_node_edges, 'gradient.png')    # print(dot_string)
    return jsonify({'message': dot_string, 'filepath': filepath})


if __name__ == "__main__":
    app.run(debug=True)