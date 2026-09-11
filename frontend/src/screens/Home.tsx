import { useEffect, useMemo, useState } from "react";
import { getDatacreditApi } from "../api/dataCredit";
import CustomDatatable from "../components/CustomDatatable";
import { currencyFormat, normalizeText } from "../helpers/uiFormat";
import {
  DATACREDIT_FIELDS,
  SEARCH_FIELD,
} from "../helpers/datacreditFields";
import ColumnToggle from "../components/ColumnToggle";
import Button from "../components/Button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import useAuth from "../hooks/useAuth";
import { FiSearch, FiX } from "react-icons/fi";

// Los montos vienen como INTEGER de HANA, pero se acepta string por si el
// driver los devuelve serializados.
const formatAmount = (value: unknown) => {
  const amount = typeof value === "number" ? value : parseFloat(String(value));

  if (!Number.isFinite(amount)) return "-";

  return currencyFormat(amount, { showCurrencySign: false });
};

const formatText = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";

  return String(value);
};

// Las fechas llegan como texto YYYYMMDD (TO_VARCHAR en el backend). Solo se
// formatean para mostrarlas: el `selector` sigue devolviendo el valor original,
// que ordena cronológicamente como texto, y el Excel exporta la fila cruda.
const formatDate = (value: unknown) => {
  const raw = String(value ?? "").trim();

  if (!/^\d{8}$/.test(raw)) return formatText(value);

  return `${raw.slice(6, 8)}/${raw.slice(4, 6)}/${raw.slice(0, 4)}`;
};

const Home = () => {
  const { companySchema } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<{
    [key: string]: boolean;
  }>({});

  // Búsqueda por nombre. Los términos se evalúan con AND y sin importar el
  // orden, así "juan perez" encuentra "JUAN ANTONIO PEREZ".
  const filteredData = useMemo(() => {
    const terms = normalizeText(search).trim().split(/\s+/).filter(Boolean);

    if (terms.length === 0) return data;

    return data.filter((row) => {
      const name = normalizeText(row[SEARCH_FIELD]);

      return terms.every((term) => name.includes(term));
    });
  }, [data, search]);

  useEffect(() => {
    if (!companySchema) {
      setData([]);
      setError("No se pudo determinar la empresa de la sesión");
      return;
    }

    const getDatacredit = async () => {
      setIsLoading(true);
      setError(undefined);
      try {
        const res = await getDatacreditApi(companySchema);
        const payload = Array.isArray(res)
          ? res
          : (res?.body ?? res?.data ?? []);
        setData(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.log(error);
        setError(
          error instanceof Error ? error.message : "Error al cargar los datos",
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getDatacredit();
  }, [companySchema]);

  const exportToExcel = async (
    data: Record<string, unknown>[],
    fileName = "export",
  ) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sugerido");

    if (!data || data.length === 0) return;

    // Agrega encabezados
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Ajusta ancho automático
    headers.forEach((_, index) => {
      worksheet.getColumn(index + 1).width = 20;
    });

    // Agrega los datos
    data.forEach((row) => {
      const rowData = headers.map((key) => row[key]);
      worksheet.addRow(rowData);
    });

    // Genera el archivo
    const buffer = await workbook.xlsx.writeBuffer();

    // Descarga en navegador
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  };

  // Las columnas se derivan del mapeo en helpers/datacreditFields.ts, que es
  // el que amarra cada columna con el alias que devuelve el API.
  const allColumns = useMemo(
    () =>
      DATACREDIT_FIELDS.map((field) => ({
        name: field.label,
        selector: (row: any) => row[field.source],
        cell: (row: any) => {
          const value = row[field.source];
          const text = field.currency
            ? formatAmount(value)
            : field.date
              ? formatDate(value)
              : formatText(value);

          return field.bold ? <b>{text}</b> : <span>{text}</span>;
        },
        sortable: true,
        width: field.width,
        hidden: field.hidden ?? false,
      })),
    [],
  );

  // Initialize visible columns based on hidden property
  useEffect(() => {
    const initialVisibility: { [key: string]: boolean } = {};
    allColumns.forEach((col) => {
      initialVisibility[col.name] = !(col.hidden ?? false);
    });
    setVisibleColumns(initialVisibility);
  }, [allColumns]);

  // Filter columns based on visibility state
  const columns = useMemo(
    () =>
      allColumns.filter(
        (col) => visibleColumns[col.name] ?? !(col.hidden ?? false),
      ),
    [allColumns, visibleColumns],
  );

  const handleColumnToggle = (columnName: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  return (
    <div className="mt-25">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ColumnToggle
            columns={allColumns}
            visibleColumns={visibleColumns}
            onToggle={handleColumnToggle}
          />

          <div className="relative">
            <FiSearch
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-gray"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre"
              className="box-border h-10 w-65 rounded-full border border-[#d4d4d4] bg-transparent pl-11 pr-10 font-roboto text-sm text-text-primary placeholder:text-text-gray focus:outline-2 focus:outline-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-gray duration-200 hover:text-black"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {data.length > 0 && (
            <span className="font-roboto text-sm text-text-gray">
              {filteredData.length === data.length
                ? `${data.length.toLocaleString("es-DO")} registros`
                : `${filteredData.length.toLocaleString("es-DO")} de ${data.length.toLocaleString("es-DO")}`}
            </span>
          )}
          <Button
            title="Exportar Excel"
            variant="darkLight"
            onClick={() => exportToExcel(filteredData, "Datacredit")}
          />
        </div>
      </div>
      {error && (
        <p className="mb-2 font-roboto text-sm font-medium text-red-500">
          {error}
        </p>
      )}
      <CustomDatatable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
