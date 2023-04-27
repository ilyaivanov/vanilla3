import { div, span } from "./html";
import { Item, getContext, getItemLevel } from "../tree/tree";
import "./view.scss";

export function renderApp(root: Item) {
  return viewChildren(root, 0);
}

type ViewModel = {};
const viewModels: Map<Item, ViewModel> = new Map();

function viewItem(item: Item, level: number): HTMLElement {
  return div({
    id: ids.container(item),
    children: [
      div({
        className: `row row-${level}`,
        children: [
          div({
            id: ids.icon(item),
            className: "icon",
            classMap: { empty: item.children.length == 0 },
          }),
          span({
            id: ids.text(item),
            className: "row-text",
            children: item.title,
          }),
        ],
      }),
      item.isOpen ? viewChildren(item, level + 1) : undefined,
    ],
  });
}

function viewChildren(item: Item, level: number) {
  const children = item.children.map((child) => viewItem(child, level));
  if (level > 0)
    children.push(
      div({ className: `children-line children-line-${level - 1}` })
    );

  return div({
    id: ids.children(item),
    className: "children-container",
    children,
  });
}

const getElementById = (id: string) => document.getElementById(id);

const ids = {
  container: (item: Item) => item.id,
  text: (item: Item) => item.id + "-text",
  icon: (item: Item) => item.id + "-icon",
  children: (item: Item) => item.id + "-children",
};

// Actions (make sure these are as simple as possible)
export function updateText(item: Item) {
  const text = getElementById(ids.text(item));
  if (text) text.innerText = item.title;
}

export function selectItem(item: Item) {
  getElementById(ids.container(item))?.classList.add("selected");
}

export function unSelectItem(item: Item) {
  getElementById(ids.container(item))?.classList.remove("selected");
}

export function closeItem(item: Item) {
  getElementById(ids.children(item))?.remove();
}

export function openItem(item: Item) {
  getElementById(ids.container(item))?.appendChild(
    viewChildren(item, getItemLevel(item) + 1)
  );
}
export function itemMoved(item: Item, oldLevel: number) {
  const elem = getElementById(ids.container(item));
  if (elem) {
    elem.remove();
    viewItemAtItsPlace(item, elem);
    onLevelChanged(elem, oldLevel, getItemLevel(item));
  }
}

export function itemRemoved(item: Item) {
  getElementById(ids.container(item))?.remove();
}

export function itemAdded(item: Item) {
  viewItemAtItsPlace(item, viewItem(item, getItemLevel(item)));
}

export function viewItemAtItsPlace(item: Item, elem: HTMLElement) {
  if (item.parent) {
    const context = getContext(item);
    const index = context.indexOf(item);
    const container = getElementById(ids.children(item.parent));
    if (container) {
      container.insertBefore(elem, container.children[index]);
    }
  }
}

function onLevelChanged(
  container: HTMLElement,
  oldLevel: number,
  newLevel: number
) {
  if (oldLevel == newLevel) return;

  const diff = newLevel - oldLevel;

  requestAnimationFrame(() => {
    updateLevelOfClass(container, "row", diff);
    updateLevelOfClass(container, "children-line", diff);
  });
}

function updateLevelOfClass(
  container: HTMLElement,
  prefix: string,
  diff: number
) {
  const selector = `.${prefix}`;
  const classStart = `${prefix}-`;
  for (const child of container.querySelectorAll(selector)) {
    let currentLevel = -1;
    for (const className of child.classList) {
      if (className.startsWith(classStart)) {
        currentLevel = parseInt(className.substring(classStart.length));
        child.classList.remove(className);
        break;
      }
    }

    if (currentLevel == -1) throw new Error(`Can't find any row-* classes`);
    child.classList.add(classStart + (currentLevel + diff));
  }
}

export function childrenCountChanged(item: Item) {
  const icon = getElementById(ids.icon(item));
  if (item.children.length > 0) icon?.classList.remove("empty");
  else icon?.classList.add("empty");
}

//editing
let elementEdited: HTMLElement | undefined;
export function startEdit(item: Item) {
  elementEdited = getElementById(ids.text(item)) || undefined;
  if (elementEdited) {
    elementEdited.contentEditable = "true";
    elementEdited.focus();
    var range = document.createRange();
    range.setStart(elementEdited, 0);
    range.collapse(true);

    var selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    elementEdited.addEventListener("input", () => {
      item!.title = elementEdited!.innerText;
      if (item!.title.length == 0) elementEdited!.innerHTML = "&nbsp;";
    });
    if (item!.title.length == 0) elementEdited!.innerHTML = "&nbsp;";
    elementEdited.addEventListener("blur", onBlur);
  }
}

export function stopEdit() {
  if (elementEdited) {
    elementEdited.removeEventListener("blur", onBlur);
    elementEdited.removeAttribute("contenteditable");
    elementEdited.blur();
    elementEdited = undefined;
  }
}

export function isEditingNow() {
  return !!elementEdited;
}

function onBlur() {
  stopEdit();
}
