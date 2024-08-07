
import { Profile } from "@/models/faction";

interface WeaponProfileProps {
    profiles: Profile[]
}

export const WeaponProfile = ({profiles}: WeaponProfileProps) => {
    // const keywords = profile.keywords.length > 0 ? `${profile.keywords.join(", ")}` : null;

    return (<>
            <div className="hidden md:block">
                <RegularDisplay profiles={profiles} />
            </div>
            <div className="hidden sm:block md:hidden">
                <CompactDisplay profiles={profiles} />
            </div>

            <div className="block sm:hidden">
                <CompactDisplay profiles={profiles} />
            </div>
        </>
    );
}

const RegularDisplay = ({profiles}: WeaponProfileProps) => {
    const includeRange = profiles[0].range != "Melee";
    const skillBig = includeRange ? `Weapon Skill` : `Ballistic Skill`;

    return (
        <div className='grid grid-cols-8'>
            <div className='border col-span-2'>
            </div>
            <div className="border">
                Range
            </div>
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

            {profiles.map(p => <WeaponProfileRow profile={p} includeRange={includeRange} namespane='border col-span-2' keywordspan='border col-span-6' keywordpad='border col-span-2'/> )}
        </div>
    );
}

const CompactDisplay = ({profiles}: WeaponProfileProps) => {
    const includeRange = profiles[0].range != "Melee";
    const skillSmall = includeRange ? `WS` : `BS`;
    return (
        <div className='grid grid-cols-6'>
            <div className='border col-span-6'>
            </div>
            <div className="border">
                R
            </div>
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

            {profiles.map(p => <WeaponProfileRow profile={p} includeRange={includeRange} namespane='border col-span-6' keywordspan='border col-span-6'/> )}
        </div>)
}


interface WeaponProfileRowProps {
    profile: Profile
    includeRange: boolean
    namespane: string
    keywordspan: string
    keywordpad?: string
}

const WeaponProfileRow = ({profile, namespane, keywordspan, keywordpad}: WeaponProfileRowProps) => {
    return (
        <>
            <div className={namespane}>
                <b>{profile.name}</b>
            </div>
            <div className="border">
                {profile.range}
            </div>
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
                <>
                    {keywordpad && <div className={keywordpad} />}
                    <div className={keywordspan}>
                        {profile.keywords.join(", ")}
                    </div>
                </>
            )}
        </>
    );
}