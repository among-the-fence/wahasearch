
import { Profile } from "@/models/faction";

interface WeaponProfileProps {
    profiles: Profile[]
}

export const WeaponProfile = ({profiles}: WeaponProfileProps) => {
    const includeRange = profiles[0].range != "Melee";
    const colCount =  `grid-cols-${includeRange ? 8 : 7}`;
    const skill = includeRange ? `WS` : `BS`;
    // const keywords = profile.keywords.length > 0 ? `${profile.keywords.join(", ")}` : null;

    return (
        <div className={`grid ${colCount} border`}>
            <div className="border col-span-2">
            </div>
            {includeRange && (
                <div className="border">
                    Range
                </div>
            )}
            <div className="border">
                Attacks
            </div> 
            <div className="border">
                {skill} 
            </div>
            <div className="border">
                Strength
            </div>
            <div className="border">
                Armor Pen
            </div>
            <div className="border">
                Damage
            </div>

            {profiles.map(p => <WeaponProfileRow profile={p} includeRange={includeRange} /> )}
        </div>);
}

interface WeaponProfileRowProps {
    profile: Profile
    includeRange: boolean
}

const WeaponProfileRow = ({profile, includeRange}: WeaponProfileRowProps) => {

    return (
        <>
            <div className="border col-span-2">
                <b>{profile.name}</b>
            </div>
            {includeRange && (
                <div className="border">
                    {profile.range}
                </div>
            )}
            <div className="border">
                {profile.attacks}
            </div> 
            <div className="border">
                {profile.skill}
            </div>
            <div className="border">
                {profile.strength}
            </div>
            <div className="border">
                {profile.ap}
            </div>
            <div className="border">
                {profile.damage}
            </div>
            {profile.keywords.length > 0 && (
                <div className="border col-span-8">
                    {profile.keywords.join(", ")}
                </div>
            )}
        </>
    );
}