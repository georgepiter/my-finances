import { useColorMode, useTheme } from "@chakra-ui/react";
import DataTable,{ TableColumn } from "react-data-table-component";

import classnames from "classnames";
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
            : theme.colors.gray["800"],
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
        minHeight: "56px",
        paddingLeft: "16px",
        paddingRight: "8px",
      },
    },
    headRow: {
      style: {
        fontSize: "16px",
        color:
          colorMode == "dark"
            ? theme.colors.gray["200"]
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
      // selectedHighlightStyle: {
      //   // use nth-of-type(n) to override other nth selectors
      //   "&:nth-of-type(n)": {
      //     color: "red",
      //     backgroundColor: "red",
      //     borderBottomColor: "red",
      //   },
      // },
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
    },
  };

  const paginationOptions = {
    rowsPerPageText: "Página:",
    rangeSeparatorText: "of",
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
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 10, 20]}
      className={colorMode === "dark" ? "dark" : "light"}
      paginationComponentOptions={paginationOptions}
    />
  );
}