import { useColorMode, useTheme } from "@chakra-ui/react";
import DataTable,{ TableColumn } from "react-data-table-component";


interface TableProps<T> extends TableColumn<T> {
  name: string;
  selector: (row: T) => any;
  width?: string;
}

interface Props {
  columns: TableProps<any>[];
  data: any[];
  title?: string;
}

export default function DataTableBase({ columns, data, title = "" }: Props) {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const tableCustomStyles = {
    table: {
      style: {
        marginBottom: data.length <= 2 ? "90px" : "",
        color:
          colorMode == "dark"
            ? theme.colors.gray["300"]
            : theme.colors.gray["500"],
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
      },
    },
    headRow: {
      style: {
        fontSize: "17px",
        color:
          colorMode == "dark"
            ? theme.colors.gray["50"]
            : theme.colors.gray["500"],
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
      },
    },
    rows: {
      style: {
        marginBottom: data.length <= 2 ? "10px" : "",
        color: colorMode == "dark" ? "white" : "black",
        backgroundColor:
          colorMode == "dark" ? theme.colors.gray["800"] : "white",
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
    },
  };

  const paginationOptions = {
    rowsPerPageText: "Página:",
    rangeSeparatorText: "de",
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