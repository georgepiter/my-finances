export function addCentsMarkCurrency(value: string) {
  if (!value)
    return "R$ 0,00";

  const rawValue = value
    .replace("R$", "")
    .replaceAll(".", "")
    .replaceAll(",", ".");

  let result = /\.([0-9]{1,2})/.exec(rawValue);
  if (result && result[1].length < 2) {
    value += "0";
  } else if (!result) {
    value += ",00";
  }
  return value;
}
