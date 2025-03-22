import { useState } from "react"

export interface SectionProps {
    title: string
    children: React.ReactNode
    defaultVisible?: boolean
  }
  
  export const Section = ({title, children, defaultVisible = true} : SectionProps) => {
  
    const [visible, setVisible] = useState(defaultVisible)
    return (
      <div onClick={() => setVisible(!visible)} className="cursor-pointer">
        <h1 className="text-lg font-bold">{title}</h1>
          {(visible !== false) && (<p>
            {children}
          </p>)}
      </div>);
    }
  