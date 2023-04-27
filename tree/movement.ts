import { childrenCountChanged, itemMoved, openItem } from "../src/view";
import { getPreviousSibling } from "./selection";
import {
  Item,
  getContext,
  getItemLevel,
  insertAsLastChild,
  insertItemAfter,
  isRoot,
} from "./tree";

export function moveItemDown(item: Item) {
  const context = getContext(item);
  const index = context.indexOf(item);
  if (index < context.length - 1) {
    context.splice(index, 1);
    context.splice(index + 1, 0, item);

    //UI
    itemMoved(item, getItemLevel(item));
  }
}

export function moveItemUp(item: Item) {
  const context = getContext(item);
  const index = context.indexOf(item);
  if (index > 0) {
    context.splice(index, 1);
    context.splice(index - 1, 0, item);

    //UI
    itemMoved(item, getItemLevel(item));
  }
}

export function moveItemRight(item: Item) {
  const previousSibling = getPreviousSibling(item);
  if (previousSibling) {
    //Tree
    if (!previousSibling.isOpen) {
      previousSibling.isOpen = true;

      //UI
      openItem(previousSibling);
    }

    //Tree
    const currentLevel = getItemLevel(item);
    insertAsLastChild(previousSibling, item);

    //UI
    itemMoved(item, currentLevel);
    childrenCountChanged(previousSibling);
  }
}

export function moveItemLeft(item: Item) {
  const parent = item.parent;
  if (parent && !isRoot(parent)) {
    //Tree
    const currentLevel = getItemLevel(item);
    insertItemAfter(parent, item);
    if (parent.children.length == 0) parent.isOpen = false;

    //UI
    childrenCountChanged(parent);
    itemMoved(item, currentLevel);
  }
}
