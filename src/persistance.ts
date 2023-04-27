import type { Item } from "../tree/tree";

export type AppState = {
  root: Item;
  selectedId: string;
};

const USE_LOCAL_STORAGE = true;
const key = "viztly:v3";

const types = [
  { description: "Viztly JSON File", accept: { "json/*": [".json"] } },
];

export const saveToFile = async (state: AppState) => {
  if (window.showSaveFilePicker) {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "viztly.json",
      types,
    });

    const myFile = await fileHandle.createWritable();
    await myFile.write(serialize(state));
    await myFile.close();
  } else {
    throw new Error("Browser doesn't have showSaveFilePicker");
  }
};

export const loadFromFile = async (): Promise<Item> => {
  if (window.showOpenFilePicker) {
    const [fileHandle] = await window.showOpenFilePicker({ types });

    const fileData = await fileHandle.getFile();
    const t = await fileData.text();
    return parse(t);
  } else {
    throw new Error("Browser doesn't have showOpenFilePicker");
  }
};

export const saveToLocalStorage = (app: AppState) => {
  localStorage.setItem(key, serialize(app));
};

export const loadFromLocalStorage = (): Item | undefined => {
  if (USE_LOCAL_STORAGE) {
    const serialized = localStorage.getItem(key);
    return serialized ? parse(serialized) : undefined;
  }
  return undefined;
};

const parse = (serializedTree: string): Item => {
  const app: AppState = JSON.parse(serializedTree);

  const mapItem = (item: Item): Item => {
    const res: Item = item;
    res.children = item.children.map((c) => {
      const item = mapItem(c);
      item.parent = res;
      return item;
    });
    return res;
  };

  mapItem(app.root);
  return app.root;
};

const serialize = ({ root }: AppState): string => {
  function replacer(key: keyof Item, value: unknown) {
    if (key == "parent") return undefined;
    else return value;
  }
  return JSON.stringify({ root }, (key, value) =>
    replacer(key as keyof Item, value)
  );
};
