
import { Profile } from "@/models/faction";

interface WeaponProfileProps {
    profile: Profile
}

export const WeaponProfile = ({profile}: WeaponProfileProps) => {

    const rangeText = profile.range == "Melee" ? "" :  `R:${profile.range} `;
    const skill = profile.range == "Melee" ? `ws:${profile.skill} ` :  `bs:${profile.skill} `;
    const keywords = profile.keywords.length > 0 ? `k:${profile.keywords.join(", ")}` : "";

    return (
        <div>
            {profile.name}: {rangeText}A:{profile.attacks} {skill} s:{profile.strength} ap:{profile.ap} d:{profile.damage} {keywords}
        </div>);
}