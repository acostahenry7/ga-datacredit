import React from "react";
import DataTable from "react-data-table-component";
import { GiEmptyWoodBucket } from "react-icons/gi";
import { DNA } from "react-loader-spinner";

interface CustomDatatableProps {
  data: any[];
  columns: any[];
  isLoading: boolean;
  shadow?: boolean;
}

type SortDirection = "asc" | "desc";
type NormalizedType = "null" | "number" | "string";

const isNumericString = (value: string) => /^-?\d+(\.\d+)?$/.test(value.trim());

const normalizeSortValue = (
  value: unknown,
): {
  type: NormalizedType;
  value: number | string;
} => {
  if (value === null || value === undefined) return { type: "null", value: "" };

  if (typeof value === "number" && Number.isFinite(value)) {
    return { type: "number", value };
  }

  if (typeof value === "boolean") {
    return { type: "number", value: value ? 1 : 0 };
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return { type: "number", value: value.getTime() };
  }

  const str = String(value).trim();
  if (!str) return { type: "null", value: "" };

  if (isNumericString(str)) {
    return { type: "number", value: Number(str) };
  }

  const parsedDate = Date.parse(str);
  if (!Number.isNaN(parsedDate)) {
    return { type: "number", value: parsedDate };
  }

  return { type: "string", value: str.toLocaleLowerCase() };
};

const compareNormalized = (a: unknown, b: unknown): number => {
  const va = normalizeSortValue(a);
  const vb = normalizeSortValue(b);

  if (va.type === "null" && vb.type === "null") return 0;
  if (va.type === "null") return 1;
  if (vb.type === "null") return -1;

  if (va.type === "number" && vb.type === "number") {
    return (va.value as number) - (vb.value as number);
  }

  return String(va.value).localeCompare(String(vb.value), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const customSort = (
  rows: any[],
  selector: (row: any) => unknown,
  direction: SortDirection,
) => {
  const dir = direction === "desc" ? -1 : 1;
  return [...rows].sort(
    (a, b) => dir * compareNormalized(selector(a), selector(b)),
  );
};

const CustomDatatable = ({
  data,
  columns,
  isLoading,
  shadow,
}: CustomDatatableProps) => {
  //rows, headCells, cells
  const tableStyles = {
    responsiveWrapper: {
      style: {
        marginTop: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        boxShadow: shadow == true ? "0 -6px 15px 0 rgba(0, 0, 0, 0.1)" : "",
        backgroundColor: "#F2F5FF",
      },
    },
    table: {
      style: {
        // padding: 0,
        // fontFamily: "Poppins",
        // fontSize: 10,
      },
    },

    headCells: {
      style: {
        backgroundColor: "black",
        color: "#F2F5FF",
        fontSize: 14,
        fontWeight: 500,
        height: 68,
      },
    },

    rows: {
      style: {
        height: 45,
        backgroundColor: "#F2F5FF",
        fontFamily: "Poppins",
        fontSize: 12,
        color: "#828080",
        fontWeight: 400,
      },
    },
    pagination: {
      style: {
        height: 45,
        backgroundColor: "#F2F5FF",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.1)",
        // justifyContent: "center",
        // flexDirectios: "row-reverse",
        fontFamily: "Poppins",
        fontSize: 14,
      },
    },
    noData: {
      style: {
        backgroundColor: "#F2F5FF",
      },
    },
    progress: {
      style: {
        height: 160,
        backgroundColor: "#F2F5FF",
      },
    },
  };

  return (
    <DataTable
      customStyles={tableStyles}
      data={data}
      columns={columns}
      sortFunction={customSort}
      pagination
      progressPending={isLoading}
      progressComponent={
        <DNA wrapperStyle={{ opacity: 0.6 }} height="80" width="80" />
      }
      noDataComponent={
        <p className="py-11 flex flex-col items-center gap-3 opacity-70">
          <GiEmptyWoodBucket color="lightgray" size={40} />
          <span className="font-roboto text-slate-400 text-sm">
            No se encontraron registros
          </span>
        </p>
      }
      paginationComponentOptions={{
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
      }}
      // paginationRowsPerPageOptions={{
      //   selectAllRowsItem: true,
      // }}
      //selectableRows
      // onChangePage={() => {

      // }}
    />
  );
};

export default CustomDatatable;
