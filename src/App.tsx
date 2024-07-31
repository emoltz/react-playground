import './App.css'
import Graphviz from 'graphviz-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Switch from './lib/switch';

const App: React.FC = () => {

  const [data, setData] = useState<string>('');
  const [filepath, setFilepath] = useState<string>('');
  const [isOn, setIsOn] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  let [filter, setFilter] = useState("");

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

  useEffect(() => {
      const value = isOn ? "PROMOTED" : "GRADUATED";
      setFilter(value);
      // console.log(filter)

  }, [isOn]);

  const handleToggle = () => {
    if (isSwitchEnabled){
      setIsOn(!isOn);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSwitchEnabled(event.target.checked);
  };

  const getValueBasedOnSwitch = () => {
    if (isSwitchEnabled) {
      console.log("Filter: " + filter)
      return isOn ?  "PROMOTED":"GRADUATED" ; // I had to switch these to get it to not be
      // the opposite on the switch and console. Not sure why??
      // And then all of the sudden it switch back?????
    }
    else {
      // const noFilter = null
      filter = null
      console.log("Filter: " + filter)
      return filter //HOW DO I SET FILTER TO null???
    }
  };

  const dot = data

  return (
    <div className="App">
      <h1>Graphviz in React with TypeScript</h1>
      <h2>{filepath}</h2>
      <div style={{textAlign: 'center'}}>
        {data && <Graphviz dot={dot} options={{height: 600, width: 600}}/>}
      </div>
      <label>
        <input type="checkbox" checked={isSwitchEnabled} onChange={handleCheckboxChange} />
        Filter by Section Completion Status?
      </label>
      <Switch isOn={isOn} handleToggle={handleToggle} filter={getValueBasedOnSwitch()} isDisabled={!isSwitchEnabled}/>
      <br/>
      <p>{getValueBasedOnSwitch()}</p>
    </div>
  );
};

export default App;