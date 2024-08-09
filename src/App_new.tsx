// import './App.css';
// import React, { useState } from 'react';
// import DropZone from './DropZone_new';
// import { countEdges, normalizeThicknesses, generateDotString } from './graphvizProcessing';
// import Graphviz from 'graphviz-react';
// import ErrorBoundary from "./components/errorBoundary.tsx";
//
// const App: React.FC = () => {
//     const [dotString, setDotString] = useState<string>('');
//
//     const handleDataProcessed = (stepSequences: { [key: string]: string[] }, outcomeSequences: { [key: string]: string[] }) => {
//         const { edgeCounts, totalNodeEdges, ratioEdges, edgeOutcomeCounts } = countEdges(stepSequences, outcomeSequences);
//         const normalizedThicknesses = normalizeThicknesses(ratioEdges, 10, 1.85, 0.1);
//
//         const mostCommonSequenceKey = Object.keys(stepSequences)
//         .reduce((a, b) => stepSequences[a].length > stepSequences[b].length ? a : b);
//
//         const mostCommonSequence = stepSequences[mostCommonSequenceKey];
//         const dotStr = generateDotString(
//             normalizedThicknesses,
//             mostCommonSequence,
//             ratioEdges,
//             edgeOutcomeCounts,
//             edgeCounts,
//             totalNodeEdges, 1
//         );
//         console.log(dotStr)
//         setDotString(dotStr);
//     };
//
//     return (
//         <div>
//             <h1>CSV Sequence Processor with Graphviz</h1>
//             <DropZone onDataProcessed={handleDataProcessed}/>
//             <ErrorBoundary>
//             <div className={"container"}>
//                 {dotString && <Graphviz dot={dotString} options={{ useWorker: false, height: 600, width: 600}}/>}
//             </div>
//             </ErrorBoundary>
//         </div>
//     );
// };
//
// export default App;


import './App.css';
import React, { useState, useEffect } from 'react';
import DropZone from './DropZone_new';
import { loadAndSortData, createStepSequences, createOutcomeSequences, countEdges, normalizeThicknesses, generateDotString } from './graphvizProcessing';
import Graphviz from 'graphviz-react';
import ErrorBoundary from "./components/errorBoundary.tsx";
import FilterComponent from './FilterComponent';

const App: React.FC = () => {
    const [dotString, setDotString] = useState<string>('');
    const [filter, setFilter] = useState<string>(''); // State for the selected filter
    const [csvData, setCsvData] = useState<string>(''); // State to store raw CSV data

    // Process the CSV data initially and when filter changes
    useEffect(() => {
        if (!csvData) return; // Skip if no CSV data is available

        let sortedData = loadAndSortData(csvData);

        if (filter) {
            sortedData = sortedData.filter(row => row['CF (Workspace Progress Status)'] === filter);
            console.log(sortedData)
        }

        const stepSequences = createStepSequences(sortedData);
        const outcomeSequences = createOutcomeSequences(sortedData);

        const { edgeCounts, totalNodeEdges, ratioEdges, edgeOutcomeCounts } = countEdges(stepSequences, outcomeSequences);
        const normalizedThicknesses = normalizeThicknesses(ratioEdges, 10);

        const mostCommonSequenceKey = Object.keys(stepSequences)
            .reduce((a, b) => stepSequences[a].length > stepSequences[b].length ? a : b);

        const mostCommonSequence = stepSequences[mostCommonSequenceKey];
        const dotStr = generateDotString(
            normalizedThicknesses,
            mostCommonSequence,
            ratioEdges,
            edgeOutcomeCounts,
            edgeCounts,
            totalNodeEdges, 1
        );

        console.log(dotStr);
        setDotString(dotStr);
    }, [csvData, filter]); // Reprocess data when either csvData or filter changes

    const handleDataProcessed = (uploadedCsvData: string) => {
        setCsvData(uploadedCsvData); // Store the raw CSV data
    };

    return (
        <div>
            <h1>CSV Sequence Processor with Graphviz</h1>
            <FilterComponent onFilterChange={setFilter} />
            <DropZone onDataProcessed={handleDataProcessed}/>
            <ErrorBoundary>
                <div className={"container"}>
                    {dotString && <Graphviz dot={dotString} options={{ useWorker: false, height: 600, width: 600}}/>}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default App;
