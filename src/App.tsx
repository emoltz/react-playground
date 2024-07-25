import './App.css'
import Graphviz from 'graphviz-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {

  const [valueToDisplay, setValueToDisplay] = useState<string>('');
  const [filepath, setFilepath] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/flaskapi/get-results');
        console.log(response.data);
        setValueToDisplay(response.data.message);
        setFilepath(response.data.filepath);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once after the initial render

  const dot = valueToDisplay

  return (
      <div>
        <h1>Graphviz in React with TypeScript</h1>
          <h2>{filepath}</h2>
        <div style={{textAlign: 'center'}}>
          {valueToDisplay && <Graphviz dot={dot} options={{height: 650, width: 600}}/>}
        </div>
      </div>
  );
};

export default App;

//  const dot =
//      `digraph G {
//     "PercentChange" [rank=1, style=filled, fillcolor="#ffffff"];
//     "NumeratorQuantity2" [rank=2, style=filled, fillcolor="#f6fafc"];
//     "NumeratorQuantity1" [rank=3, style=filled, fillcolor="#eef5f9"];
//     "DenominatorQuantity1" [rank=4, style=filled, fillcolor="#e6f0f7"];
//     "FinalAnswer" [rank=5, style=filled, fillcolor="#ddebf4"];
//     "FinalAnswerDirection" [rank=6, style=filled, fillcolor="#d5e6f2"];
//     "OptionalTask_1" [rank=7, style=filled, fillcolor="#cde1ef"];
//     "OptionalTask_2" [rank=8, style=filled, fillcolor="#c4dced"];
//     "FirstRow2:1" [rank=9, style=filled, fillcolor="#bcd7ea"];
//     "DenominatorFactor" [rank=10, style=filled, fillcolor="#b4d3e8"];
//     "NumeratorFactor" [rank=11, style=filled, fillcolor="#accee5"];
//     "EquationAnswer" [rank=12, style=filled, fillcolor="#a3c9e3"];
//     "FirstRow1:1" [rank=13, style=filled, fillcolor="#9bc4e0"];
//     "FirstRow1:2" [rank=14, style=filled, fillcolor="#93bfde"];
//     "FirstRow2:2" [rank=15, style=filled, fillcolor="#8abadb"];
//     "SecondRow" [rank=16, style=filled, fillcolor="#82b5d9"];
//     "ThirdRow" [rank=17, style=filled, fillcolor="#7ab0d6"];
//     "nan" [rank=18, style=filled, fillcolor="#72acd4"];
//     "ThirdRow" -> "FinalAnswer" [penwidth=5.749445676274944];
//     "FinalAnswer" -> "FinalAnswerDirection" [penwidth=8.573170731707318];
//     "FinalAnswerDirection" -> "OptionalTask_1" [penwidth=5.759423503325943];
//     "OptionalTask_1" -> "DenominatorFactor" [penwidth=6.437915742793792];
//     "DenominatorFactor" -> "NumeratorFactor" [penwidth=9.241685144124169];
//     "NumeratorFactor" -> "EquationAnswer" [penwidth=9.19179600886918];
//     "EquationAnswer" -> "nan" [penwidth=5.150776053215077];
//     "PercentChange" -> "NumeratorQuantity2" [penwidth=9.920177383592018];
//     "NumeratorQuantity2" -> "NumeratorQuantity1" [penwidth=9.580931263858094];
//     "NumeratorQuantity1" -> "DenominatorQuantity1" [penwidth=10.0];
//     "DenominatorQuantity1" -> "OptionalTask_1" [penwidth=3.4445676274944566];
//     "DenominatorFactor" -> "DenominatorFactor" [penwidth=4.542128603104213];
//     "OptionalTask_2" -> "FirstRow1:1" [penwidth=3.334811529933481];
//     "FirstRow1:1" -> "FirstRow1:2" [penwidth=7.695121951219512];
//     "FirstRow1:2" -> "FirstRow1:2" [penwidth=1.8780487804878048];
//     "FirstRow1:2" -> "FirstRow2:1" [penwidth=2.237250554323725];
//     "FirstRow2:1" -> "FirstRow2:2" [penwidth=4.801552106430155];
//     "FirstRow2:2" -> "SecondRow" [penwidth=5.629711751662971];
//     "SecondRow" -> "ThirdRow" [penwidth=9.720620842572062];
//     "FinalAnswerDirection" -> "DenominatorFactor" [penwidth=1.9279379157427938];
//     "DenominatorQuantity1" -> "FinalAnswer" [penwidth=2.4168514412416853];
//     "FinalAnswer" -> "FinalAnswer" [penwidth=3.883592017738359];
//     "NumeratorQuantity2" -> "DenominatorQuantity1" [penwidth=2.0776053215077606];
//     "DenominatorQuantity1" -> "NumeratorQuantity1" [penwidth=2.566518847006652];
//     "EquationAnswer" -> "OptionalTask_2" [penwidth=1.6585365853658536];
//     "FirstRow1:2" -> "FirstRow1:1" [penwidth=3.7937915742793793];
//     "FirstRow1:1" -> "FirstRow1:1" [penwidth=2.0875831485587586];
//     "FirstRow1:1" -> "FirstRow2:1" [penwidth=1.828159645232816];
//     "FirstRow2:2" -> "FirstRow2:2" [penwidth=1.5687361419068737];
//     "FinalAnswerDirection" -> "nan" [penwidth=1.5886917960088693];
//     "PercentChange" -> "PercentChange" [penwidth=4.941241685144124];
//     "PercentChange" -> "DenominatorQuantity1" [penwidth=1.5787139689578713];
//     "NumeratorQuantity1" -> "NumeratorQuantity2" [penwidth=1.6784922394678494];
//     "OptionalTask_2" -> "FirstRow2:1" [penwidth=5.998891352549889];
//     "FirstRow2:2" -> "FirstRow1:1" [penwidth=2.0875831485587586];
//     "FirstRow1:2" -> "SecondRow" [penwidth=2.8159645232815964];
//     "NumeratorQuantity1" -> "OptionalTask_2" [penwidth=1.5886917960088693];
//     "FirstRow1:2" -> "FirstRow2:2" [penwidth=5.270509977827051];
//     "FirstRow2:2" -> "FirstRow2:1" [penwidth=3.254988913525499];
//     "FirstRow2:1" -> "SecondRow" [penwidth=2.6463414634146343];
//     "OptionalTask_1" -> "OptionalTask_2" [penwidth=3.484478935698448];
//     "FirstRow2:1" -> "DenominatorFactor" [penwidth=2.8658536585365852];
//     "EquationAnswer" -> "FirstRow1:1" [penwidth=3.1751662971175167];
//     "ThirdRow" -> "nan" [penwidth=4.941241685144124];
//     "DenominatorQuantity1" -> "OptionalTask_2" [penwidth=4.5022172949002215];
//     "PercentChange" -> "NumeratorQuantity1" [penwidth=1.8481152993348116];
//     "NumeratorQuantity1" -> "NumeratorQuantity1" [penwidth=3.254988913525499];
//     "EquationAnswer" -> "EquationAnswer" [penwidth=3.1651884700665187];
//     "EquationAnswer" -> "FinalAnswer" [penwidth=2.5066518847006654];
//     "FinalAnswer" -> "OptionalTask_2" [penwidth=1.6485587583148558];
//     "FirstRow2:1" -> "FirstRow1:1" [penwidth=2.6164079822616406];
//     "FirstRow2:2" -> "FirstRow1:2" [penwidth=2.4966740576496673];
//     "SecondRow" -> "nan" [penwidth=1.6186252771618626];
//     "FinalAnswerDirection" -> "OptionalTask_2" [penwidth=2.556541019955654];
//     "DenominatorQuantity1" -> "DenominatorQuantity1" [penwidth=1.9778270509977827];
//     "SecondRow" -> "SecondRow" [penwidth=2.0376940133037693];
//     "NumeratorQuantity2" -> "NumeratorQuantity2" [penwidth=4.0432372505543235];
//     "DenominatorQuantity1" -> "NumeratorQuantity2" [penwidth=2.0476718403547673];
//     "FinalAnswerDirection" -> "FinalAnswer" [penwidth=2.4567627494456765];
//     "FinalAnswer" -> "OptionalTask_1" [penwidth=2.3869179600886916];
//     "OptionalTask_1" -> "EquationAnswer" [penwidth=1.6485587583148558];
//     "ThirdRow" -> "ThirdRow" [penwidth=4.053215077605321];
//     "ThirdRow" -> "FinalAnswerDirection" [penwidth=1.7184035476718402];
//     "OptionalTask_2" -> "FirstRow2:2" [penwidth=1.558758314855876];
//     "FirstRow2:1" -> "FirstRow1:2" [penwidth=1.6485587583148558];
//     "FirstRow1:1" -> "SecondRow" [penwidth=2.466740576496674];
//     "FinalAnswerDirection" -> "FinalAnswerDirection" [penwidth=2.317073170731707];
//     "OptionalTask_2" -> "FirstRow1:2" [penwidth=1.9977827050997783];
//     "FirstRow1:1" -> "FirstRow2:2" [penwidth=2.1075388026607538];
//     "DenominatorFactor" -> "EquationAnswer" [penwidth=2.327050997782705];
//     "EquationAnswer" -> "NumeratorFactor" [penwidth=1.7184035476718402];
//     "DenominatorQuantity1" -> "FinalAnswerDirection" [penwidth=1.5687361419068737];
//     "OptionalTask_1" -> "NumeratorFactor" [penwidth=1.7982261640798227];
//     "FirstRow2:2" -> "ThirdRow" [penwidth=1.7682926829268293];
//     "NumeratorFactor" -> "DenominatorFactor" [penwidth=2.117516629711752];
//     "NumeratorFactor" -> "NumeratorFactor" [penwidth=1.5388026607538803];
// }
// `


