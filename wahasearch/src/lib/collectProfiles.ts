import { Profile } from "./models/profile";
import { ensureArray } from "./util";


export function collectSelectionProfiles(data: any, sharedProfiles: Map<string, any>) {
  const result = _collectSelectionProfiles(data, sharedProfiles);
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



function _collectSelectionProfiles(data: any, sharedProfiles: Map<string, any>) {
  const result: any[] = [];
  if (data) {
    // console.log(data);
    ensureArray(data).forEach(item => {
      if (item['@_targetId']) {
        // console.log(item['@_targetId'], sharedProfiles?.get(item['@_targetId']));
        if (sharedProfiles?.has(item['@_targetId'])) {
          const profile = sharedProfiles.get(item['@_targetId']);
          const x = _collectSelectionProfiles(profile.data, new Map<string, any>());
          // console.log("collecting shared profile", item['@_targetId'], x);
          result.push(...x);
        }
      }
      if (item.profile)
        result.push(...ensureArray(item.profile));
      if (item.profiles) {
        if (item.profiles.profile)
          result.push(...ensureArray(item.profiles.profile));

      }
      if (item.selectionEntries?.selectionEntry)
        result.push(..._collectSelectionProfiles(item.selectionEntries.selectionEntry, sharedProfiles));
      if (item.selectionEntryGroups?.selectionEntryGroup)
        result.push(..._collectSelectionProfiles(item.selectionEntryGroups.selectionEntryGroup, sharedProfiles));
      if (item.entryLinks?.entryLink)
        result.push(..._collectSelectionProfiles(item.entryLinks.entryLink, sharedProfiles));
    });
  }
  // Dedupe profiles
  return result;
}
