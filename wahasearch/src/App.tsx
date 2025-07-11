
import { useEffect, useState } from 'react';
import './App.css'
import { WahaSearchLoader } from './lib/models/wahaSearchLoader';
import { DataCardDisplay } from './ui/DataCardDisplay';
import { SearchForm } from './ui/SearchForm';
import { formData, SearchFormData } from './lib/models/searchFormData';


function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [catalogue, setCatalogue] = useState([]);
  const [fullcatalogue, setFullCatalogue] = useState([]);
  useEffect(() => {
    const c = WahaSearchLoader.data();
    setFullCatalogue(c);
    setCatalogue(c.filter((datacard: any) => datacard.index?.matches(formData.formData)));
  }, []);

  if (!fullcatalogue) {
    return <> </>;
  }

  const keywordFilter = (filters: SearchFormData) => {
    setCatalogue(fullcatalogue.filter((datacard: any) => datacard.index?.matches(filters.formData)));
  }

  if (!catalogue) {
    return <h1>Huh...</h1>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Fixed Search Button */}
      <button
        style={{
          position: 'fixed',
          top: 20,
          left: '5%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '12px 28px',
          background: '#1d4ed8',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        onClick={() => setIsSearchOpen(true)}
      >
        Open Search
      </button>

      {/* Search Panel Overlay */}
      {isSearchOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.32)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              minWidth: '350px',
              minHeight: '120px',
              position: 'relative',
              boxShadow: '0 4px 24px rgba(0,0,0,0.14)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                fontSize: '1.3rem',
                cursor: 'pointer',
                color: '#888'
              }}
              onClick={() => setIsSearchOpen(false)}
            >
              ×
            </button>
            <SearchForm applyFunction={keywordFilter} />
          </div>
        </div>
      )}

      <div className='mt-12'>
        <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-5 lg:mt-0 gap-4">
            {
              catalogue.map((element: any) => {
                return (<DataCardDisplay key={element.uniqueKey} datacard={element} />);
              })
            }
          </div>
        </div>
      </div>
    </div>
  );

}

export default App
