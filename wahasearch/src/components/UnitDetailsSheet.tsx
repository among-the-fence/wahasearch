'use client'

import { SelectionEntry } from "@/lib/models/gameData";


import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { stringifywithoutraw } from "@/lib/util";

interface UnitDetailsSheetProps {
  unit?: SelectionEntry;
  handleClickToClose: ()=>void;
}


export const UnitDetailsSheet = ({unit, handleClickToClose}: UnitDetailsSheetProps) => {
  const [open, setOpen] = useState(true)


  function clickedClose(value: boolean) {
    console.log("Clicked close");
    handleClickToClose();
    // setOpen(value);
  }
  
  if (!unit) {
    return null;
  }

  return (
    <Dialog open={open} onClose={clickedClose} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-gray-900">Panel title</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <div className='w-full bg-slate-50' >
                    <div className="bg-white bg-opacity-100">
                      <div>
                        <h2 className="text-xl font-bold">{unit.name}</h2>
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
                        <Section title="raw" defaultVisible={false}>
                          <p>{JSON.stringify(unit._raw)}</p>
                        </Section>
                      </div>
                    </div>
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
  title: string
  children: React.ReactNode
  defaultVisible?: boolean
}

const Section = ({title, children, defaultVisible = true} : SectionProps) => {

  const [visible, setVisible] = useState(defaultVisible)
  return (
    <div onClick={() => setVisible(!visible)} className="cursor-pointer">
      <h1 className="text-lg font-bold">{title}</h1>
        {(visible !== false) && (<p>
          {children}
        </p>)}
    </div>);
  }
