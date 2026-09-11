// Mapeo entre las columnas que devuelve el API y la tabla de la pantalla Home.
//
// `source` es el alias EXACTO del SELECT externo en
// backend/api/datacredit/service.js. Son los nombres oficiales del reporte de
// Datacredit y también los encabezados del Excel exportado (el export usa
// Object.keys de la fila), así que no se deben renombrar: si cambia un alias
// en el backend, hay que cambiarlo aquí también.
//
// `label` es solo el encabezado que se muestra en la tabla.

export type DatacreditField = {
  source: string;
  label: string;
  /** Oculta la columna por defecto (se puede activar desde el selector). */
  hidden?: boolean;
  width?: string;
  /** Formatea el valor como monto. */
  currency?: boolean;
  /**
   * El backend devuelve estas fechas como texto YYYYMMDD. Solo se formatean
   * para mostrarlas en la tabla; el Excel se exporta con el valor original.
   */
  date?: boolean;
  bold?: boolean;
};

/**
 * Campo sobre el que busca la caja de búsqueda de la tabla.
 *
 * Ojo: la consulta solo llena "Nombre Completo" para personas físicas (cédula
 * de 11 dígitos); las empresas traen el nombre en "Razón Social", así que no
 * aparecen al buscar aquí.
 */
export const SEARCH_FIELD = "Nombre Completo";

export const DATACREDIT_FIELDS: DatacreditField[] = [
  // Identificación
  { source: "Tipo de Entidad", label: "Tipo Entidad", width: "80px", hidden: true },
  {
    source: "Código del Cliente",
    label: "Código Cliente",
    width: "120px",
    bold: true,
  },
  { source: "Código de la Sucursal", label: "Código Sucursal", hidden: true },
  {
    source: "Relación del Cliente con la Cuenta",
    label: "Relación Cliente Cuenta",
    hidden: true,
  },
  { source: "Nombre Completo", label: "Nombre Completo", width: "250px" },
  { source: "Cédula de Identidad", label: "Cédula", hidden: true },
  { source: "Numero de Pasaporte", label: "Número Pasaporte", hidden: true },
  { source: "Razón Social", label: "Razón Social", hidden: true },
  { source: "Siglas", label: "Siglas", hidden: true },
  { source: "RNC", label: "RNC" },

  // Contacto
  { source: "Residencia", label: "Teléfono Residencia", hidden: true },
  { source: "Oficina/Empresa", label: "Teléfono Oficina", hidden: true },
  { source: "Móvil", label: "Teléfono Móvil", hidden: true },
  { source: "Fax", label: "Fax", hidden: true },
  { source: "Email", label: "Email", width: "200px", hidden: true },
  { source: "Otro", label: "Teléfono Otro", hidden: true },

  // Dirección
  { source: "Calle/Avenida", label: "Calle", width: "250px", hidden: true },
  { source: "Esquina", label: "Esquina", hidden: true },
  { source: "Número", label: "Número", hidden: true },
  {
    source: "Edificio/Apartamento/Residencial",
    label: "Edificio",
    hidden: true,
  },
  { source: "Urbanización", label: "Urbanización", hidden: true },
  { source: "Sector", label: "Sector", hidden: true },
  { source: "Ciudad", label: "Ciudad" },
  { source: "Provincia/Municipio", label: "Provincia", hidden: true },

  // Cuenta
  {
    source: "Número de Cuenta",
    label: "Número Cuenta",
    width: "130px",
    bold: true,
  },
  { source: "Unidad Monetaria", label: "Unidad Monetaria", hidden: true },
  { source: "Tipo de Cuenta", label: "Tipo Cuenta", hidden: true },
  { source: "Fecha de Apertura", label: "Fecha Apertura", date: true },
  {
    source: "Fecha de Vencimiento",
    label: "Fecha Vencimiento",
    date: true,
    hidden: true,
  },
  {
    source: "Límite de Crédito",
    label: "Límite Crédito",
    currency: true,
    hidden: true,
  },
  {
    source: "Crédito Más Alto Utilizado",
    label: "Crédito Mas Alto Utilizado",
    currency: true,
    hidden: true,
  },
  {
    source: "Monto de la Cuota",
    label: "Monto Cuota",
    currency: true,
    hidden: true,
  },
  { source: "Cantidad de Cuotas", label: "Cantidad Cuotas", hidden: true },
  {
    source: "Fecha Ultimo Pago",
    label: "Fecha Último Pago",
    date: true,
    hidden: true,
  },
  {
    source: "Monto Ultimo Pago",
    label: "Monto Último Pago",
    currency: true,
    hidden: true,
  },
  {
    source: "Balance Actual",
    label: "Balance Actual",
    currency: true,
    bold: true,
  },
  {
    source: "Monto en Atraso",
    label: "Monto Atraso",
    currency: true,
    bold: true,
  },
  {
    source: "Cantidad de Cuotas atrasadas",
    label: "Cantidad Cuotas Atrasadas",
    hidden: true,
  },
  { source: "Estatus de la Cuenta", label: "Estatus Cuenta" },
  { source: "Estado de la Cuenta", label: "Estado Cuenta", hidden: true },

  // Buckets de aging
  {
    source: "Saldo Vencido 1-30 días",
    label: "Saldo 1-30",
    currency: true,
    hidden: true,
  },
  {
    source: "Saldo Vencido 31-60 días",
    label: "Saldo 31-60",
    currency: true,
    hidden: true,
  },
  {
    source: "Saldo Vencido 61-90 días",
    label: "Saldo 61-90",
    currency: true,
    hidden: true,
  },
  {
    source: "Saldo Vencido 91-120 días",
    label: "Saldo 91-120",
    currency: true,
    hidden: true,
  },
  {
    source: "Saldo Vencido 121-150 días",
    label: "Saldo 121-150",
    currency: true,
    hidden: true,
  },
  {
    source: "Saldo Vencido 151-180 días",
    label: "Saldo 151-180",
    currency: true,
    hidden: true,
  },
  {
    source: "Saldo Vencido 181 días o más",
    label: "Saldo 181+",
    currency: true,
    hidden: true,
  },
];
