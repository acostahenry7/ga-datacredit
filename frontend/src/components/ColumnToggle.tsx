import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { normalizeText } from "../helpers/uiFormat";
import Button from "./Button";

type Column = { name: string; hidden?: boolean };

interface ColumnToggleProps {
  columns: Column[];
  visibleColumns: { [key: string]: boolean };
  onToggle: (columnName: string) => void;
}

const ColumnToggle: React.FC<ColumnToggleProps> = ({
  columns,
  visibleColumns,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setQuery("");
  };

  // Cierra el menú al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) closeMenu();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isColumnVisible = (column: Column) =>
    visibleColumns[column.name] ?? !column.hidden;

  const filteredColumns = useMemo(() => {
    const term = normalizeText(query).trim();

    if (!term) return columns;

    return columns.filter((column) =>
      normalizeText(column.name).includes(term),
    );
  }, [columns, query]);

  const visibleCount = columns.filter(isColumnVisible).length;

  // "Todas"/"Ninguna" actúa solo sobre lo que está filtrado, así se pueden
  // activar grupos completos (ej. buscar "saldo" y mostrar todos los buckets).
  const allFilteredVisible =
    filteredColumns.length > 0 && filteredColumns.every(isColumnVisible);

  const toggleAll = () => {
    filteredColumns.forEach((column) => {
      if (isColumnVisible(column) === allFilteredVisible) onToggle(column.name);
    });
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <Button
        title="Columnas"
        variant="light"
        onClick={() => (isOpen ? closeMenu() : setIsOpen(true))}
        icon={
          <FiChevronDown
            size={18}
            className={`duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        }
      />

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[330px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-3xl animate-fadeIn7">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-poppins text-sm font-medium text-text-primary">
                  Mostrar columnas
                </h4>
                <p className="font-roboto text-xs text-text-gray">
                  {visibleCount} de {columns.length} visibles
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="cursor-pointer rounded-full border border-black px-3.5 py-1.5 font-poppins text-xs duration-200 hover:bg-black hover:text-white"
              >
                {allFilteredVisible ? "Ninguna" : "Todas"}
              </button>
            </div>

            <div className="relative mt-3">
              <FiSearch
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar columna"
                className="box-border h-[34px] w-full rounded-full border border-[#d4d4d4] bg-transparent pl-9 pr-8 font-roboto text-[13px] text-text-primary placeholder:text-text-gray focus:outline-2 focus:outline-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda de columnas"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-gray duration-200 hover:text-black"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="flex max-h-[300px] flex-col gap-0.5 overflow-y-auto p-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar]:w-1.5">
            {filteredColumns.length === 0 && (
              <p className="px-3 py-6 text-center font-roboto text-[13px] text-text-gray">
                Ninguna columna coincide con "{query}"
              </p>
            )}

            {filteredColumns.map((column) => {
              const isVisible = isColumnVisible(column);

              return (
                <label
                  key={column.name}
                  className="flex cursor-pointer select-none items-center gap-3 rounded-full px-3 py-2 duration-150 hover:bg-light-blue"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggle(column.name)}
                    className="h-4 w-4 cursor-pointer accent-black"
                  />
                  <span
                    className={`font-roboto text-[13px] ${
                      isVisible
                        ? "font-medium text-text-primary"
                        : "text-text-gray"
                    }`}
                  >
                    {column.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnToggle;
