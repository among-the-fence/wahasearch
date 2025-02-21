
import { useEffect, useState } from 'react';
import './App.css'
import { GameData, WBSDataGameSystemParser } from './lib/gameData';

 function App() {

    const [parsedData, setParsedData] = useState<GameData | undefined>(undefined);

    useEffect(() => {
      new WBSDataGameSystemParser().parseGameSystem().then(c => setParsedData(c));
    }, []);
  

  return (
    <>
      <div className='mt-12'>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5 lg:mt-0 gap-4">
          {parsedData?.selections?.map(unit => (
            <h1 style={{color:'white'}} key={unit.id}  > {unit.name} </h1>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
