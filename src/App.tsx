import React, { useState, useEffect } from 'react';
import Switch from './lib/switch';

const App: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  let [filter, setFilter] = useState("");
  // let filter:string|null = useState("")
  // let [filter: string|null, setFilter] = useState("");


  const handleToggle = () => {
    if (isSwitchEnabled){
      setIsOn(!isOn);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSwitchEnabled(event.target.checked);
  };

  useEffect(() => {
      const value = isOn ? "PROMOTED" : "GRADUATED";
      setFilter(value);
      // console.log(filter)

  }, [isOn]);

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

  // This is definitely not the ideal way to do it because if I wanted to create another switch,
    // I would have to recreate the above functions... unless I use if (!Switch). No, it's always true
    // as a function...

  return (
    <div className="App">
      <label>
        <input type="checkbox" checked={isSwitchEnabled} onChange={handleCheckboxChange} />
        Filter by Section Completion Status?
      </label>
      {/*<h1>Custom Switch Component</h1>*/}
      {/*<filterSwitch isOn={isOn} handleToggle={handleToggle} filter={getValueBasedOnSwitch()}/>*/}
      <Switch isOn={isOn} handleToggle={handleToggle} filter={getValueBasedOnSwitch()} isDisabled={!isSwitchEnabled}/>
      <br/>
      <p>{getValueBasedOnSwitch()}</p>
    </div>
  );
};

export default App;
