
import './App.css'
import { Datasheet } from './models/faction'
import { factions } from '@/lib/loadData';
import { applyFilters } from '@/lib/filter';
import { UnitCard } from './components/ui/UnitCard'
import { ChangeEvent, useState } from 'react';
import { ExampleSheet } from './components/UnitDetailsSheet';
import { SearchSheet } from './components/SearchSheet';


function App() {
  const [panelUnitStack, setPanelUnitStack] = useState<Datasheet[]>([]);
  const [formState, setFormState] = useState(new Map());
  const [units, setUnits] = useState<Datasheet[]>(factions.flatMap((f) => f.datasheets)
  .sort((a,b) => (a.name < b.name ? -1 : 1)));

  const appendUnitStack = (unit:Datasheet) => {
    setPanelUnitStack([...panelUnitStack, unit]);
  }

  const closeUnitDetails = () => {
    setPanelUnitStack(panelUnitStack.slice(0,-1));
  }

  const updateFormState = (field: string, e: ChangeEvent<HTMLInputElement>) => {
    setFormState(new Map(formState).set(field, e.target.value))

    const flatdatasheets = applyFilters(new Map(formState).set(field, e.target.value));
    setUnits(flatdatasheets);
  }

  return (
    <>
      <SearchSheet formState={formState} updateFormState={updateFormState} />
      {panelUnitStack.length > 0 && <ExampleSheet unit={panelUnitStack[panelUnitStack.length-1]} handleClickToClose={closeUnitDetails}/>}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-4">
        {(units).map(unit => (
          <UnitCard key={unit.uuid} unit={unit} onclick={appendUnitStack}/>
        ))}
      </div>

      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img alt="Your Company" src="https://tailwindui.com/img/logos/mark.svg?color=white" className="h-8 w-auto" />
        </div>
      </div>
    </>
  )
}

export default App
