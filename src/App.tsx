import './App.css'
import Graphviz from 'graphviz-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {

  const [data, setData] = useState<string>('');
  const [filepath, setFilepath] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/flaskapi/get-results');
        console.log(response.data);
        setData(response.data.message);
        setFilepath(response.data.filepath);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once after the initial render

  const dot = data

  return (
      <div>
        <h1>Graphviz in React with TypeScript</h1>
          <h2>{filepath}</h2>
        <div style={{textAlign: 'center'}}>
          {data && <Graphviz dot={dot} options={{height: 600, width: 600}}/>}
        </div>
      </div>
  );
};

export default App;

