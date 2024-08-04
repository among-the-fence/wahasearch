import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChangeEvent, useEffect, useState } from "react"

interface SearchSheetProps {
  updateGlobalForm: (localFormState: Map<string, string>) => void
}

export function SearchSheet({updateGlobalForm}: SearchSheetProps) {
  const [localFormState, setLocalFormState] = useState(new Map());

  const updateLocalFormState = (field: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length == 0) {
      localFormState.delete(field)
      setLocalFormState(new Map(localFormState));
    }
    else {
      setLocalFormState(new Map(localFormState).set(field, e.target.value));
    }
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => updateGlobalForm(localFormState), 500);
    return () => clearTimeout(timeOutId);
  }, [localFormState]);
  
  return (
    <Sheet>
      <SheetTrigger className="m-1" asChild>
        <Button className="fixed top-0 left-0 py-5" variant="outline">
          <div
            className="HAMBURGER-ICON space-y-2"
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
          </div></Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto" side="left">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4 grid-cols-4 items-center gap-4 ">
          
        <SearchFormEntry
            name="faction"
            display="Faction"
            placeholder="ari,tsons,demons"
            formState={localFormState}
            update={updateLocalFormState}
           />
          <SearchFormEntry
            name="compiledKeywords"
            display="Properties"
            placeholder="dev,fly"
            formState={localFormState}
            update={updateLocalFormState}
           />
          <SearchFormEntry
            name="movement"
            display="M"
            placeholder='10"'
            formState={localFormState}
            update={updateLocalFormState}
           />
          
          <SearchFormEntry
            name="toughness"
            display="T"
            placeholder=">12"
            formState={localFormState}
            update={updateLocalFormState}
           />

          <SearchFormEntry
            name="save"
            display="Save"
            placeholder=''
            formState={localFormState}
            update={updateLocalFormState}
           />

          <SearchFormEntry
            name="wounds"
            display="W"
            placeholder=''
            formState={localFormState}
            update={updateLocalFormState}
           />

          <SearchFormEntry
            name="oc"
            display="OC"
            placeholder='10"'
            formState={localFormState}
            update={updateLocalFormState}
           />

          <SearchFormEntry
            name="leadership"
            display="Leadership"
            placeholder=''
            formState={localFormState}
            update={updateLocalFormState}
           />
          <SearchFormEntry
            name="strength"
            display="S"
            placeholder="<=12"
            formState={localFormState}
            update={updateLocalFormState}
           />
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface SearchFormEntryProps {
  name: string;
  display: string;
  placeholder: string;
  formState: Map<string, string>;
  update: (a: string, b: any) => void;
}
const SearchFormEntry = ({name, display, placeholder, formState, update}: SearchFormEntryProps) => {
  return (<>
    <Label htmlFor={name} className="max-sm-hidden text-right">
      {display}:
    </Label>
    <Input id={name} 
      placeholder={placeholder} 
      value={formState.get(name) || ""} 
      className="col-span-3" 
      onChange={(e) => update(name, e)}/>
      </>)
}