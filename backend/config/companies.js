// Empresas contra las que se puede correr el reporte.
//
// - `schema`: esquema de HANA donde viven las tablas de SAP (OCRD, OINV, ...).
// - `code`: valor de la columna "Company" en la vista consolidada de aging.
//   No siempre es el sufijo del esquema: DB_AA_TEST02 es la base de pruebas
//   de Avant Auto, así que reporta bajo el mismo código "AA".
const COMPANIES = [
  { schema: "DB_LM", code: "LM" },
  { schema: "DB_AA", code: "AA" },
  { schema: "DB_GA", code: "GA" },
  { schema: "DB_MP", code: "MP" },
  { schema: "DB_KI", code: "KI" },
  { schema: "DB_CL", code: "CL" },
  { schema: "DB_AA_TEST02", code: "AA" },
];

// El nombre del esquema se interpola en `SET SCHEMA`, que no acepta
// parámetros, por eso solo se aceptan valores de esta lista.
function resolveCompany(schema) {
  return COMPANIES.find((company) => company.schema === schema) ?? null;
}

module.exports = {
  COMPANIES,
  resolveCompany,
};
