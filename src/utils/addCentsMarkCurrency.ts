export function addCentsMarkCurrency(value?: string) {
  if (!value)
    return value;

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
import createNumberMask from "text-mask-addons/dist/createNumberMask";

export function currencyMask(rawValue: string) {
  let numberMask = createNumberMask({
    prefix: "$",
    includeThousandsSeparator: true,
    allowDecimal: true,
    requireDecimal: true,
    allowLeadingZeroes: false,
  });
  let mask = numberMask(rawValue);

  let decimalsRegex = /\.([0-9]{1,2})/;
  let result = decimalsRegex.exec(rawValue);
  // In case there is only one decimal
  if (result && result[1].length < 2) {
    mask.push("0");
  } else if (!result) {
    mask.push("0");
    mask.push("0");
  }

  return mask;
}