import React from 'react';
import './../Switch.css'; // Import the CSS for styling

interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  filter: "PROMOTED"|"GRADUATED";

}

const Switch: React.FC<SwitchProps> = ({ isOn, handleToggle }) => {
  return (
    <div className="switch-container" onClick={handleToggle}>
      <div className={`switch ${isOn ? 'Promoted' : 'Graduated'}`}>
        <div className="switch-handle"></div>
      </div>
    </div>
  );
};
export default Switch;