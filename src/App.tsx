import './App.css'
// import { testFunction } from './lib/utils'

// function App() {
//
//   return (
//     <>
//       <button
//         onClick={testFunction}
//
//       >
//         Click me!
//       </button>
//
//     </>
//   )
// }
// export default App

// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import * as dagreD3 from 'dagre-d3';
//
// const DagreD3Graph: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//
//   useEffect(() => {
//     if (!svgRef.current) return;
//
//     const svg = d3.select(svgRef.current);
//     const inner = svg.append('g');
//
//     // Create the input graph
//     const g = new dagreD3.graphlib.Graph({ multigraph: true }).setGraph({});
//
//     // Add cluster nodes to the graph
//     g.setNode('cluster_0', { label: 'Cluster 0' });
//     g.setNode('cluster_1', { label: 'Cluster 1' });
//     g.setNode('cluster_2', { label: 'Cluster 2' });
//     g.setNode('cluster_3', { label: 'Cluster 3' });
//
//     // Add nodes to the graph
//     g.setNode('a', { label: 'a' });
//     g.setNode('b', { label: 'b' });
//     g.setNode('c', { label: 'c' });
//     g.setNode('d', { label: 'd' });
//
//     // Set parent relationships
//     g.setParent('a', 'cluster_0');
//     g.setParent('b', 'cluster_1');
//     g.setParent('c', 'cluster_2');
//     g.setParent('d', 'cluster_3');
//
//     // Add edges to the graph
//     g.setEdge('a', 'b', { label: 'a -> b' });
//     g.setEdge('b', 'c', { label: 'b -> c' });
//     g.setEdge('c', 'd', { label: 'c -> d' });
//     g.setEdge('d', 'a', { label: 'd -> a' });
//
//     // Create the renderer
//     const render = new dagreD3.render();
//
//     // Run the renderer. This is what draws the final graph.
//     render(inner, g);
//
//     // Center the graph
//     const initialScale = 0.75;
//     svg.call(d3.zoom().on('zoom', ({ transform }) => inner.attr('transform', transform)))
//       .call(d3.zoom().transform, d3.zoomIdentity.translate(20, 20).scale(initialScale));
//   }, []);
//
//   return (
//     <svg ref={svgRef} width="800" height="600"></svg>
//   );
// };
// function App() {
//
//   return (
//     <>
//       <DagreD3Graph>
//
//       </DagreD3Graph>
//
//     </>
//   )
// }

// export default App;


import React from 'react';
import Graphviz from 'graphviz-react';

const App: React.FC = () => {
  const dot =
    //   `digraph {
    //   node [shape=rect];
    //   subgraph cluster1{
    //     label=<Nonsense Title>;
    //     cluster=true;
    //     color=blue;
    //     node [
    //       shape=ellipse,
    //       style=filled,
    //       color=blue,
    //       fontcolor=white
    //     ];
    //     a2 [label="0 | [&bull; S, $]\\n[S &rarr; &bull; a S b, $]\\n[S &rarr; &bull;, $]"]
    //     a1 -> a2 -> a3;
    //     a1 -> a3;
    //   }
    //   subgraph cluster2{
    //     label = <Also Nonsense>;
    //     cluster=true;
    //     bgcolor=white;
    //     node [
    //       shape=ellipse,
    //       style=filled,
    //       color=yellow,
    //       fontcolor=black
    //     ];
    //     b1 -> b2 -> b3;
    //     b2 -> b1;
    //     b2 [shape=diamond];
    //     b3->b3;
    //     b3->a3 [label = <Edge Label>,style=dashed];
    //   }
    //   start:r-> a1;
    //   start:e -> b1;
    //   a3 -> end;
    //   b3 -> end;
    //   a1->end [style=dotted];
    //   start [style=filled, color=black, fontcolor=white];
    //   end [color=red];
    // }`;

    `digraph V {
    node [shape=rect];

    subgraph cluster_DenominatorQuantity1 {
        cluster=true;
        label="DenominatorQuantity1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "nan";
        "enter_amount_of_change_with_variable-1";
        "represent_part_or_total_in_proportion_with_variable-1";
        "enter_numerator_of_percent_with_variable-1";
        "enter_given_total_in_proportion-1";
        "enter_numerator_of_given_percent_in_proportion-1";
    }

    subgraph cluster_NumeratorQuantity1 {
        cluster=true;
        label="NumeratorQuantity1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "nan";
        "enter_amount_of_change_with_variable-1";
        "enter_given_part_in_proportion-1";
        "enter_given_amount_of_change_in_proportion-1";
        "represent_part_or_total_in_proportion_with_variable-1";
        "enter_given_total_in_proportion-1";
        "enter_given_percent_change_in_proportion-1";
    }

    subgraph cluster_NumeratorQuantity2 {
        cluster=true;
        label="NumeratorQuantity2";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "nan";
        "enter_amount_of_change_with_variable-1";
        "enter_given_part_in_proportion-1";
        "enter_numerator_of_given_percent_in_proportion-1";
        "enter_given_amount_of_change_in_proportion-1";
        "enter_numerator_of_percent_with_variable-1";
        "enter_given_percent_change_in_proportion-1";
        "enter_numerator_of_percent_change_with_variable-1";
    }

    subgraph cluster_FinalAnswer {
        cluster=true;
        label="FinalAnswer";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_label_of_final_answer-1";
        "calculate_final_amount_in_context-1";
        "nan";
        "calculate_part-percent-1";
        "calculate_percent_change_in_context-1";
        "calculate_percent-1";
        "calculate_total-percent-1";
        "enter_numerator_of_given_percent_in_proportion-1";
    }

    subgraph cluster_OptionalTask_1 {
        cluster=true;
        label="OptionalTask_1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_label_of_final_answer-1";
        "nan";
        "calculate_part-percent-1";
        "calculate_percent_change_in_context-1";
        "calculate_total-percent-1";
        "enter_given_percent_change_in_proportion-1";
    }

    subgraph cluster_OptionalTask_2 {
        cluster=true;
        label="OptionalTask_2";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "represent_part_or_total_in_proportion_with_variable-1";
        "nan";
    }

    subgraph "cluster_FirstRow1:2" {
        cluster=true;
        label="FirstRow1:2";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "calculate_part-percent-1";
        "nan";
        "enter_numerator_of_given_percent_in_proportion-1";
        "calculate_final_amount_in_context-1";
    }

    subgraph cluster_DenominatorFactor {
        cluster=true;
        label="DenominatorFactor";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "calculate_total-percent-1";
        "enter_label_of_final_answer-1";
        "nan";
        "enter_amount_of_change_with_variable-1";
    }

    subgraph cluster_NumeratorFactor {
        cluster=true;
        label="NumeratorFactor";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "calculate_part-percent-1";
        "enter_label_of_final_answer-1";
        "nan";
    }

    subgraph cluster_EquationAnswer {
        cluster=true;
        label="EquationAnswer";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "calculate_percent_change_in_context-1";
        "nan";
        "calculate_final_amount_in_context-1";
        "calculate_total-percent-1";
    }

    subgraph "cluster_FirstRow1:1" {
        cluster=true;
        label="FirstRow1:1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_label_of_final_answer-1";
        "nan";
        "calculate_final_amount_in_context-1";
    }

    subgraph "cluster_FirstRow2:1" {
        cluster=true;
        label="FirstRow2:1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_given_total_in_proportion-1";
        "nan";
    }

    subgraph "cluster_FirstRow2:2" {
        cluster=true;
        label="FirstRow2:2";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "nan";
        "enter_numerator_of_percent_with_variable-1";
    }

    subgraph cluster_SecondRow {
        cluster=true;
        label="SecondRow";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "calculate_part-percent-1";
        "nan";
        "calculate_final_amount_in_context-1";
        "calculate_total-percent-1";
    }

    subgraph cluster_ThirdRow {
        cluster=true;
        label="ThirdRow";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_label_of_final_answer-1";
        "nan";
        "calculate_final_amount_in_context-1";
        "calculate_percent_change_in_context-1";
        "calculate_percent-1";
    }

    subgraph cluster_PercentChange {
        cluster=true;
        label="PercentChange";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "nan";
        "enter_given_percent_change_in_proportion-1";
        "enter_amount_of_change_with_variable-1";
    }

    subgraph cluster_FinalAnswerDirection {
        cluster=true;
        label="FinalAnswerDirection";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_label_of_final_answer-1";
        "nan";
        "calculate_percent_change_in_context-1";
    }

    subgraph cluster_DenominatorLabel1 {
        cluster=true;
        label="DenominatorLabel1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "calculate_part-percent-1";
        "represent_part_or_total_in_proportion_with_variable-1";
        "nan";
        "enter_numerator_of_given_percent_in_proportion-1";
    }

    subgraph cluster_NumeratorLabel1 {
        cluster=true;
        label="NumeratorLabel1";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_given_total_in_proportion-1";
        "represent_part_or_total_in_proportion_with_variable-1";
        "nan";
    }

    subgraph cluster_FinalAnswerLabel {
        cluster=true;
        label="FinalAnswerLabel";
        node [
            style=outline,
            color=black,
            fontcolor=black
        ];
        "enter_label_of_final_answer-1";
        "nan";
        "calculate_percent-1";
    }
    
      start:r -> "match_linear_term_expression_with_description";
      start:e -> "match_slope_expression_with_description";
      "match_dep_expression_with_description" -> end;
      "match_indep_expression_with_description" -> end;
      "match_linear_term_expression_with_description" -> end [style=dotted];
      start [style=filled, color=black, fontcolor=white];
      end [color=red];
    }`;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Graphviz in React with TypeScript Sample</h1>
      <Graphviz dot={dot} options={{ height: 400, width: 600 }} />
    </div>
  );
};

export default App;
