
import { Profile } from "@/models/faction";

interface WeaponProfileProps {
    profile: Profile
}

export const WeaponProfile = ({profile}: WeaponProfileProps) => {
    return (
        <div>
            {profile.name} A:{profile.attacks} sk:{profile.skill} s:{profile.strength} ap:{profile.ap} d:{profile.damage} k:{profile.keywords.join(", ")}
        </div>);
}