import createNumberMask from "text-mask-addons/dist/createNumberMask";

export const realMask = createNumberMask({
  prefix: "R$ ",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ".",
  allowDecimal: true,
  decimalSymbol: ",",
  decimalLimit: 2,
  integerLimit: 7,
 // requireDecimal: true,
  allowLeadingZeroes: true,
});


