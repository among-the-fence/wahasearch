
import './App.css'
import { Datasheet } from './models/faction'
import { factions } from '@/lib/loadData';
import { applyFilters } from '@/lib/filter';
import { UnitCard } from './components/ui/UnitCard'
import { useState } from 'react';
import { ExampleSheet } from './components/UnitDetailsSheet';
import { SearchSheet } from './components/search/SearchSheet';


function App() {
  const [panelUnitStack, setPanelUnitStack] = useState<Datasheet[]>([]);
  const [units, setUnits] = useState<Datasheet[]>(factions.flatMap((f) => f.datasheets)
  .sort((a,b) => (a.name < b.name ? -1 : 1)));

  const appendUnitStack = (unit:Datasheet) => {
    setPanelUnitStack([...panelUnitStack, unit]);
  }

  const closeUnitDetails = () => {
    setPanelUnitStack(panelUnitStack.slice(0,-1));
  }

  const applySearchFormFilters = (currentFormState: Map<string, string>) => {
    const flatdatasheets = applyFilters(currentFormState);
    setUnits(flatdatasheets);
  }

  return (
    <>
      <SearchSheet updateGlobalForm={applySearchFormFilters} />
      {panelUnitStack.length > 0 && <ExampleSheet unit={panelUnitStack[panelUnitStack.length-1]} handleClickToClose={closeUnitDetails}/>}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-4">
        {(units).map(unit => (
          <UnitCard key={unit.uuid} unit={unit} onclick={appendUnitStack}/>
        ))}
      </div>
    </>
  )
}

export default App
