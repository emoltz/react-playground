import pandas as pd
from collections import Counter, defaultdict
import numpy as np
from flask import Flask, request, jsonify
import os

app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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
        if len(step_sequence) < 2:
            continue

        for i in range(len(step_sequence) - 1):
            current_step = step_sequence[i]
            next_step = step_sequence[i + 1]
            outcome = outcome_sequence[i + 1]

            edge_counts[(current_step, next_step)] += count
            edge_outcome_counts[(current_step, next_step)][outcome] += count
            total_node_edges[current_step] += count

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
    most_common_sequence = step_sequences_counts.most_common(1)[0][0]
    return most_common_sequence


def interpolate_color(start_color, end_color, t):
    start_rgb = [int(start_color[i:i + 2], 16) for i in (1, 3, 5)]
    end_rgb = [int(end_color[i:i + 2], 16) for i in (1, 3, 5)]
    interpolated_rgb = [int(start + (end - start) * t) for start, end in zip(start_rgb, end_rgb)]
    return f'#{interpolated_rgb[0]:02x}{interpolated_rgb[1]:02x}{interpolated_rgb[2]:02x}'


def calculate_color(step_rank, total_steps):
    start_color = '#ffffff'
    end_color = '#72acd4'
    # if total_steps > 1:
    t = (step_rank - 1) / (total_steps - 1)
    return interpolate_color(start_color, end_color, t)


def calculate_edge_colors(outcomes):
    color_map = {
        'ERROR': '#ff0000',  #Red
        'OK': '#00ff00',  #Green
        'INITIAL_HINT': '#0000ff',  #Blue
        'HINT_LEVEL_CHANGE': '#0000ff',  #Blue
        'JIT': '#ffff00',  # Yellow (Alternative: '#ffa500' for Orange or '#a200ff' for Purple)
        'FREEBIE_JIT': '#ffff00'  # Yellow (Alternative: '#ffa500' for Orange or '#a200ff' for Purple)
    }

    if not outcomes:
        return '#00000000'

    total_count = sum(outcomes.values())
    weighted_r = weighted_g = weighted_b = 0

    for outcome, count in outcomes.items():
        color = color_map.get(outcome, '#000000')
        r, g, b = [int(color[i:i + 2], 16) for i in (1, 3, 5)]
        weight = count / total_count
        weighted_r += r * weight
        weighted_g += g * weight
        weighted_b += b * weight

    return f'#{int(weighted_r):02x}{int(weighted_g):02x}{int(weighted_b):02x}90'


def generate_dot_string(normalized_thicknesses, most_common_sequence, ratio_edges,
                        edge_outcome_counts, edge_counts, total_node_edges):
    dot_string = 'digraph G {\n'
    total_steps = len(most_common_sequence)

    for rank, step in enumerate(most_common_sequence):
        color = calculate_color(rank + 1, total_steps)
        dot_string += f'    "{step}" [rank={rank + 1}, style=filled, fillcolor="{color}"];\n'

    for (current_step, next_step), thickness in normalized_thicknesses.items():
        outcomes = edge_outcome_counts.get((current_step, next_step), {})
        edge_count = edge_counts.get((current_step, next_step), 0)
        total_count = total_node_edges.get(current_step, 0)
        color = calculate_edge_colors(outcomes)
        outcomes_str = '\n\t\t '.join([f"{outcome}: {count}" for outcome, count in outcomes.items()])
        tooltip = (f"{current_step} to {next_step}\n"
                   f"- Edge Count: \n\t\t {edge_count}\n"
                   f"- Total Count for {current_step}: \n\t\t{total_count}\n"
                   f"- Ratio: \n\t\t{(ratio_edges[(current_step, next_step)]) * 100:.2f}% of students at {current_step} go to {next_step}\n"
                   f"- Outcomes: \n\t\t {outcomes_str}\n"
                   f"- Color Codes: \n\t\t Hex: {color}\n\t\t RGB: {tuple(int(color.removeprefix('#')[i:i+2], 16) for i in (0, 2, 4))}")

        dot_string += (f'    "{current_step}" -> "{next_step}" [penwidth={thickness},'
                       f' color="{color}", tooltip="{tooltip}"];\n')

    dot_string += '}'
    return dot_string


@app.route('/upload', methods=['POST'])
def upload_file():
    print("/upload works!")

    if 'file' not in request.files:
        # TODO: here is the issue... no file coming through
        print("No file part")
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']

    print("File: ", file)
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        print("Processing file...")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        print("Filepath: ", filepath)
        data_sorted = load_and_sort_data(filepath)
        step_sequences = create_step_sequences(data_sorted)
        outcome_sequences = create_outcome_sequences(data_sorted)
        sequence_counts = count_sequences(step_sequences, outcome_sequences)
        edge_counts, total_node_edges, ratio_edges, edge_outcome_counts = count_edges(sequence_counts)
        normalized_thicknesses = normalize_thicknesses(ratio_edges, 1.85)

        most_common_sequence = get_most_common_sequence(sequence_counts)
        dot_string = generate_dot_string(normalized_thicknesses, most_common_sequence, ratio_edges,
                                         edge_outcome_counts, edge_counts, total_node_edges)

        return jsonify({'message': dot_string})


if __name__ == "__main__":
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
