export function convertRealToNumber(value) {
  return Number(value.replace(".", "").replace(",", ".").replace("R$ ", ""));
}
