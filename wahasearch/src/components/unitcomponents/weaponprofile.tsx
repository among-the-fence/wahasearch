
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Datasheet, Profile, Stat } from "@/models/faction";
import { compileStats } from "@/lib/unitformatter";

interface WeaponProfileProps {
    profile: Profile
}

export const WeaponProfile = ({profile}: WeaponProfileProps) => {
    return (
        <div>
            {profile.name} A:{profile.attacks} sk:{profile.skill} s:{profile.strength} ap:{profile.ap} d:{profile.damage} k:{profile.keywords.join(", ")}
        </div>);
}