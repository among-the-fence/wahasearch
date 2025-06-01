
import { useEffect, useState } from 'react';
import './App.css'
import { WahaSearchLoader } from './lib/models/wahaSearchLoader';
import JsonRenderer from './ui/jsonRenderer';
import { Card } from './components/ui/card';


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
    <div>
      {
        catalogue.map((element:any) => {
          return (<div>{element.name}</div>);
        })
      }
    </div>
  );

}

export default App
