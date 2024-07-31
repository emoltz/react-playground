// import './App.css'
// import Graphviz from 'graphviz-react';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DropZone from './components/DropZone';
// import { GlobalDataType } from './lib/types/global_data';

// Last working
import './App.css';
import Graphviz from 'graphviz-react';
import React, { useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import DropZone from './components/DropZone';

const App: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  // const [answer, setAnswer] = useState<string>('');

  const handleAfterDrop = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: AxiosResponse = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Ensure to check for successful response
      if (response.status === 200) {
        setData(response.data.message);
        console.log(data)
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
  };

  return (
    <div>
      <h1>Graphviz in React with TypeScript</h1>
      <DropZone afterDrop={handleAfterDrop} onLoadingChange={setLoading} />
      {loading && <p>Loading...</p>}
      <div style={{ textAlign: 'center' }}>
        {data && <Graphviz dot={response.message} options={{ height: 600, width: 600 }} />}
      </div>
    </div>
  );
};

export default App;
