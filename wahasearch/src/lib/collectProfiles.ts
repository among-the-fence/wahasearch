import { Profile } from "./models/profile";
import { ensureArray } from "./util";


export function collectSelectionProfiles(data: any) {
  const result = _collectSelectionProfiles(data);
  // console.log(result);

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

function _collectSelectionProfiles(data: any) {
  const result: any[] = [];
  if (data) {
    // console.log(data);
    ensureArray(data).forEach(item => {
      // if (item['@_targetId'])
      //   console.log("TARGET ID", data);
      if (item.profile)
        result.push(...ensureArray(item.profile));
      if (item.profiles) {
        if (item.profiles.profile)
          result.push(...ensureArray(item.profiles.profile));

      }
      if (item.selectionEntries?.selectionEntry)
        result.push(..._collectSelectionProfiles(item.selectionEntries.selectionEntry));
      if (item.selectionEntryGroups?.selectionEntryGroup)
        result.push(..._collectSelectionProfiles(item.selectionEntryGroups.selectionEntryGroup));
      if (item.entryLinks?.entryLink)
        result.push(..._collectSelectionProfiles(item.entryLinks.entryLink));
    });
  }
  // Dedupe profiles
  return result;
}
