import Papa from 'papaparse';

interface CSVRow {
    'Session Id': string;
    'Time': string;
    'Step Name': string;
    'Outcome': string;
}

// Function to load and sort data
export const loadAndSortData = (csvData: string): CSVRow[] => {
        const parsedData = Papa.parse<CSVRow>(csvData, {
        header: true,
        skipEmptyLines: true
    }).data;

    // Step 2: Transform data to replace NaN values
    const transformedData = parsedData.map(row => {
        return {
            'Session Id': row['Session Id'] || 'Done Button',
            'Time': row['Time'] || 'Done Button',
            'Step Name': row['Step Name'] || 'Done Button',
            'Outcome': row['Outcome'] || 'Done Button'
        };
    });


    return transformedData.sort((a, b) => {
        if (a['Session Id'] === b['Session Id']) {
            return new Date(a['Time']).getTime() - new Date(b['Time']).getTime();
        }
        return a['Session Id'].localeCompare(b['Session Id']);
    });
};

// Function to create step sequences
export const createStepSequences = (sortedData: CSVRow[]): { [key: string]: string[] } => {
    return sortedData.reduce((acc, row) => {
        const sessionId = row['Session Id'];
        if (!acc[sessionId]) {
            acc[sessionId] = [];
        }
        acc[sessionId].push(row['Step Name']);
        return acc;
    }, {} as { [key: string]: string[] });
};

// Function to create outcome sequences
export const createOutcomeSequences = (sortedData: CSVRow[]): { [key: string]: string[] } => {
    console.log(sortedData)
    return sortedData.reduce((acc, row) => {
        const sessionId = row['Session Id'];
        if (!acc[sessionId]) {
            acc[sessionId] = [];
        }
        acc[sessionId].push(row['Outcome']);
        return acc;
    }, {} as { [key: string]: string[] });
};

interface EdgeCounts {
    edgeCounts: { [key: string]: number };
    totalNodeEdges: { [key: string]: number };
    ratioEdges: { [key: string]: number };
    edgeOutcomeCounts: { [key: string]: { [outcome: string]: number } };
}

// Function to count edges
export const countEdges = (
    stepSequences: { [key: string]: string[] },
    outcomeSequences: { [key: string]: string[] }
): EdgeCounts => {
    const edgeCounts: { [key: string]: number } = {};
    const totalNodeEdges: { [key: string]: number } = {};
    const ratioEdges: { [key: string]: number } = {};
    const edgeOutcomeCounts: { [key: string]: { [outcome: string]: number } } = {};

    Object.keys(stepSequences).forEach((sessionId) => {
        const steps = stepSequences[sessionId];
        const outcomes = outcomeSequences[sessionId];

        if (steps.length < 2) return;

        for (let i = 0; i < steps.length - 1; i++) {
            const currentStep = steps[i];
            const nextStep = steps[i + 1];
            const outcome = outcomes[i + 1];

            const edgeKey = `${currentStep}->${nextStep}`;
            edgeCounts[edgeKey] = (edgeCounts[edgeKey] || 0) + 1;
            edgeOutcomeCounts[edgeKey] = edgeOutcomeCounts[edgeKey] || {};
            edgeOutcomeCounts[edgeKey][outcome] = (edgeOutcomeCounts[edgeKey][outcome] || 0) + 1;
            totalNodeEdges[currentStep] = (totalNodeEdges[currentStep] || 0) + 1;
        }
    });

    Object.keys(edgeCounts).forEach((edge) => {
        const [start] = edge.split('->');
        ratioEdges[edge] = edgeCounts[edge] / (totalNodeEdges[start] || 1);
    });
    console.log("edgeOutcomeCounts: ", edgeOutcomeCounts, "\nratioEdges: ", ratioEdges )
    return { edgeCounts, totalNodeEdges, ratioEdges, edgeOutcomeCounts };
};

// Function to normalize thicknesses
// export function normalizeThicknesses(
//     ratioEdges: { [key: string]: number },
//     maxThickness: number,
//     threshold: number
// ): { [key: string]: number } {
//     const normalized: { [key: string]: number } = {};
//     const maxRatio = Math.max(...Object.values(ratioEdges), 1); // Avoid division by zero
//
//     Object.keys(ratioEdges).forEach((edge) => {
//         const ratio = ratioEdges[edge];
//         if (ratio >= threshold) {
//             normalized[edge] = (ratio / maxRatio) * maxThickness;
//         } else {
//             normalized[edge] = 0; // Or some minimum value if you prefer
//         }
//     });
//
//     return normalized;
// }

/**
 * Normalize edge thicknesses with a threshold.
 * @param ratioEdges - A dictionary where keys are edge identifiers and values are their ratios.
 * @param maxThickness - The maximum thickness to scale the normalized thicknesses.
 * @param threshold - The minimum ratio value to consider for normalization.
 * @param minThickness - The minimum thickness value to use if ratios are below the threshold.
 * @returns - A dictionary where keys are edge identifiers and values are the normalized thicknesses.
 */
export function normalizeThicknesses(
    ratioEdges: { [key: string]: number },
    maxThickness: number,
    threshold: number,
    minThickness: number = 0.1 // Small minimum value to avoid zero penwidth
): { [key: string]: number } {
    const normalized: { [key: string]: number } = {};
    const maxRatio = Math.max(...Object.values(ratioEdges), 1); // Avoid division by zero

    // Debugging: Log the maximum ratio
    console.log(`Max Ratio: ${maxRatio}`);

    Object.keys(ratioEdges).forEach((edge) => {
        const ratio = ratioEdges[edge];

        // Debugging: Log each ratio and threshold comparison
        console.log(`Edge: ${edge}, Ratio: ${ratio}, Threshold: ${threshold}`);

        if (ratio >= threshold) {
            normalized[edge] = (ratio / maxRatio) * maxThickness;
        } else {
            normalized[edge] = minThickness; // Use a small minimum value
        }
    });

    // Debugging: Log the resulting normalized values
    console.log(`Normalized Thicknesses:`, normalized);

    return normalized;
}

function calculateColor(rank: number, totalSteps: number): string {
    // Example: gradient from white to blue
    const ratio = rank / totalSteps;
    const blueValue = Math.round(ratio * 255);
    return `#${blueValue.toString(16).padStart(2, '0')}bcd4`;
}

function calculateEdgeColors(outcomes: { [outcome: string]: number }): string {
    // Example: basic color logic
    if (Object.keys(outcomes).length === 0) {
        return "gray";
    }
    const maxOutcome = Object.keys(outcomes).reduce((a, b) => (outcomes[a] > outcomes[b] ? a : b));
    return maxOutcome === "OK" ? "green" : "red";
}
// Function to generate the DOT string
// export const generateDotString = (
//     normalizedThicknesses: { [key: string]: number },
//     mostCommonSequence: string[],
//     ratioEdges: { [key: string]: number },
//     edgeOutcomeCounts: { [key: string]: { [outcome: string]: number } },
//     edgeCounts: { [key: string]: number },
//     totalNodeEdges: { [key: string]: number }
// ): string => {
//     let dotString = 'digraph G {\n';
//
//     // Generate nodes
//     mostCommonSequence.forEach((node, index) => {
//         const color = `#${(Math.round((index / mostCommonSequence.length) * 255)).toString(16).padStart(2, '0')}bcd4`;
//         dotString += `  "${node}" [style=filled, fillcolor="${color}"];\n`;
//     });
//
//     // Generate edges
//     Object.keys(normalizedThicknesses).forEach((edge) => {
//         const thickness = normalizedThicknesses[edge].toFixed(2);
//         const [start, end] = edge.split('->');
//         const outcomes = edgeOutcomeCounts[edge];
//         const mostCommonOutcome = Object.keys(outcomes).reduce((a, b) => (outcomes[a] > outcomes[b] ? a : b));
//         dotString += `  "${start}" -> "${end}" [penwidth=${thickness}, label="${mostCommonOutcome}"];\n`;
//     });
//
//     dotString += '}';
//     return dotString;
export function generateDotString(
    normalizedThicknesses: { [key: string]: number },
    mostCommonSequence: string[],
    ratioEdges: { [key: string]: number },
    edgeOutcomeCounts: EdgeOutcomeCounts,
    edgeCounts: EdgeCounts,
    totalNodeEdges: TotalNodeEdges
): string {
    let dotString = 'digraph G {\n';
    const totalSteps = mostCommonSequence.length;

    for (let rank = 0; rank < totalSteps; rank++) {
        const step = mostCommonSequence[rank];
        const color = calculateColor(rank + 1, totalSteps);
        dotString += `    "${step}" [rank=${rank + 1}, style=filled, fillcolor="${color}"];\n`;
    }

    for (const edge of Object.keys(normalizedThicknesses)) {
        const [currentStep, nextStep] = edge.split('->') as EdgeKey;
        const thickness = normalizedThicknesses[edge];
        const outcomes = edgeOutcomeCounts[edge] || {};
        const edgeCount = edgeCounts[edge] || 0;
        const totalCount = totalNodeEdges[currentStep] || 0;
        const color = calculateEdgeColors(outcomes);
        const outcomesStr = Object.entries(outcomes)
            .map(([outcome, count]) => `${outcome}: ${count}`)
            .join('\n\t\t ');

        const tooltip = `${currentStep} to ${nextStep}\n`
            + `- Edge Count: \n\t\t ${edgeCount}\n`
            + `- Total Count for ${currentStep}: \n\t\t${totalCount}\n`
            + `- Ratio: \n\t\t${(ratioEdges[edge] || 0) * 100}% of students at ${currentStep} go to ${nextStep}\n`
            + `- Outcomes: \n\t\t ${outcomesStr}\n`
            + `- Color Codes: \n\t\t Hex: ${color}\n\t\t RGB: ${[parseInt(color.substring(1, 3), 16), parseInt(color.substring(3, 5), 16), parseInt(color.substring(5, 7), 16)]}`;

        dotString += `    "${currentStep}" -> "${nextStep}" [penwidth=${thickness}, color="${color}", tooltip="${tooltip}"];\n`;
    }

    dotString += '}';
    return dotString;
};
