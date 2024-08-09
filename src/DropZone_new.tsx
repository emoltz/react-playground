import React from 'react';
// import Papa from 'papaparse';

interface DropZoneProps {
    onDataProcessed: (csvData: string) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onDataProcessed }) => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvData = e.target?.result as string;
                onDataProcessed(csvData);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="dropzone">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
    );
};

export default DropZone;
// import React from 'react';
// // import Papa from 'papaparse';
// import { useState } from 'react';
// import { loadAndSortData, createStepSequences, createOutcomeSequences } from './graphvizProcessing.ts';
//
// interface DropZoneProps {
//     onDataProcessed: (stepSequences: { [key: string]: string[] }, outcomeSequences: { [key: string]: string[] }) => void;
// }
//
// const DropZone: React.FC<DropZoneProps> = ({ onDataProcessed }) => {
//     const [dragging, setDragging] = useState(false);
//
//     const handleFile = (file: File) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             if (event.target && typeof event.target.result === 'string') {
//                 const csvData = event.target.result;
//                 const sortedData = loadAndSortData(csvData);
//                 const stepSequences = createStepSequences(sortedData);
//                 // console.log(stepSequences)
//                 const outcomeSequences = createOutcomeSequences(sortedData);
//                 onDataProcessed(stepSequences, outcomeSequences);
//             }
//         };
//         reader.readAsText(file);
//     };
//
//     const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//         event.preventDefault();
//         setDragging(false);
//         if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//             handleFile(event.dataTransfer.files[0]);
//         }
//     };
//
//     const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//         event.preventDefault();
//         setDragging(true);
//     };
//
//     const handleDragLeave = () => {
//         setDragging(false);
//     };
//
//     return (
//         <div
//             className={`dropzone ${dragging ? 'dragging' : ''}`}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//         >
//             Drop your CSV file here
//         </div>
//     );
// };
//
// export default DropZone;
