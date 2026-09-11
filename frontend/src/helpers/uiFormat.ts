const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getCompanyNameBySchema(schema: string | null | undefined) {
  const companies = [
    { label: "Lasa Motors", value: "DB_LM" },
    { label: "Avant Auto", value: "DB_AA" },
    { label: "Gar 210", value: "DB_GA" },
    { label: "Motoplex", value: "DB_MP" },
    { label: "KTM Import", value: "DB_KI" },
    { label: "Cycle Lab", value: "DB_CL" },
    { label: "Avant Auto TEST", value: "DB_AA_TEST02" },
  ];

  return (
    companies
      .find((company) => company.value === schema)
      ?.label?.toUpperCase() || "INVALID SCHEMA NAME"
  );
}

// Normaliza texto para buscar: sin acentos y en minúsculas. Así "Ramirez"
// encuentra "Ramírez" y "cedula" encuentra "Cédula".
export function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDateSpanish(date) {
  if (date instanceof Date == false) date = new Date(date);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} del ${year}`;
}

function getLabelNameByDateEntity(entity, value) {
  let result = undefined;
  switch (entity) {
    case "months":
      result = months.find((item, index) => index == value - 1).toUpperCase();
      break;

    default:
      break;
  }
  return result;
}

type currencyFormatOptions = {
  showCurrencySign?: boolean;
  fractionDigits?: number;
};

export function currencyFormat(input: number, options: currencyFormatOptions) {
  if (input == 0) {
    return "-";
  }

  if (isNaN(input)) {
    return input;
  }

  const opts: Intl.NumberFormatOptions = {
    minimumFractionDigits: options.fractionDigits ?? 2,
    maximumFractionDigits: options.fractionDigits ?? 2,
  };

  if (options.showCurrencySign != false) {
    opts.style = "currency";
    opts.currency = "DOP";
  }

  return new Intl.NumberFormat("es-DO", opts).format(input);
}
export {
  getCompanyNameBySchema,
  getCurrentDate,
  formatDateSpanish,
  getLabelNameByDateEntity,
};
