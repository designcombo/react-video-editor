import { ITrackItemsMap, ITransition } from "@designcombo/types";
import UnionFind from "./union-find";
import { cloneDeep } from "lodash";

export const groupTrackItems = (data: {
  trackItemIds: string[];
  transitionsMap: Record<string, ITransition>;
  trackItemsMap: ITrackItemsMap;
}): string[][] => {
  const { trackItemIds, transitionsMap, trackItemsMap } = data;

  // Create a mapping of trackItemIds to indices
  const indexMap: { [key: string]: number } = {};
  trackItemIds.forEach((id, idx) => {
    indexMap[id] = idx;
  });

  const uf = new UnionFind(trackItemIds.length);
  const orderMap: { [key: string]: string[] } = {};
  const transitionsData = Object.values(transitionsMap).map(
    (transition) =>
      trackItemsMap[transition.fromId] &&
      cloneDeep({
        ...transition,
        fromValue: trackItemsMap[transition.fromId].display.from,
      }),
  );
  const orderTransitionsDataByFrom = transitionsData.sort((a, b) => {
    return a.fromValue - b.fromValue;
  });

  orderTransitionsDataByFrom.forEach((transition) => {
    if (!transition) return;
    const fromIndex = indexMap[transition.fromId];
    const toIndex = indexMap[transition.toId];
    uf.union(fromIndex, toIndex);

    const rootFrom = uf.find(fromIndex);
    const rootTo = uf.find(toIndex);

    if (!orderMap[rootFrom]) {
      orderMap[rootFrom] = [];
    }
    if (!orderMap[rootTo]) {
      orderMap[rootTo] = [];
    }

    if (!orderMap[rootFrom].includes(transition.fromId)) {
      orderMap[rootFrom].push(transition.fromId);
    }
    if (!orderMap[rootTo].includes(transition.toId)) {
      orderMap[rootTo].push(transition.toId);
    }
  });

  // Group items by their root parent and maintain order
  const groups: { [key: number]: string[] } = {};
  trackItemIds.forEach((id) => {
    const root = uf.find(indexMap[id]);
    if (!groups[root]) {
      groups[root] = [];
    }
    if (!groups[root].includes(id)) {
      groups[root].push(id);
    }
  });

  // Ensure the order within each group
  const groupedItems = Object.values(groups).map((group) => {
    return group.sort((a, b) => {
      const aIndex = orderMap[uf.find(indexMap[a])].indexOf(a);
      const bIndex = orderMap[uf.find(indexMap[b])].indexOf(b);
      return aIndex - bIndex;
    });
  });
  return groupedItems;
};
