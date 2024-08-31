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
    <Input className='w-full' value={quickSearch} onChange={updateQuickSearchState}/>
  )
}
