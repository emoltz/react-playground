import matplotlib.cm
import pandas as pd
from matplotlib import colormaps as cm


def step_kc_column(df: pd.DataFrame):
    df['Step KC'] = df['Step Name'] + '_' + df['KC Model(MATHia)']
    return df


def get_index_dict(df: pd.DataFrame):
    return df.to_dict('index')


def unique_clusters(df: pd.DataFrame):
    clusters = list(df['Step Name'].unique())
    return clusters


def create_step_cluster_dict(clusters: list, df_index_dict: dict):
    step_clustering_dict = {x: [] for x in clusters}
    used_skill_names = []
    for x in df_index_dict.keys():
        step_name = df_index_dict[x]['Step Name']
        skill = df_index_dict[x]['KC Model(MATHia)']
        if skill in used_skill_names:
            skill = df_index_dict[x]['Step KC']
        else:
            used_skill_names.append(skill)
        step_clustering_dict[step_name].append(skill)
    for cluster in step_clustering_dict.keys():
        step_clustering_dict[cluster] = set(step_clustering_dict[cluster])
    return step_clustering_dict


def create_string(step_clustering_dict: dict):
    digraphString = 'digraph {\n\tnode [shape=rect];'
    for cluster in step_clustering_dict.keys():
        # step_clustering_dict[cluster] = set(step_clustering_dict[cluster])
        # color = colorClusters[cluster]
        if not pd.isna(cluster):
            s = (f'\n\n\tsubgraph "cluster_{cluster}" {{\n'
                 f'\t\tcluster=true;\n'
                 f'\t\tlabel="{cluster}";\n'
                 # f'\t\tcolor={color};\n'
                 f'\t\tnode [\n'
                 f'\t\t\tstyle=outline,\n'
                 f'\t\t\tcolor=black,\n'
                 f'\t\t\tfontcolor=black\n'
                 f'\t\t];')
            for skill in step_clustering_dict[cluster]:
                try:
                    skill = skill.replace(' ', '_')
                except AttributeError:
                    pass
                s += f'\n\t\t"{skill}";'
            s += '\n\t}'
            digraphString += s
    digraphString += '''
      start:r -> "match_linear_term_expression_with_description";
      start:e -> "match_slope_expression_with_description";
      "match_dep_expression_with_description" -> end;
      "match_indep_expression_with_description" -> end;
      "match_linear_term_expression_with_description" -> end [style=dotted];
      start [style=filled, color=black, fontcolor=white];
      end [color=red];
    };'''
    print(digraphString)
    return digraphString

if __name__ == '__main__':
    filepath = '../../sampleDatasets/problemDatasets/ratio_proportion_change4b-cms-062.csv'
    df = pd.read_csv(filepath, na_values='na')
    df = step_kc_column(df)
    index_dict = get_index_dict(df)
    step_skill_dict = create_step_cluster_dict(clusters=unique_clusters(df), df_index_dict=index_dict)
    create_string(step_skill_dict)

