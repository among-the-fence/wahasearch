
import { useEffect, useState } from 'react';
import './App.css'
import { WahaSearchLoader } from './lib/models/wahaSearchLoader';
import { DataCardCard } from './ui/dataCardCard';


function App() {
  const [catalogue, setCatalogue] = useState([]);
  useEffect(() => {
    const c = WahaSearchLoader.data();
    setCatalogue(c);
  }, []);

  if (!catalogue) {
    return <> </>;
  }

  return (
    <div className='mt-12'>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5 lg:mt-0 gap-4">
        {
          catalogue.map((element: any) => {
            return (<DataCardCard key={element.name} datacard={element} />);
          })
        }
      </div>
    </div>
  );

}

export default App
