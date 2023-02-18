import {
  Select as SelectBase,
  SelectProps,
  useColorMode,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

export interface OptionProps {
  value: number;
  description: string;
}

interface Props extends SelectProps {
  placeholder: string;
  options: OptionProps[];
  errorMessage?: string | null;
}

export default function Select({ 
  placeholder, options, isInvalid, errorMessage = null, ...rest }: Props) {
  const { colorMode } = useColorMode();

  const invalid = !!errorMessage || isInvalid;

  return (
    <>
      <FormControl isInvalid={invalid}>
        <SelectBase
          bg={colorMode === "dark" ? "gray.800" : "white"}
          placeholder={placeholder}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.description}
            </option>
          ))}
        </SelectBase>
        <FormErrorMessage mt={0} flex={1} justifyContent="flex-start" w="100%">
          {errorMessage}
        </FormErrorMessage>
      </FormControl>
    </>
  );
}
