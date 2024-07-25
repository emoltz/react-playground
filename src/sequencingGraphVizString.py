import pandas as pd
from collections import Counter, defaultdict
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

def load_and_sort_data(filepath):
    df = pd.read_csv(filepath)
    return df.sort_values(by=['Session Id', 'Time'])


def create_step_sequences(data_sorted):
    return data_sorted.groupby('Session Id')['Step Name'].apply(list)


def count_sequences(step_sequences):
    step_sequences_tuples = [tuple(seq) for seq in step_sequences]
    return Counter(step_sequences_tuples)


def count_edges(sequence_counts):
    edge_counts = defaultdict(int)
    for sequence, count in sequence_counts.items():
        for i in range(len(sequence) - 1):
            current_step = sequence[i]
            next_step = sequence[i + 1]
            edge_counts[(current_step, next_step)] += count
    return edge_counts


def normalize_thicknesses(edge_counts, threshold):
    edge_count_values = np.array(list(edge_counts.values()))
    min_val = np.min(edge_count_values)
    max_val = np.max(edge_count_values)
    normalized_data = 1 + ((edge_count_values - min_val) / (max_val - min_val)) * 9
    return {edge: thickness for edge, thickness in zip(edge_counts.keys(), normalized_data) if thickness > threshold}


def get_most_common_sequence(sequence_counts):
    sequence_counts_df = pd.DataFrame(sequence_counts.items(), columns=['Step Sequence', 'Frequency'])
    sequence_counts_df = sequence_counts_df.sort_values(by='Frequency', ascending=False)
    return sequence_counts_df.reset_index().iloc[0]['Step Sequence']


def get_most_common_sequence(sequence_counts):
    sequence_counts_df = pd.DataFrame(sequence_counts.items(), columns=['Step Sequence', 'Frequency'])
    sequence_counts_df = sequence_counts_df.sort_values(by='Frequency', ascending=False)
    return sequence_counts_df.reset_index().iloc[0]['Step Sequence']


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

    # Calculate the interpolation factor
    t = (step_rank - 1) / (total_steps - 1)

    return interpolate_color(start_color, end_color, t)


def generate_dot_string(normalized_thicknesses, most_common_sequence):
    dot_string = 'digraph G {\n'
    total_steps = len(most_common_sequence)

    # Create rank assignments and gradient color for nodes
    for rank, step in enumerate(most_common_sequence):
        color = calculate_color(rank + 1, total_steps)
        dot_string += f'    "{step}" [rank={rank + 1}, style=filled, fillcolor="{color}"];\n'

    # Add edges with normalized thickness
    for (current_step, next_step), thickness in normalized_thicknesses.items():
        if current_step != next_step:
            dot_string += f'    "{current_step}" -> "{next_step}" [penwidth={thickness}];\n'
        else:
            dot_string += f'    "{current_step}" -> "{next_step}" [penwidth={thickness}];\n'

    dot_string += '}'
    return dot_string


@app.route('/get-results', methods=['GET'])

def get_results(filepath = '../../sampleDatasets/problemDatasets/ratio_proportion_change4b-cms-020.csv'):
    data_sorted = load_and_sort_data(filepath)
    step_sequences = create_step_sequences(data_sorted)
    sequence_counts = count_sequences(step_sequences)
    edge_counts = count_edges(sequence_counts)
    normalized_thicknesses = normalize_thicknesses(edge_counts, 1.5)

    most_common_sequence = get_most_common_sequence(sequence_counts)
    dot_string = generate_dot_string(normalized_thicknesses, most_common_sequence)

    print(dot_string)
    return jsonify({'message': dot_string, 'filepath': filepath})   #jsonify(dot_string)


if __name__ == "__main__":
    app.run(debug=True)
#     filepath = '../../sampleDatasets/problemDatasets/ratio_proportion_change4b-cms-007.csv'
#     # data_sorted = load_and_sort_data(filepath)
    # step_sequences = create_step_sequences(data_sorted)
    # sequence_counts = count_sequences(step_sequences)
    # edge_counts = count_edges(sequence_counts)
    # normalized_thicknesses = normalize_thicknesses(edge_counts, 1.5)
    #
    # most_common_sequence = get_most_common_sequence(sequence_counts)
    # dot_string = generate_dot_string(normalized_thicknesses, most_common_sequence)
    #
    # print(most_common_sequence)
    # print(dot_string)