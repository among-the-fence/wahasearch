
import './App.css'
import { Datasheet } from './models/faction'
import { factions } from '@/lib/loadData';
import { applyFilters, compareUnits } from '@/lib/filter';
import { UnitCard } from './components/ui/UnitCard'
import { useState } from 'react';
import { ExampleSheet } from './components/UnitDetailsSheet';
import { SearchSheet } from './components/search/SearchSheet';

const storedFavorites = () => JSON.parse(localStorage.getItem('favorites') || "[]");

function App() {
  const [panelUnitStack, setPanelUnitStack] = useState<Datasheet[]>([]);
  const [formState, setFormState] = useState<Map<string, string>>(new Map());
  const [favorites, setFavorites] = useState<string[]>(storedFavorites());
  const [units, setUnits] = useState<Datasheet[]>(factions.flatMap((f) => f.datasheets)
  .sort((a,b) => compareUnits(favorites, a, b)));

  const appendUnitStack = (unit:Datasheet) => {
    setPanelUnitStack([...panelUnitStack, unit]);
  }

  const updateFavorite = (unit:string) => {
    let newFavorites = [...favorites, unit]
    if (favorites.includes(unit)) {
      newFavorites = favorites.filter(i => i != unit);
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setUnits(applyFilters(formState, newFavorites));
  }

  const closeUnitDetails = () => {
    setPanelUnitStack(panelUnitStack.slice(0,-1));
  }

  const applySearchFormFilters = (currentFormState: Map<string, string>) => {
    const flatdatasheets = applyFilters(currentFormState, favorites);
    setFormState(currentFormState);
    setUnits(flatdatasheets);
  }

  return (
    <>
      <SearchSheet updateGlobalForm={applySearchFormFilters} />
      { panelUnitStack.length > 0 && 
        <ExampleSheet
          unit={panelUnitStack[panelUnitStack.length-1]}
          handleClickToClose={closeUnitDetails}
          addUnitToStack={appendUnitStack} />}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-4">
        {(units).map(unit => (
          <UnitCard key={unit.uuid} unit={unit} onclick={appendUnitStack} updateFavorites={updateFavorite} isFavorite={favorites.includes(unit.name)} />
        ))}
      </div>
    </>
  )
}

export default App
