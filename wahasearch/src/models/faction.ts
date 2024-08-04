export interface FactionRoot {
    colours: Colours
    datasheets: Datasheet[]
    detachments: string[]
    enhancements: Enhancement[]
    id: string
    is_subfaction: boolean
    link: string
    name: string
    parent_id: string
    stratagems: Stratagem[]
    updated: string
  }
  
  export interface Colours {
    banner: string
    header: string
  }
  
  export interface Datasheet {
    uuid?: string
    colours?: Colours
    abilities: Abilities
    composition: string[]
    factions: string[]
    faction_id: string
    fluff: string
    id: string
    keywords: string[]
    leader: string
    loadout?: string
    meleeWeapons: MeleeWeapon[]
    name: string
    points: Point[]
    rangedWeapons: RangedWeapon[]
    source: string
    stats: Stat[]
    transport: string
    wargear: string[]
    leads?: Leads
    imperialArmour?: boolean
    leadBy?: string[]
    legends?: boolean
    indexedFields?: IndexedFields
  }

  export interface IndexedFields {
    stats: Stat[]
    weaponProfiles: Profile[]
    compiledKeywords?: string[]
  }
  
  export interface Abilities {
    core: string[]
    damaged: Damaged
    faction: string[]
    invul: Invul
    other: Other[]
    primarch: any[]
    special: Special[]
    wargear: Wargear[]
  }
  
  export interface Damaged {
    description: string
    range: string
  }
  
  export interface Invul {
    info: string
    value: string
  }
  
  export interface Other {
    name: string
    description: string
  }
  
  export interface Special {
    description: string
    name: string
  }
  
  export interface Wargear {
    name: string
    description: string
  }
  
  export interface MeleeWeapon {
    profiles: Profile[]
  }
  
  export interface Profile {
    ap: string
    attacks: string
    damage?: string
    keywords: string[]
    name: string
    range: string
    skill: string
    strength: string
  }
  
  export interface Point {
    cost: string
    models: string
  }
  
  export interface RangedWeapon {
    profiles: Profile[]
    abilities?: Ability[]
  }
  
  export interface Ability {
    name: string
    description: string
  }
  
  export interface Stat {
    ld: string
    m: string
    name: string
    oc: string
    sv: string
    t: string
    w: string
    uuid?: string
  }
  
  export interface Leads {
    extra: string
    units: string[]
  }
  
  export interface Enhancement {
    name: string
    id: string
    cost: string
    keywords: string[]
    excludes: any[]
    description: string
    faction_id: string
    detachment: string
  }
  
  export interface Stratagem {
    name: string
    id: string
    cost: number
    turn: string
    target: string
    when: string
    effect: string
    restrictions: string
    type: string
    phase: string[]
    faction_id: string
    fluff: string
    detachment: string
  }
  