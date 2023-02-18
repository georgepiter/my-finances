export function convertRealToNumber(value: string) {
  return Number(value.replace(".", "").replace(",", ".").replace("R$ ", ""));
}
