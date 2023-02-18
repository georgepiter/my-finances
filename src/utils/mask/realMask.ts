import createNumberMask from "text-mask-addons/dist/createNumberMask";

export const realMask = createNumberMask({
  prefix: "R$ ",
  thousandsSeparatorSymbol: ".",
  allowDecimal: true,
  decimalSymbol: ",",
  decimalLimit: 2,
  integerLimit: 7,
  includeThousandsSeparator: true,
});
