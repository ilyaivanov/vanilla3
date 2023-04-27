const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numbers = Array.from(new Array(10)).map((_, i) => i.toString());
const idAlphabet = alphabet
  .map((l) => l.toLocaleLowerCase())
  .concat(alphabet)
  .concat(numbers);

const length = 8;
export function generateRandomId() {
  let results = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * idAlphabet.length);
    results += idAlphabet[randomIndex];
  }

  return results;
}
