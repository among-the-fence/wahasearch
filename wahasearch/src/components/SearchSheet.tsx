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
    console.log(field, e);
    setLocalFormState(new Map(localFormState).set(field, e.target.value));
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => updateGlobalForm(localFormState), 500);
    return () => clearTimeout(timeOutId);
  }, [localFormState]);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed top-0 left-0" variant="outline">
          <div
            className="HAMBURGER-ICON space-y-2"
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
          </div></Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="faction" className="text-left">
              Faction
            </Label>
            <Input id="faction" value={localFormState.get("faction") || ""} className="col-span-3" onChange={(e) => (updateLocalFormState("faction", e))}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unitname" className="text-left">
              Properties
            </Label>
            <Input id="unitname" value={localFormState.get("unit") || ""} className="col-span-3" onChange={(e) => updateLocalFormState("unit", e)}/>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
