
import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import eldar from "@/lib/data/datasources/10th/json/aeldari.json"
import { UnitCard } from './components/ui/UnitCard'


function App() {

  return (
    <div className="grid grid-cols-4 gap-4">
      {eldar.datasheets.map(unit => (
        <UnitCard key={unit.id} unit={unit}/>
      ))}
    </div>
  )
}

export default App
