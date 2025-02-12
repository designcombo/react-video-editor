import { ITrackItemsMap, ITransition, ITrackItem } from "@designcombo/types";

type GroupElement = ITrackItem | ITransition;

export const groupTrackItems = (data: {
  trackItemIds: string[];
  transitionsMap: Record<string, ITransition>;
  trackItemsMap: ITrackItemsMap;
}): GroupElement[][] => {
  const { trackItemIds, transitionsMap, trackItemsMap } = data;

  // Create a map to track which items are part of transitions
  const itemTransitionMap = new Map<string, ITransition[]>();

  // Initialize transition maps
  Object.values(transitionsMap).forEach((transition) => {
    const { fromId, toId, kind } = transition;
    if (kind === "none") return; // Skip transitions of kind 'none'
    if (!itemTransitionMap.has(fromId)) itemTransitionMap.set(fromId, []);
    if (!itemTransitionMap.has(toId)) itemTransitionMap.set(toId, []);
    itemTransitionMap.get(fromId)?.push(transition);
    itemTransitionMap.get(toId)?.push(transition);
  });

  const groups: GroupElement[][] = [];
  const processed = new Set<string>();

  // Helper function to build a connected group starting from an item
  const buildGroup = (startItemId: string): GroupElement[] => {
    const group: GroupElement[] = [];
    let currentId = startItemId;

    while (currentId) {
      if (processed.has(currentId)) break;

      processed.add(currentId);
      const currentItem = trackItemsMap[currentId];
      group.push(currentItem);

      // Find transition from this item
      const transition = Object.values(transitionsMap).find(
        (t) => t.fromId === currentId && t.kind !== "none", // Filter here
      );
      if (!transition) break;

      group.push(transition);
      currentId = transition.toId;
    }

    return group;
  };

  // Process all items
  for (const itemId of trackItemIds) {
    if (processed.has(itemId)) continue;

    // If item is not part of any transition or is the start of a sequence
    if (
      !itemTransitionMap.has(itemId) ||
      !Object.values(transitionsMap).some((t) => t.toId === itemId)
    ) {
      const group = buildGroup(itemId);
      if (group.length > 0) {
        groups.push(group);
      }
    }
  }

  // Sort items within each group by display.from
  groups.forEach((group) => {
    group.sort((a, b) => {
      if ("display" in a && "display" in b) {
        return a.display.from - b.display.from;
      }
      return 0;
    });
  });

  return groups;
};
