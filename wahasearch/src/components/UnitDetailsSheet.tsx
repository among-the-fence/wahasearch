
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Datasheet } from "@/models/faction";
import { compileStats } from "@/lib/unitformatter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { WeaponProfile } from "./unitcomponents/weaponprofile";

interface UnitDetailsSheetProps {
    unit: Datasheet
    handleClickToClose: ()=>void;
}

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export const ExampleSheet = ({unit, handleClickToClose}: UnitDetailsSheetProps) => {
  const [open, setOpen] = useState(true)
  const hasRanged = unit.rangedWeapons.length > 0;
  const hasAbilities = unit.abilities.other.length > 0;

  function clickedClose() {
    handleClickToClose();
    setOpen(false);
  }
  const searchValue = `https://www.google.com/search?tbm=isch&q=warhammer+40k+${unit.name}`;
  return (
    <Dialog open={open} onClose={clickedClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 oversetOpenflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-3xl md-max-w-max transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-xl font-semibold leading-6 text-gray-900">{unit.name}</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <a
                        target="_blank" onClick={()=> window.open(searchValue, "_blank")}
                        className="mx-2 relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                <div className="grid grid-cols-1">
                  {hasRanged && (
                      <Collapsible className="col-span-1 my-2" defaultOpen={true}>
                          <CollapsibleTrigger><h3 className="text-lg font-semibold">Ranged</h3></CollapsibleTrigger>
                          <CollapsibleContent>
                              {unit.rangedWeapons.map((u) => u.profiles.map((uu) => <WeaponProfile key={uu.name} profile={uu}/>))}
                          </CollapsibleContent>
                      </Collapsible>
                  )}
                  <Collapsible className="col-span-1 my-2" defaultOpen={true}>
                      <CollapsibleTrigger><h3 className="text-lg font-semibold">Melee</h3></CollapsibleTrigger>
                      <CollapsibleContent>
                          {unit.meleeWeapons.map((u) => u.profiles.map((uu) => <WeaponProfile key={uu.name} profile={uu}/>))}
                      </CollapsibleContent>
                  </Collapsible>
                  
                  {hasAbilities && (
                      <Collapsible className="col-span-1 my-2" defaultOpen={true}>
                          <CollapsibleTrigger><h3 className="text-lg font-semibold">Abilities</h3></CollapsibleTrigger>
                          <CollapsibleContent>
                              {unit.abilities.other.map((a) => (<div><p className="text-lg font-semibold inline">{a.name}</p>: {a.description}</div>))}
                          </CollapsibleContent>
                      </Collapsible>
                  )}

                  {unit.compiledKeywords && (
                      <Collapsible className="col-span-1 my-2" defaultOpen={false}>
                          <CollapsibleTrigger><h3 className="text-lg font-semibold">Searchable keywords</h3></CollapsibleTrigger>
                          <CollapsibleContent>
                              {unit.compiledKeywords.join(", ")}
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

export const UnitDetailsSheet = ({unit, handleClickToClose}: UnitDetailsSheetProps) => {
    // console.log(unit)
    const hasRanged = unit.rangedWeapons.length > 0;
    const hasAbilities = unit.abilities.other.length > 0;
    return (
    <Card key={unit.id}>
        <div className="ml-3 flex h-7 items-center">
            <button
                type="button"
                onClick={handleClickToClose}
                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
        </div>
        <CardHeader>
            <CardTitle><a href="/unit/">{unit.name}</a></CardTitle>
            {unit.stats.map(sb => <CardDescription key={sb.name}>{compileStats(unit, sb)}</CardDescription>)}
        </CardHeader>

        <CardContent>
            <div className="grid md:grid-cols-2 sm:grid-cols-1  gap-4">
                {hasRanged && (
                    <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger><h2>Ranged</h2></CollapsibleTrigger>
                        <CollapsibleContent>
                            {unit.rangedWeapons.map((u) => u.profiles.map((uu) => <WeaponProfile key={uu.name} profile={uu}/>))}
                        </CollapsibleContent>
                    </Collapsible>
                )}
                <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger><h3>Melee</h3></CollapsibleTrigger>
                    <CollapsibleContent>
                        {unit.meleeWeapons.map((u) => u.profiles.map((uu) => <WeaponProfile key={uu.name} profile={uu}/>))}
                    </CollapsibleContent>
                </Collapsible>
                {}
                {hasAbilities && (
                    <Collapsible className="col-span-2" defaultOpen={true}>
                        <CollapsibleTrigger><h3>Abilities</h3></CollapsibleTrigger>
                        <CollapsibleContent>
                            {unit.abilities.other.map((a) => (<span><h3>{a.name}</h3>: {a.description}</span>))}
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </CardContent>
    </Card>);
}

export default UnitDetailsSheet;
