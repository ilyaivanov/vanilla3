import { generateRandomId } from "./id";

export type Item = {
  title: string;
  id: string;
  children: Item[];
  isOpen: boolean;

  // extra data
  parent?: Item;

  type?: "YTvideo";
  videoId?: string;
};

export function item(text: string, children: Item[] = []): Item {
  const res: Item = {
    title: text,
    id: generateRandomId(),
    children: children,
    isOpen: children.length > 0,
  };
  if (children) for (const child of children) child.parent = res;
  return res;
}

export function video(text: string, videoId: string) {
  const res = item(text);
  res.type = "YTvideo";
  res.videoId = videoId;
  return res;
}

export function removeItemFromParent(item: Item) {
  const context = getContext(item);
  context.splice(context.indexOf(item), 1);
}

export function getContext(item: Item) {
  if (item.parent) {
    const context = item.parent.children;

    if (!context)
      throw new Error(
        `'${item.title}' references a parent '${item.parent.title}' without children`
      );
    return context;
  }
  throw new Error(
    `Attempt to get context from '${item.title}' which doesn't have a parent`
  );
}

export function createItemAfter(afterWhichToInsert: Item, text = ""): Item {
  const newItem = item(text);
  insertItemAfter(afterWhichToInsert, newItem);
  return newItem;
}
export function insertItemAfter(afterWhichToInsert: Item, newItem: Item) {
  if (newItem.parent) removeItemFromParent(newItem);

  const context = getContext(afterWhichToInsert);
  context.splice(context.indexOf(afterWhichToInsert) + 1, 0, newItem);
  newItem.parent = afterWhichToInsert.parent;
}

export function insertAsLastChild(parent: Item, item: Item) {
  removeItemFromParent(item);
  parent.children.push(item);
  item.parent = parent;
}

export function getItemLevel(item: Item) {
  let level = 0;
  let i: Item | undefined = item;
  while (i && i.parent && !isRoot(i.parent)) {
    level += 1;
    i = i.parent;
  }
  return level;
}

export function isRoot(item: Item) {
  return !item.parent;
}
