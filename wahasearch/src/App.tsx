
import { useEffect, useState } from 'react';
import './App.css'
import { GameData, SelectionEntry, WBSDataGameSystemParser } from './lib/models/gameData';
import { SummaryCard } from './components/SummaryCard';
import { UnitDetailsSheet } from './components/UnitDetailsSheet';

 function App() {
    const [displayMessage, setdisplayMessage] = useState<string>("Loading"); 
    const [selected, setSelected] = useState<SelectionEntry | undefined>(undefined); 
    const [parsedData, setParsedData] = useState<GameData | undefined>(undefined);

    useEffect(() => {
      setdisplayMessage("Loading");
      new WBSDataGameSystemParser().parseGameSystem(setdisplayMessage).then(c => {
        setdisplayMessage("Parsed xml data");
        setParsedData(c)
      });
    }, []);
  
    const units = parsedData?.catalogues?.map(c => 
      c.selectionEntries).flat();
    /*.sort((a, b) => {
      if (a) {
        if (b) {
          return a.name.localeCompare(b.name);
        } else {
          return -1;
        }
      } else {
        if (b) {
          return 1;
        } else {
          return 0;
        }
      }
    });/**/



  return (<>
    {!units && <div className='text-white'>{displayMessage}</div>}
    {selected && <UnitDetailsSheet unit={selected} handleClickToClose={() => {
      setSelected(undefined);
    } } />}
    {units && (
          <div className='mt-12'>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5 lg:mt-0 gap-4">
              {units?.map(unit => (
                unit && 
                <SummaryCard entry={unit} openDetails={setSelected} />
              ))}
            </div>
          </div>
      )}
    </>
)

}

export default App
