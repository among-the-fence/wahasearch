
import { Profile } from "@/models/faction";

interface WeaponProfileProps {
    profiles: Profile[]
}

export const WeaponProfile = ({profiles}: WeaponProfileProps) => {
    const includeRange = profiles[0].range != "Melee";
    const colCountBig =  `grid grid-cols-8 border`;
    const colCountSmall =  `grid grid-cols-${includeRange ? 6 : 7} border md:hidden`;
    const skillBig = includeRange ? `Weapon Skill` : `Balistic Skill`;
    const skillSmall = includeRange ? `WS` : `BS`;
    // const keywords = profile.keywords.length > 0 ? `${profile.keywords.join(", ")}` : null;

    return (<>
            <div className={colCountBig}>
                <div className="border col-span-2">
                </div>
                {includeRange && (
                    <div className="border">
                        Range
                    </div>
                )}
                {!includeRange && (
                    <div className="border">
                    </div>
                )}
                <div className="border">
                    Attacks
                </div> 
                <div className="border">
                    {skillBig} 
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
            </div>

            <div className={colCountSmall}>
                {includeRange && (
                    <div className="border">
                        R
                    </div>
                )}
                {!includeRange && (
                    <div className="border">
                        R
                    </div>
                )}
                <div className="border">
                    A
                </div> 
                <div className="border">
                    {skillSmall} 
                </div>
                <div className="border">
                    S
                </div>
                <div className="border">
                    AP
                </div>
                <div className="border">
                    D
                </div>

                {profiles.map(p => <WeaponProfileRow profile={p} includeRange={includeRange} /> )}
            </div>
        </>
    );
}

interface WeaponProfileRowProps {
    profile: Profile
    includeRange: boolean
}

const WeaponProfileRow = ({profile, includeRange}: WeaponProfileRowProps) => {

    const colCountFull =  `border col-span-8`;

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
            {!includeRange && (
                <div className="border">
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
                <div className={colCountFull}>
                    {profile.keywords.join(", ")}
                </div>
            )}
        </>
    );
}