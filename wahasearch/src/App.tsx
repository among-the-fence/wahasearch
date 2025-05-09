
import { useEffect, useState } from 'react';
import './App.css'
import { WahaSearchLoader } from './lib/models/wahaSearchLoader';
import JsonRenderer from './ui/jsonRenderer';


function App() {
  const [catalogue, setCatalogue] = useState({});
  useEffect(() => {
    const c = WahaSearchLoader.data();
    setCatalogue(c);
  }, []);

  return (<div><JsonRenderer data={catalogue} /></div>)

}

export default App
