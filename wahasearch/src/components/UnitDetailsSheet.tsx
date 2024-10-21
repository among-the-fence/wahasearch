
import { Datasheet, Colours } from "@/models/faction";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { compileStats } from "@/lib/unitformatter";
import { WeaponProfile } from "./unitcomponents/weaponprofile";

interface UnitDetailsSheetProps {
  unit: Datasheet;
  handleClickToClose: ()=>void;
  addUnitToStack: (unit: Datasheet|null) => void;
}

import React, { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { findDatasheetByName } from "@/lib/filter";

export const PanelSheet = ({unit, handleClickToClose, addUnitToStack}: UnitDetailsSheetProps) => {
  
  const [open] = useState(true)
  const hasRanged = unit.rangedWeapons.length > 0;
  const hasAbilities = unit.abilities.other.length > 0 
  const hasDamagedKeywords = unit.abilities.damaged.description.length > 0;
  const hasKeywords = unit.keywords.length > 0;
  const hasLeads = unit.leads && unit.leads.units.length > 0;
  const hasLeadBy = unit.leadBy && unit.leadBy.length > 0;
  const hasPrimarch = unit.abilities.primarch && unit.abilities.primarch.length > 0;


  function clickedClose() {
    handleClickToClose();
    // setOpen(false);
  }
  const searchValue = `https://www.google.com/search?tbm=isch&q=warhammer+40k+${unit.name}`;
  const headerStyle = `px-4 sm:px-6 bg-blue-50`
  return (
    <Dialog open={open} onClose={clickedClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="h-full w-5 border-1"></div>
        <div className="absolute inset-0 oversetOpenflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-3xl md-max-w-max transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className={`flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl`}>
                <div className={headerStyle} style={{backgroundColor: unit.colours?.banner}}>
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-3xl py-2 font-semibold leading-6 text-gray-200">{unit.name}</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <a
                        target="_blank" onClick={()=> window.open(searchValue, "_blank")}
                        className="mx-2 cursor-pointer relative rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">search</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      </a>
                      <button
                        type="button"
                        onClick={clickedClose}
                        className="relative rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-2" style={{backgroundColor: unit.colours?.header}}> </div>

                <div className="relative mt-6 flex-1 px-4 sm:px-6 m-5 bg-white" >
                  <div className="grid grid-cols-1">

                    <Section color={unit.colours} title="" >
                      <p>{unit.composition}</p>
                      <p>{unit.loadout}</p>
                      {unit.wargear && <p>{unit.wargear}</p>}
                      {unit.stats.map(sb => <p key={sb.uuid}>{compileStats(unit, sb)}</p>)}
                    </Section>

                    {hasRanged && (
                      <Section color={unit.colours} title="Ranged" >
                        <WeaponProfile profiles={unit.rangedWeapons.flatMap(p => p.profiles)} abilities={unit.rangedWeapons.flatMap(p => p.abilities)} />
                      </Section>
                    )}

                    {unit.meleeWeapons.length > 0 && (
                      <Section color={unit.colours} title="Melee" >
                        <WeaponProfile profiles={unit.meleeWeapons.flatMap(p => p.profiles)}/>
                      </Section>
                    )}
                    
                    {(hasAbilities || hasDamagedKeywords || unit.abilities.core.length > 0) && (
                      <Section color={unit.colours} title="Abilities" >
                        {unit.abilities.core.length > 0 && (<div><p className="text-lg font-semibold inline">{unit.abilities.core.join(", ")}</p></div>)}
                        {hasAbilities && unit.abilities.other.map((a) => (<div><p className="text-lg font-semibold inline">{a.name}</p>: {a.description}</div>))}
                        {hasDamagedKeywords && (<div><b>Damaged:</b><p>{unit.abilities.damaged.description} {unit.abilities.damaged.range}</p></div>) }

                      </Section>
                    )}

                    {(hasPrimarch) && (
                      <Section color={unit.colours} title="Primarch">  
                        <p>{unit.abilities.primarch.map(p => p.name + ": " + JSON.stringify(p) ).join(", ")}</p>
                      </Section>
                    )}

                    {hasKeywords && (
                      <Section color={unit.colours} title="Keywords" >
                        <p>{unit.keywords.join(", ")}</p>
                      </Section>
                    )}

                    {(hasLeads) && (
                      <Section color={unit.colours} title="Leads" >
                        {unit.leads?.units.map(u => (<p className="cursor-pointer" onClick={_ => addUnitToStack(findDatasheetByName(u))}>{u} </p>))}
                        <p>{unit.leads?.extra}</p>
                        <p>{unit.leader}</p>
                      </Section>
                    )}

                    {(hasLeadBy) && (
                      <Section color={unit.colours} title="Lead By">
                        {unit.leadBy?.map(u => (<p className="cursor-pointer" onClick={_ => addUnitToStack(findDatasheetByName(u))}>{u} </p>))}
                      </Section>
                    )}


                    {unit.indexedFields?.compiledKeywords && (
                        <Collapsible className="col-span-1 my-2" defaultOpen={false}>
                            <CollapsibleTrigger><h3 className="text-lg font-semibold">Debug</h3></CollapsibleTrigger>
                            <CollapsibleContent>
                                {unit.indexedFields?.compiledKeywords.join(", ")}
                                <pre>
                                  {JSON.stringify(unit, null, 2)}
                                </pre>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

interface SectionProps {
  color: Colours | undefined
  title: string
  children: React.ReactNode
}

const Section = ({title, children, color} : SectionProps) => {
  return (<Collapsible className="col-span-1 my-2" defaultOpen={true} >
    <CollapsibleTrigger ><h3 className="text-lg font-semibold text-gray-200" style={{color: color?.banner}} >{title}</h3></CollapsibleTrigger>
    <CollapsibleContent>
      {children}
    </CollapsibleContent>
  </Collapsible>);
}
