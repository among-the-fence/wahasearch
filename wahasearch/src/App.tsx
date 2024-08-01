
import './App.css'
import { Datasheet, FactionRoot } from './models/faction'
import eldar from "./lib/data/datasources/10th/json/aeldari.json"
import { UnitCard } from './components/ui/UnitCard'
import { useState } from 'react';
import UnitDetailsSheet from './components/UnitDetailsSheet';


function App() {
  const [panelUnitStack, setPanelUnitStack] = useState<Datasheet[]>([]);

  const appendUnitStack = (unit:Datasheet) => {
    setPanelUnitStack([...panelUnitStack, unit]);
  }

  const closeUnitDetails = () => {
    setPanelUnitStack(panelUnitStack.slice(0,-1));
  }

  return (
    <>
      {panelUnitStack.length > 0 && <UnitDetailsSheet unit={panelUnitStack[panelUnitStack.length-1]} handleClickToClose={closeUnitDetails}/>}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-4">
        {(eldar as FactionRoot).datasheets.map(unit => (
          <UnitCard key={unit.id} unit={unit} onclick={appendUnitStack}/>
        ))}
      </div>
    </>
  )
}

export default App
