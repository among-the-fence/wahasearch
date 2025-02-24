
import React, { useState } from 'react'
import { SelectionEntry } from "@/lib/gameData";

interface UnitDetailsSheetProps {
  unit: SelectionEntry;
  handleClickToClose: ()=>void;
}


export const UnitDetailsSheet = ({unit, handleClickToClose}: UnitDetailsSheetProps) => {
  
  function clickedClose() {
    console.log("Clicked close");
    handleClickToClose();
  }
  

  function stringifywithoutraw(obj: any) {
    return JSON.stringify(obj, (key, value) => {
      if (key === '_raw') {
        return undefined; // Exclude property 'b'
      }
      return value; // Include other properties
    });
  }

  return (
    <div className='w-full bg-slate-50' >
        <div className="bg-white bg-opacity-100">
          <div>
            <button onClick={() => clickedClose()}>X</button>
            <h2>{unit.name}</h2>
            <Section title="Models">
              <p>{stringifywithoutraw(unit.profiles)}</p>
            </Section>
            <Section title="entries">
              <p>{stringifywithoutraw(unit.selectionEntries)}</p>
            </Section>
            <Section title="groups">
              <p>{stringifywithoutraw(unit.selectionEntryGroups)}</p>
            </Section>
            <Section title="shared">
              <p>{stringifywithoutraw(unit.sharedSelectionEntries)}</p>
            </Section>
            <Section title="sharedgroup">
              <p>{stringifywithoutraw(unit.sharedSelectionEntryGroups)}</p>
            </Section>
          </div>
        </div>
    </div>
  )
}


interface SectionProps {
  title: string
  children: React.ReactNode
}

const Section = ({title, children} : SectionProps) => {
  return (<>
  <h1>{title}</h1><p>
      {children}
    </p>
      </>);
}
