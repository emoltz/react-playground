import React, { useState, useEffect } from 'react';
import Switch from './lib/switch';

const App: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [filter, setFilter] = useState("");

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    const value = isOn ? "PROMOTED" : "GRADUATED";
    setFilter(value);
    console.log(filter)
  }, [isOn]);

  const getValueBasedOnSwitch = () => {
      console.log(isOn)
      return isOn ?  "GRADUATED": "PROMOTED"; // I had to switch these to get it to not be
                                                // the opposite on the switch and console. Not sure why??
  };

  return (
    <div className="App">
      {/*<h1>Custom Switch Component</h1>*/}
      <Switch isOn={isOn} handleToggle={handleToggle} filter={getValueBasedOnSwitch()}/>
      <p>{getValueBasedOnSwitch()}</p>
    </div>
  );
};

export default App;
