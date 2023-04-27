export function appendAll(container: Element, elems: Element[]) {
  for (const elem of elems) container.appendChild(elem);

  return container;
}

export function div(props: Props) {
  return assignCommonProperties(document.createElement("div"), props);
}

export function span(props: Props) {
  return assignCommonProperties(document.createElement("span"), props);
}

type InputProps = Props & {
  onInput: (e: Event) => void;
};
export function input(props: InputProps) {
  const res = document.createElement("input");
  res.addEventListener("input", props.onInput);
  return assignCommonProperties(res, props);
}

type Props = {
  children?: (Node | string | undefined)[] | string;
  style?: {};
  className?: string;
  classMap?: Record<string, boolean | undefined>;
  id?: string;
};
function assignCommonProperties<T extends HTMLElement>(
  elem: T,
  props: Props
): T {
  if (props.className) elem.className = props.className;
  if (props.classMap) {
    for (const className of Object.keys(props.classMap)) {
      if (props.classMap[className]) elem.classList.add(className);
    }
  }
  if (props.id) elem.id = props.id;

  const { children } = props;
  if (children) {
    if (typeof children === "string") elem.textContent = children;
    else for (const child of children) child && elem.append(child);
  }

  if (props.style) Object.assign(elem.style, props.style);

  return elem;
}
