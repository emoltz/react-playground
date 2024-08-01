// import './App.css'
// import Graphviz from 'graphviz-react';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DropZone from './components/DropZone';
// import { GlobalDataType } from './lib/types/global_data';

// Last working
import './App.css';
import Graphviz from 'graphviz-react';
import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import DropZone from './components/DropZone';

const App: React.FC = () => {
    const [data, setData] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const afterDrop = (data: string) => {
        console.log("after drop running")
        setData(data);
    }

    useEffect(() => {
        // when data is changed, then send to the backend
        const _ = async (): Promise<void> => {
            if (data) {
                console.log("running _...")
                setLoading(true);
                const formData = new FormData();
                formData.append('file', data);
                try {
                    const response: AxiosResponse = await axios.post('/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    // Ensure to check for successful response
                    if (response.status === 200) {
                        setGraphData(response.data.message);
                        console.log("Graph data: ", graphData)
                        console.log("Data from response: ", response.data.message)
                        // const answer: AxiosResponse = await axios.get('/flaskapi/get-results');
                        // console.log(answer.data);
                        // setAnswer(answer.data.message);
                    } else {
                        console.error('Error from server:', response);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                } finally {
                    setLoading(false);
                }
            }
        }

        _();

    }, [data])

    // const handleAfterDrop = async (file: File) => {
    //     setLoading(true);
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     console.log(formData)
    //     try {
    //         const response: AxiosResponse = await axios.post('/upload', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //
    //         // Ensure to check for successful response
    //         if (response.status === 200) {
    //             setData(response.data.message);
    //             // const answer: AxiosResponse = await axios.get('/flaskapi/get-results');
    //             // console.log(answer.data);
    //             // setAnswer(answer.data.message);
    //         } else {
    //             console.error('Error from server:', response);
    //         }
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div>
            <h1>Graphviz in React with TypeScript</h1>
            <DropZone afterDrop={afterDrop} onLoadingChange={setLoading}/>
            {loading && <p>Loading...</p>}
            <div style={{textAlign: 'center'}}>
                {graphData && <Graphviz dot={graphData} options={{height: 600, width: 600}}/>}
            </div>
        </div>
    );
};

export default App;
