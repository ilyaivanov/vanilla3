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
  insertAsLastChild,
  isRoot,
  item,
  removeItemFromParent,
} from "../tree/tree";
import { initialRoot } from "./initial";
import { loadFromFile } from "./persistance";
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

window.addEventListener("keydown", (e) => {
  if ((isEditingNow() && e.code === "Enter") || e.code == "NumpadEnter") {
    stopEdit();
    return;
  } else if (isEditingNow()) {
    return;
  }

  if (e.code === "Enter") {
    e.preventDefault();
    let newI: Item;
    if (selected) {
      newI = createItemAfter(selected, "");
    } else {
      newI = item("");
      app!.root.children.push(newI);
      newI.parent = app!.root;
    }

    itemAdded(newI);
    changeSelection(newI);
    startEdit(newI);
  }

  if (!selected) return;

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

  if (e.code === "KeyL" && e.ctrlKey) {
    e.preventDefault();
    loadFromFile().then((newRoot) => {
      init({ root: newRoot, selectedItem: newRoot.children[0] });
    });
  }
});

let selected: Item | undefined;

function changeSelection(item: Item | undefined) {
  if (item) {
    if (selected) unSelectItem(selected);
    selectItem(item);
    selected = item;
  }
}
let app: AppState | undefined;
function init(_app: AppState) {
  app = _app;
  document.body.replaceChildren(renderApp(app.root));
  changeSelection(app.selectedItem);
}

type AppState = {
  root: Item;
  selectedItem: Item;
};

init({ root: initialRoot, selectedItem: initialRoot.children[0] });
