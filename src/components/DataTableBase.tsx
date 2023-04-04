import { useColorMode, useTheme } from "@chakra-ui/react";
import DataTable,{ TableColumn } from "react-data-table-component";

interface Props {
  columns: TableColumn<any>[];
  data: any[];
  title?: string;
}

export default function DataTableBase({ columns, data, title = "" }: Props) {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const tableCustomStyles = {
    table: {
      style: {
        color:
          colorMode == "dark"
            ? theme.colors.gray["300"]
            : theme.colors.gray["500"],
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
      },
    },
    header: {
      style: {
        fontSize: "22px",
        color:
          colorMode == "dark"
            ? theme.colors.gray["200"]
            : theme.colors.gray["500"],
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
        minHeight: "56px",
        paddingLeft: "16px",
        paddingRight: "8px",
      },
    },
    headRow: {
      style: {
        fontSize: "15px",
        color:
          colorMode == "dark"
            ? theme.colors.gray["300"]
            : theme.colors.gray["500"],
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
      },
    },
    rows: {
      style: {
        color: colorMode == "dark" ? "white" : "black",
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
      },
      selectedHighlightStyle: {
        // use nth-of-type(n) to override other nth selectors
        "&:nth-of-type(n)": {
          color: "red",
          backgroundColor: "red",
          borderBottomColor: "red",
        },
      },
    },
    noData: {
      style: {
        color: colorMode == "dark" ? "white" : "black",
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
      },
    },
    pagination: {
      style: {
        color:
          colorMode == "dark"
            ? theme.colors.gray["300"]
            : theme.colors.gray["500"],
        fontSize: "13px",
        minHeight: "56px",
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
      },
      pageButtonsStyle: {
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        padding: "8px",
        margin: "px",
        cursor: "pointer",
        transition: "0.4s",
        color: colorMode == "dark" ? theme.colors.gray["900"] : "gray.50",
        fill: colorMode == "dark" ? theme.colors.gray["900"] : "gray.50",
        backgroundColor: "transparent",
        "&:disabled": {
          cursor: "unset",
          color: colorMode == "dark" ? theme.colors.gray["900"] : "gray.50",
          fill: colorMode == "dark" ? theme.colors.gray["900"] : "gray.50",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "red",
        },
        "&:focus": {
          outline: "none",
          backgroundColor: "red",
        },
      },
    },
  };

  return (
    <DataTable
      title={title}
      columns={columns}
      data={data}
      pagination
      fixedHeaderScrollHeight="300px"
      customStyles={tableCustomStyles}
      noDataComponent="Nenhum registro encontrado."
    />
  );
}