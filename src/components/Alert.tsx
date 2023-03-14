import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button as ButtonBase,
} from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
  color?: string;
  isOpen: boolean;
  buttonTitle?: string;
  onOpen: () => void;
  onClose: () => void;
  onClick: () => Promise<void>;
  cancelRef: any;
}

export default function Alert({
  title,
  description,
  color = "primary",
  buttonTitle = "Confirmar",
  isOpen,
  onOpen,
  onClose,
  onClick,
  cancelRef
}: Props) {

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{description}</AlertDialogBody>

            <AlertDialogFooter>
              <ButtonBase onClick={onClose}>Cancel</ButtonBase>
              <ButtonBase colorScheme="red" onClick={onClick} ml={3}>
                {buttonTitle}
              </ButtonBase>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
