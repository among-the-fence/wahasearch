
import { Profile } from "@/models/faction";

interface WeaponProfileProps {
    profiles: Profile[]
}

function randomKey(profile: Profile) {
    return profile.name + Math.random().toString(36).substring(2, 25);
}

export const WeaponProfile = ({profiles}: WeaponProfileProps) => {
    // const keywords = profile.keywords.length > 0 ? `${profile.keywords.join(", ")}` : null;

    return (<>
            <div className="hidden md:block">
                <RegularDisplay profiles={profiles} />
            </div>
            <div className="hidden sm:block md:hidden">
                <RegularDisplay profiles={profiles} />
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

    return ( includeRange ? (
        <div className='grid grid-cols-8'>
            <div className='border col-span-2'>
            </div>
            {includeRange && 
                <div className="border">
                    Range
                </div>
            }
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

            {profiles.map(p => <WeaponProfileRow key={randomKey(p)} profile={p} includeRange={includeRange} namespane='border col-span-2' keywordspan='border col-span-6' keywordpad='border col-span-2'/> )}
        </div>
    ) : (
        <div className='grid grid-cols-7'>
            <div className='border col-span-2'>
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

            {profiles.map(p => <WeaponProfileRow key={randomKey(p)}  profile={p} includeRange={includeRange} namespane='border col-span-2' keywordspan='border col-span-5' keywordpad='border col-span-2'/> )}
        </div>
    ));
}

const CompactDisplay = ({profiles}: WeaponProfileProps) => {
    const includeRange = profiles[0].range != "Melee";
    const skillSmall = includeRange ? `WS` : `BS`;
    return (includeRange ? (
            <div className='grid grid-cols-6'>
                {includeRange && 
                <div className="border">
                    R
                </div>}
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

                {profiles.map(p => <WeaponProfileRow key={randomKey(p)}  profile={p} includeRange={includeRange} namespane='border col-span-6' keywordspan='border col-span-6'/> )}
            </div>
        ) : (
            <div className='grid grid-cols-5'>
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
    
                {profiles.map(p => <WeaponProfileRow key={randomKey(p)} profile={p} includeRange={includeRange} namespane='border col-span-5' keywordspan='border col-span-5'/> )}
            </div>
        )); 
}


interface WeaponProfileRowProps {
    profile: Profile
    includeRange: boolean
    namespane: string
    keywordspan: string
    keywordpad?: string
}

const WeaponProfileRow = ({profile, includeRange, namespane, keywordspan, keywordpad}: WeaponProfileRowProps) => {
    return (
        <>
            <div className={namespane}>
                <b>{profile.name}</b>
            </div>
            {includeRange && 
            <div className="border">
                {profile.range}
            </div>}
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