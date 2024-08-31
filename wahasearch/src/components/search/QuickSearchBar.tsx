import { Input } from "@/components/ui/input"
import { ChangeEvent, useEffect, useState } from "react"

interface QuickSearchFormProps {
  updateGlobalForm: (value: string) => void
  intialValue: string
}

export function QuickSearchForm({updateGlobalForm, intialValue}: QuickSearchFormProps) {
  const [quickSearch, setQuickSearch] = useState<string>(intialValue);

  const updateQuickSearchState = (e: ChangeEvent<HTMLInputElement>) => {
    setQuickSearch(e.target.value);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => updateGlobalForm(quickSearch), 500);
    return () => clearTimeout(timeOutId);
  }, [quickSearch]);
  
  return (
    <div className="flex justify-center justify-items-center content-center w-full mb-4">
        <Input className='w-3/5' value={quickSearch} onChange={updateQuickSearchState}/>
    </div>
  )
}
