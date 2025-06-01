import { Profile } from "./models/profile";
import { ensureArray } from "./util";

export function collectSelectionProfiles(data: any) {
  const result: any[] = [];
  if (data) {
    console.log(data);
    ensureArray(data).forEach(item => {
      if (item.profile)
        result.push(...ensureArray(item.profile));
      if (item.profiles){
        if (item.profiles.profile)
          result.push(...ensureArray(item.profiles.profile));
        
      }
      if (item.selectionEntries?.selectionEntry)
        result.push(...collectSelectionProfiles(item.selectionEntries.selectionEntry));
      if (item.selectionEntryGroups?.selectionEntryGroup)
        result.push(...collectSelectionProfiles(item.selectionEntryGroups.selectionEntryGroup));
      if (item.entryLinks?.entryLink)
        result.push(...collectSelectionProfiles(item.entryLinks.entryLink));
    });
  }
  // Dedupe profiles
  const uniqueProfiles = new Map<string, Profile>();
  result.forEach(profile => {
    if (profile instanceof Profile) {
      uniqueProfiles.set(profile.name, profile);
    }
    else {
      const x = new Profile(profile);
        uniqueProfiles.set(x.name, x);
      }
  });
  return Array.from(uniqueProfiles.values());
}
