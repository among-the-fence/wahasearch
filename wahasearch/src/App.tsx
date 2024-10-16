
import './App.css'
import { Datasheet } from './models/faction'
import { factions } from '@/lib/loadData';
import { applyFilters, compareUnits, findDatasheetByName } from '@/lib/filter';
import { UnitCard } from './components/ui/UnitCard'
import { useState } from 'react';
import { PanelSheet } from './components/UnitDetailsSheet';
import { SearchSheet } from './components/search/SearchSheet';
import { useSearchParams } from 'react-router-dom';
import { QuickSearchForm } from './components/search/QuickSearchBar';

const storedFavorites = () => JSON.parse(localStorage.getItem('favorites') || "[]");

function unpackSearchForm(queryParams: URLSearchParams): Map<string,string> {
  const out = new Map<string, string>();
  queryParams.forEach((v,k) => { out.set(k, v);});
  return out;
}

function App() {
  const [queryParams, setQueryParams] = useSearchParams();
  const starterUnits = findDatasheetByName(queryParams.get("unit"))
  const [panelUnitStack, setPanelUnitStack] = useState<Datasheet[]>((starterUnits) ? [starterUnits] : []);
  const [formState, setFormState] = useState<Map<string, string>>(unpackSearchForm(queryParams));
  const [quickSearchState, setQuickSearchState] = useState(formState.get('compiledKeywords') || '');

  const [favorites, setFavorites] = useState<string[]>(storedFavorites());
  const [units, setUnits] = useState<Datasheet[]>(factions.flatMap((f) => f.datasheets)
    .sort((a,b) => compareUnits(favorites, a, b)));

  const appendUnitStack = (unit:Datasheet|null) => {
    if (unit) {
      setQueryParams(searchParams => {
        searchParams.set("faction", unit.indexedFields?.factions[0] || '');
        searchParams.set("unit", unit.name.toLowerCase() || '');
        return searchParams;
      });
      setPanelUnitStack([...panelUnitStack, unit]);
    }
  }

  const updateFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, unit:string) => {
    let newFavorites = [...favorites, unit]
    if (favorites.includes(unit)) {
      newFavorites = favorites.filter(i => i != unit);
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setUnits(applyFilters(formState, newFavorites));
    e.stopPropagation();
  }

  const closeUnitDetails = () => {
    const updatedStack = panelUnitStack.slice(0,-1);
    if (updatedStack.length > 0) {
      const unit = updatedStack[updatedStack.length - 1]
      setQueryParams(searchParams => {
        searchParams.set("faction", unit.indexedFields?.factions[0] || '');
        searchParams.set("unit", unit.name.toLowerCase() || '');
        return searchParams;
      });
      setPanelUnitStack(updatedStack);
    }
    else {
      setQueryParams({})
      setPanelUnitStack([]);
    }
  }

  const applyQuickSearch = (currentQuickSearchValue: string) => {
    setQuickSearchState(currentQuickSearchValue);
    formState.set('compiledKeywords', currentQuickSearchValue)
    const flatdatasheets = applyFilters(formState, favorites);
    setFormState(formState);
    setUnits(flatdatasheets);
  }

  const applySearchFormFilters = (currentFormState: Map<string, string>) => {
    setQueryParams(searchParams => {
      searchParams.forEach((_,k) => {searchParams.delete(k);});
      for (let [k,v] of currentFormState) {
        if (v.trim().length > 0)
        searchParams.set(k,v.trim());
      }
      return searchParams;
    });
    setQuickSearchState(currentFormState.get('compiledKeywords') || '')
    const flatdatasheets = applyFilters(currentFormState, favorites);
    setFormState(currentFormState);
    setUnits(flatdatasheets);
  }

  return (
    <>
      { panelUnitStack.length > 0 && 
        <PanelSheet
          unit={panelUnitStack[panelUnitStack.length-1]}
          handleClickToClose={closeUnitDetails}
          addUnitToStack={appendUnitStack} />}
      <div className='mt-12'>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5 lg:mt-0 gap-4">
          {(units).map(unit => (
            <UnitCard key={unit.uuid} unit={unit} onclick={appendUnitStack} updateFavorites={updateFavorite} isFavorite={favorites.includes(unit.name)} />
          ))}
        </div>
      </div>

      <div className="flex w-3/5 md:w-2/5 fixed top-4 justify-center justify-items-center content-center">
        <QuickSearchForm updateGlobalForm={applyQuickSearch} intialValue={quickSearchState}/>
      </div>
      <SearchSheet updateGlobalForm={applySearchFormFilters} initialFormState={formState}/>
    </>
  )
}

export default App
