import React from 'react';
import './../Switch.css'; // Import the CSS for styling


interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  filter: "PROMOTED"|"GRADUATED"|null;
  isDisabled: boolean;

}
// export const filterSwitch: React.FC<SwitchProps> = ({ isOn, handleToggle }) => {
//   return (
//     <div className="switch-container" onClick={handleToggle}>
//       <div className={`switch ${isOn ? 'Filter' : 'NoFilter'}`}>
//         <div className="switch-handle"></div>
//       </div>
//     </div>
//   );
// };
// Add a parameter to switch variable assignment/function(?) to decide the options
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