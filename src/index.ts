import {
  moveItemDown,
  moveItemLeft,
  moveItemRight,
  moveItemUp,
} from "../tree/movement";
import {
  getItemAbove,
  getItemBelow,
  getItemToSelectAfterRemoving,
} from "../tree/selection";
import {
  Item,
  createItemAfter,
  isRoot,
  item,
  removeItemFromParent,
} from "../tree/tree";
import {
  childrenCountChanged,
  closeItem,
  isEditingNow,
  itemAdded,
  itemRemoved,
  openItem,
  renderApp,
  selectItem,
  startEdit,
  stopEdit,
  unSelectItem,
} from "./view";

const root = item("Root", [
  item("Carbon Based Lifeforms", [
    item("1998 - The Path"),
    item("2003 - Hydroponic Garden"),
    item("2006 - World Of Sleepers"),
    item("2010 - Interloper", [
      item("Track 1"),
      item("Track 2"),
      item("Track 3"),
    ]),
  ]),
  item("Circular"),
  item("I Awake"),
  item("James Murray"),
  item("Miktek"),
  item("Koan", [
    item("Koan - The Way Of One [ Full Album ] 2014"),
    item("Koan - Argonautica [Full Album]"),
    item("Koan - Condemned (Full Album) 2016"),
  ]),
  item("Zero Cult"),
  item("Androcell"),
  item("Scann-Tec"),
  item("Hol Baumann"),
  item("Asura"),
  item("Cell"),
  item("Biosphere"),
  item("Aes Dana"),
  item("Side Liner"),
  item("Fahrenheit Project"),
]);

window.addEventListener("keydown", (e) => {
  if (!selected) return;

  if ((isEditingNow() && e.code === "Enter") || e.code == "NumpadEnter") {
    stopEdit();
    return;
  } else if (isEditingNow()) {
    return;
  }

  const isMoving = e.metaKey && e.shiftKey;

  if (e.code === "ArrowDown") {
    e.preventDefault();
    if (isMoving) moveItemDown(selected);
    else changeSelection(getItemBelow(selected));
  }
  if (e.code === "ArrowUp") {
    e.preventDefault();
    if (isMoving) moveItemUp(selected);
    else changeSelection(getItemAbove(selected));
  }

  if (e.code === "ArrowLeft") {
    e.preventDefault();
    if (isMoving) moveItemLeft(selected);
    else if (selected.isOpen) {
      selected.isOpen = false;
      closeItem(selected);
    } else if (selected && selected.parent && !isRoot(selected.parent)) {
      changeSelection(selected.parent);
    }
  }

  if (e.code === "ArrowRight") {
    e.preventDefault();
    if (isMoving) moveItemRight(selected);
    else if (!selected.isOpen && selected.children.length > 0) {
      selected.isOpen = true;
      openItem(selected);
    } else if (selected && selected.children.length > 0) {
      changeSelection(selected.children[0]);
    }
  }
  if (e.code === "Enter") {
    e.preventDefault();
    const newI = createItemAfter(selected, "");

    itemAdded(newI);
    changeSelection(newI);
    startEdit(newI);
  }

  if (e.code === "KeyX") {
    e.preventDefault();
    const nextSelected = getItemToSelectAfterRemoving(selected);
    removeItemFromParent(selected);
    if (selected.parent) childrenCountChanged(selected.parent);
    itemRemoved(selected);
    changeSelection(nextSelected);
  }

  if (e.code === "KeyE") {
    e.preventDefault();
    startEdit(selected);
  }
});

document.body.append(renderApp(root));

let selected: Item | undefined;

function changeSelection(item: Item | undefined) {
  if (item) {
    if (selected) unSelectItem(selected);
    selectItem(item);
    selected = item;
  }
}
changeSelection(root.children[0]);
