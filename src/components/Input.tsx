
import { Button, FormControl, FormErrorMessage, forwardRef, Input as InputBase, InputGroup, InputLeftElement, InputProps, InputRightElement, useColorMode } from "@chakra-ui/react";
import { FiEyeOff, FiEye } from "react-icons/fi";

import { useState } from "react";

interface Props extends InputProps {
  type?: string;
  size: string;
  iconLeft?: React.ReactNode | null;
  errorMessage?: string | null;
}

export const Input = forwardRef(
  ({ type = "text", size, isInvalid, errorMessage = null, iconLeft = null, ...rest }: Props, ref) => {
    const { colorMode } = useColorMode();
    const [showPassword, setShowPassword] = useState(false);

    const invalid = !!errorMessage || isInvalid;

    function handleShowPassword() {
      setShowPassword(!showPassword);
    }
    return (
      <>
        <FormControl isInvalid={invalid}>
          <InputGroup>
            {iconLeft && (
              <InputLeftElement pointerEvents="none">
                {iconLeft}
              </InputLeftElement>
            )}
            <InputBase
              bg={colorMode === "dark" ? "gray.800" : "white"}
              type={type === "password" && showPassword ? "text" : type}
              placeholder="medium size"
              size={size}
              {...rest}
              ref={ref}
              isInvalid={invalid}
            />
            {type === "password" && (
              <InputRightElement width="4.5rem">
                <Button
                  mr={-5}
                  h="1.75rem"
                  size="sm"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </InputRightElement>
            )}
          </InputGroup>

          <FormErrorMessage
            mt={0}
            flex={1}
            justifyContent="flex-start"
            w="100%"
          >
            {errorMessage}
          </FormErrorMessage>
        </FormControl>
      </>
    );
  }
);