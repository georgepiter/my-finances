import {
  Container,
  Heading,
  HStack,
  Menu,
  MenuButton,
  useDisclosure,
  useToast,
  Button as ButtonBase,
  MenuList,
  MenuItem,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Flex,
  Spacer,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useColorMode,
  Tag,
  IconButton as IconButtonBase,
} from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import Box from "@/components/Box";
import Spinner from "@/components/Spinner";
import Layout from "@/components/template/Layout";
import { CategoryDTO } from "@/dto/http/CategoryDTO";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listAllCategory,
  updateCategory,
} from "@/services/category";

import { Input } from "@/components/Input";
import Button from "@/components/Button";
import { CategoryModel } from "@/models/category";
import IconButton from "@/components/IconButton";
import Divider from "@/components/Divider";
import DataTableBase from "@/components/DataTableBase";

import { useRegister } from "@/hooks/useRegister";


const insertFormSchema = z.object({
  description: z.string({
    required_error: "Digite a Descrição",
  }),
});

type FormDataProps = z.infer<typeof insertFormSchema>;

export default function Category() {
  const router = useRouter();
  const toast = useToast();

  const { colorMode } = useColorMode();

  const { registerBase } = useRegister();

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [category, setCategory] = useState<CategoryDTO>({} as CategoryDTO);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(insertFormSchema),
  });

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onClose: onCloseFormModal,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement>(null);

  function handleInsertCategory() {
    setIsEdit(false);
    setCategory({} as CategoryDTO);
    onOpenFormModal();
  }

  const columns = [
    {
      name: "Descrição",
      width: "80%",
      selector: (row: any) => (
        <Tag size="md" variant="solid" borderRadius="full" bg="primary.700">
          {row.description}
        </Tag>
      ),
    },
    {
      name: "Ações",
      selector: (row: any) => (
        <Menu>
          <MenuButton
            rounded={20}
            bg={colorMode == "dark" ? "gray.500" : "gray.50"}
            as={IconButtonBase}
            icon={<HamburgerIcon />}
          />
          <MenuList minWidth="150px">
            <MenuItem onClick={() => handleEditCategory(row.categoryId)}>
              <HStack flex={1} justifyContent="space-between">
                <Text>Editar</Text>
                <FiEdit2 />
              </HStack>
            </MenuItem>
            <MenuItem onClick={() => handleConfirmCategory(row.categoryId)}>
              <HStack flex={1} justifyContent="space-between">
                <Text>Excluir</Text>
                <FiTrash2 />
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  async function handleEditCategory(id: number) {
    setIsEdit(true);
    setCategoryId(id);

    try {
      const res = await getCategoryById(id);
      if (res.status === 200) {
        setCategory(res.data as CategoryDTO);
        onOpenFormModal();
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  function handleConfirmCategory(categoryId: number) {
    setCategoryId(categoryId);

    onOpenConfirm();
  }

  async function handleDeleteCategory() {
    try {
      const res = await deleteCategory(categoryId, registerBase.registerId);

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        onCloseConfirm();
        loadCategories(registerBase.registerId);
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  async function loadCategories(registerId: number) {
    setIsLoading(true);
    try {
      const res = await listAllCategory(registerId);
      if (res.data) {
        setCategories(res.data as CategoryDTO[]);
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForm(data: FormDataProps) {
    try {
      let res: any;
      if (isEdit) {
        const category: CategoryModel = {
          description: data.description,
          categoryId: categoryId,
          registerId: registerBase.registerId
        };
        res = await updateCategory(category);
      } else {
        const category: CategoryModel = {
          description: data.description,
          registerId: registerBase.registerId,
        };
        res = await createCategory(category);
      }

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        reset();
        onCloseFormModal();
        loadCategories(registerBase.registerId);
      } else {
        toast({
          title: res.data.message,
          status: "error",
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    if (registerBase.registerId) {
      loadCategories(registerBase.registerId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerBase.registerId]);

  useEffect(() => {
    reset(category);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  

  return (
    <Layout>
      {/* LIST CATEGORIES */}
      <Container maxW="6xl" mt={10}>
        <Box>
          <HStack display="flex" justifyContent="space-between">
            <Heading as="h4" size="md">
              Categorias
            </Heading>
            <Heading as="h4" size="md" mb={10}>
              <IconButton
                size="md"
                rounded={25}
                boxShadow="md"
                colorScheme="blue"
                aria-label="Insert Category"
                onClick={handleInsertCategory}
                icon={<FiPlus />}
              />
            </Heading>
          </HStack>
          <Divider mt={2} />
          <DataTableBase columns={columns} data={categories} title="" />
        </Box>

        {/* LIST CATEGORIES */}

        {/* INSERT USERS */}
        <Modal
          isCentered
          onClose={onCloseFormModal}
          isOpen={isOpenFormModal}
          motionPreset="slideInBottom"
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEdit ? "Edição" : "Cadastro"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(handleForm)}>
                <Stack spacing={4} w="100%">
                  <Controller
                    control={control}
                    name="description"
                    defaultValue={isEdit ? category.description : undefined}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        size="lg"
                        placeholder="Descrição"
                        errorMessage={errors.description?.message}
                        value={value || ""}
                        onChange={onChange}
                      />
                    )}
                  />
                </Stack>

                <Flex justifyContent="flex-end" mt={5}>
                  <Button
                    w={90}
                    title="Enviar"
                    type="submit"
                    isLoading={isSubmitting}
                  />
                </Flex>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* INSERT USERS */}

        <AlertDialog
          isOpen={isOpenConfirm}
          leastDestructiveRef={cancelRef}
          onClose={onCloseConfirm}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Deletar Categoria
              </AlertDialogHeader>

              <AlertDialogBody>
                Você tem certeza que deseja excluir essa categoria?
              </AlertDialogBody>

              <AlertDialogFooter>
                <ButtonBase onClick={onCloseConfirm}>Cancel</ButtonBase>
                <ButtonBase
                  colorScheme="red"
                  onClick={handleDeleteCategory}
                  ml={3}
                >
                  Delete
                </ButtonBase>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Layout>
  );
}
