
import { useEffect, useState } from 'react';
import LZString from 'lz-string';
import './App.css'
import { GameData, WBSDataGameSystemParser } from './lib/gameData';
import { SummaryCard } from './components/SummaryCard';

 function App() {
    const [displayMessage, setdisplayMessage] = useState<string>("Loading"); 
    const [parsedData, setParsedData] = useState<GameData | undefined>(undefined);

    useEffect(() => {
      setdisplayMessage("Loading");
      new WBSDataGameSystemParser().parseGameSystem(setdisplayMessage).then(c => {
        setdisplayMessage("Parsed xml data");
        // sessionStorage.setItem("data", JSON.stringify(c));
        setParsedData(c)
      });
    }, []);
  
    const units = parsedData?.catalogues?.map(c => 
      c.selectionEntries).flat()
    .sort((a, b) => {
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
    });

  return (
    (!units) ? <div className='text-white'>{displayMessage}</div> :
    (units && (
      <>
        <div className='mt-12'>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5 lg:mt-0 gap-4">
            {units?.map(unit => (
              unit && 
              <SummaryCard entry={unit} />
            ))}
          </div>
        </div>
      </>
    ))
)
}

export default App
