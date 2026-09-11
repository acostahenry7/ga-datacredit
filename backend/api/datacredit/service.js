const { db } = require("../../config/db");

// `company` viene de la lista blanca en config/companies.js: { schema, code }.
// Sus valores nunca provienen directamente del request, por eso se pueden
// interpolar en la consulta.
async function get(company) {
  const statement = `SELECT CASE
    WHEN LENGTH("OCRD_LicTradNum") = 11 THEN 'I'
    ELSE 'E'
END AS "Tipo de Entidad",
"OCRD_CardCode"                                             AS "Código del Cliente",
''                                                          AS "Código de la Sucursal",
'D'                                                         AS "Relación del Cliente con la Cuenta",
CASE
    WHEN LENGTH("OCRD_LicTradNum") = 11 THEN "OCRD_CardName" 
    ELSE ''
END                                                         AS "Nombre Completo",
CASE 
    WHEN LENGTH("OCRD_LicTradNum") = 11 THEN REPLACE("OCRD_LicTradNum",'-','')
    ELSE ''
END                                                         AS "Cédula de Identidad",
''                                                          AS "Numero de Pasaporte",
CASE
    WHEN LENGTH("OCRD_LicTradNum") = 9 THEN "OCRD_CardName" 
    ELSE ''
END                                                         AS "Razón Social",
NULL                                                        AS "Siglas",
CASE 
    WHEN LENGTH("OCRD_LicTradNum") = 9 THEN REPLACE("OCRD_LicTradNum",'-','')
    ELSE ''
END                                                         AS "RNC",
REPLACE("OCRD_Phone1",'-','')                               AS "Residencia",
REPLACE("OCRD_Phone2",'-','')                               AS "Oficina/Empresa",
REPLACE("OCRD_Cellular",'-','')                             AS "Móvil",
NULL                                                        AS "Fax",
NULL                                                        AS "Email",
NULL                                                        AS "Otro",
"CRD1_Street"                                               AS "Calle/Avenida",
NULL                                                        AS "Esquina",
"CRD1_Building"                                             AS "Número",
''                                                          AS "Edificio/Apartamento/Residencial",
NULL                                                        AS "Urbanización",
"CRD1_Block"                                                AS "Sector",
"CRD1_City"                                                 AS "Ciudad",
"OCST_Name"                                                 AS "Provincia/Municipio",
"OCRD_CardCode"                                             AS "Número de Cuenta",
'R'                                                         AS "Unidad Monetaria",
'Comercial'                                                 AS "Tipo de Cuenta",
TO_VARCHAR("OCRD_CreateDate",'YYYYMMDD')                     AS "Fecha de Apertura",
TO_VARCHAR("INV6_OldestDueDate",'YYYYMMDD')                 AS "Fecha de Vencimiento",
CAST(ROUND("OCRD_CreditLine",0) AS INTEGER)                 AS "Límite de Crédito",
CAST(ROUND(
    CASE 
        WHEN COALESCE("CVENTA_OriginalAmount",0) > "OCRD_CreditLine" THEN COALESCE("CVENTA_OriginalAmount",0) - "OCRD_CreditLine"
        ELSE COALESCE("OCRD_CreditLine",0)
    END
, 0) AS INTEGER)                                            AS "Crédito Más Alto Utilizado",
CAST(ROUND(COALESCE("INV6_AvgInstallment",0),0) AS INTEGER) AS "Monto de la Cuota",
COALESCE("INV6_TotalInstallments",0)                        AS "Cantidad de Cuotas",
TO_VARCHAR("ORCT_LastPayDate",'YYYYMMDD')                    AS "Fecha Ultimo Pago",
CAST(ROUND(COALESCE("ORCT_LastPayAmount",0),0) AS INTEGER)  AS "Monto Ultimo Pago",
CAST(ROUND("OCRD_Balance",0) AS INTEGER)                     AS "Balance Actual",
CASE 
  WHEN CAST(ROUND("GB_CA_AGINNING_Overdue",0) AS INTEGER) < 0 THEN 0
  ELSE CAST(ROUND("GB_CA_AGINNING_Overdue",0) AS INTEGER)
END                                                         AS "Monto en Atraso",
COALESCE("GB_CA_AGINNING_OverdueBuckets",0)                 AS "Cantidad de Cuotas atrasadas",

-- ============================================================
-- HOMOLOGACIÓN TRANSUNION DINÁMICA BASADA EN BUCKETS DE AGING
-- ============================================================
CASE 
    -- 1. Estatus Castigada: Si tiene deuda en el bucket de 120+ días o tiene la propiedad marcada
    WHEN "GB_CA_AGINNING_120+" > 0 OR "OCRD_QryGroup13" = 'Y' THEN 'Castigada'
    
    -- 2. Estatus Legal: Por marca explícita del departamento legal
    WHEN "OCRD_QryGroup12" = 'Y' THEN 'Legal'
    
    -- 3. Estatus Mora: Si tiene atrasos entre 31 y 90 días (Buckets 2 y 3)
    WHEN "GB_CA_AGINNING_31-60" > 0 OR "GB_CA_AGINNING_61-90" > 0 THEN 'Mora'
    
    -- 4. Estatus Acuerdo de Pago: Por marca explícita
    WHEN "OCRD_QryGroup7" = 'Y' THEN 'Acuerdo de Pago'
    
    -- 5. Estatus Cancelada: Si el balance total es 0
    WHEN CAST(ROUND("OCRD_Balance",0) AS INTEGER) = 0 THEN 'Cancelada'
    
    -- 6. Al Día: Si no aplica a lo anterior (puede tener balance en 0-30 días pero no es considerado Mora según tabla)
    ELSE 'Al Día'
END                                                         AS "Estatus de la Cuenta",

-- ============================================================
-- ESTADO DE LA CUENTA (A = Abierta / C = Cancelada)
-- ============================================================
CASE 
    WHEN CAST(ROUND("OCRD_Balance",0) AS INTEGER) = 0 THEN 'C'
    ELSE 'A'
END                                                         AS "Estado de la Cuenta",
-- ============================================================

CAST(ROUND("GB_CA_AGINNING_0-30",0) AS INTEGER)             AS "Saldo Vencido 1-30 días",
CAST(ROUND("GB_CA_AGINNING_31-60",0) AS INTEGER)            AS "Saldo Vencido 31-60 días",
CAST(ROUND("GB_CA_AGINNING_61-90",0) AS INTEGER)            AS "Saldo Vencido 61-90 días",
CAST(ROUND("GB_CA_AGINNING_91-120",0) AS INTEGER)           AS "Saldo Vencido 91-120 días",
NULL                                                        AS "Saldo Vencido 121-150 días",
NULL                                                        AS "Saldo Vencido 151-180 días",
CAST(ROUND("GB_CA_AGINNING_120+",0) AS INTEGER)             AS "Saldo Vencido 181 días o más"

FROM (
    SELECT
        "OCRD"."CardCode"                                       AS "OCRD_CardCode",
        "OCRD"."CardName"                                       AS "OCRD_CardName",
        "OCRD"."LicTradNum"                                     AS "OCRD_LicTradNum",
        MAX(COALESCE("CRD1"."Street",''))                       AS "CRD1_Street",
        MAX(CAST(COALESCE("CRD1"."Building",'') AS VARCHAR))    AS "CRD1_Building",
        MAX(COALESCE("CRD1"."Block",''))                        AS "CRD1_Block",
        MAX(COALESCE("CRD1"."City",''))                         AS "CRD1_City",
        MAX(COALESCE("OCST"."Name",''))                         AS "OCST_Name",
        MAX(COALESCE("OCRY"."Name",''))                         AS "OCRY_Name",
        CAST("OCRD"."Phone1" AS NVARCHAR(50))                   AS "OCRD_Phone1",
        CAST("OCRD"."Phone2" AS NVARCHAR(50))                   AS "OCRD_Phone2",
        CAST("OCRD"."Cellular" AS NVARCHAR(50))                 AS "OCRD_Cellular",
        "OCRD"."CreateDate"                                     AS "OCRD_CreateDate",

        MAX("OCRD"."QryGroup7")                                 AS "OCRD_QryGroup7",
        MAX("OCRD"."QryGroup12")                                AS "OCRD_QryGroup12",
        MAX("OCRD"."QryGroup13")                                AS "OCRD_QryGroup13",

        COALESCE("OCRD"."CreditLine","OCRD"."U_GB_CrdLmV",0)    AS "OCRD_CreditLine",
        SUM(COALESCE("GB_CA_AGINNING"."AgingBalanceDueLC",0))   AS "OCRD_Balance",
        'DOP'                                                   AS "GB_CA_AGINNING_ForeignCurrencyCode",
        "ORCT_AGG"."LastPayDate"                                AS "ORCT_LastPayDate",
        "ORCT_AGG"."LastPayAmount"                              AS "ORCT_LastPayAmount",

        -- Pivot buckets aging en LC (DOP)
        SUM(CASE WHEN "GB_CA_AGINNING"."AgingOrder" = 1 THEN COALESCE("GB_CA_AGINNING"."OverdueLC",0) ELSE 0 END) AS "GB_CA_AGINNING_0-30",
        SUM(CASE WHEN "GB_CA_AGINNING"."AgingOrder" = 2 THEN COALESCE("GB_CA_AGINNING"."OverdueLC",0) ELSE 0 END) AS "GB_CA_AGINNING_31-60",
        SUM(CASE WHEN "GB_CA_AGINNING"."AgingOrder" = 3 THEN COALESCE("GB_CA_AGINNING"."OverdueLC",0) ELSE 0 END) AS "GB_CA_AGINNING_61-90",
        SUM(CASE WHEN "GB_CA_AGINNING"."AgingOrder" = 4 THEN COALESCE("GB_CA_AGINNING"."OverdueLC",0) ELSE 0 END) AS "GB_CA_AGINNING_91-120",
        SUM(CASE WHEN "GB_CA_AGINNING"."AgingOrder" = 5 THEN COALESCE("GB_CA_AGINNING"."OverdueLC",0) ELSE 0 END) AS "GB_CA_AGINNING_120+",

        SUM(COALESCE("GB_CA_AGINNING"."OverdueLC",0))           AS "GB_CA_AGINNING_Overdue",
        MAX("GB_CA_AGINNING"."DueDate")                         AS "GB_CA_AGINNING_DueDate",
        SUM(CASE WHEN COALESCE("GB_CA_AGINNING"."OverdueLC",0) > 0 THEN 1 ELSE 0 END) AS "GB_CA_AGINNING_OverdueBuckets",

        MAX("INV6_AGG"."TotalInstallments")                     AS "INV6_TotalInstallments",
        MAX("INV6_AGG"."AvgInstallment")                        AS "INV6_AvgInstallment",
        MAX("INV6_AGG"."OldestDueDate")                         AS "INV6_OldestDueDate",
        MAX("CVENTA_AGG"."OriginalAmount")                      AS "CVENTA_OriginalAmount"

    FROM "OCRD" "OCRD"
    INNER JOIN "OADM" "OADM" ON (1=1)
    INNER JOIN "OADP" "OADP" ON (1=1)
    LEFT OUTER JOIN "CRD1" "CRD1"
        ON ("OCRD"."CardCode" = "CRD1"."CardCode" AND "OCRD"."BillToDef" = "CRD1"."Address")
    LEFT OUTER JOIN "OCRY" "OCRY"
        ON ("CRD1"."Country" = "OCRY"."Code")
    LEFT OUTER JOIN (
        SELECT "Country", "Code", MAX("Name") AS "Name" FROM "OCST" GROUP BY "Country", "Code"
    ) "OCST"
        ON ("CRD1"."Country" = "OCST"."Country" AND "CRD1"."State" = "OCST"."Code")

    LEFT OUTER JOIN (
        SELECT
            "BusinessPartnerCode",
            "AgingOrder",
            SUM("OverdueLC")            AS "OverdueLC",
            SUM("AgingBalanceDueLC")    AS "AgingBalanceDueLC",
            MAX("DueDate")              AS "DueDate"
        FROM "_SYS_BIC"."grupobonanza.views/GB_CA_CUSTOMER_RECEIVABLE_AGINING_CONSOLIDATED"
        WHERE "Company" = '${company.code}'
          AND "AgingOrder" > 0
          AND (NOT("DueDate" < ADD_DAYS(current_date, -1440)))
          AND "DocumentTypeCode" IN (13, 30, 46)
        GROUP BY "BusinessPartnerCode", "AgingOrder"
    ) "GB_CA_AGINNING"
        ON "GB_CA_AGINNING"."BusinessPartnerCode" = "OCRD"."CardCode"

    LEFT JOIN (
        SELECT 
            "O"."CardCode",
            "O"."DocDate"           AS "LastPayDate",
            SUM("O"."DocTotal")     AS "LastPayAmount"
        FROM "ORCT" "O"
        INNER JOIN (
            SELECT "CardCode", MAX("DocDate") AS "MaxDate" FROM "ORCT" WHERE "Canceled" = 'N' GROUP BY "CardCode"
        ) "LAST" ON  "O"."CardCode" = "LAST"."CardCode" AND "O"."DocDate"  = "LAST"."MaxDate"
        WHERE "O"."Canceled" = 'N'
        GROUP BY "O"."CardCode", "O"."DocDate"
    ) "ORCT_AGG" ON ("ORCT_AGG"."CardCode" = "OCRD"."CardCode")

    LEFT JOIN (
        SELECT
            "OINV"."CardCode",
            COUNT("INV6"."InstlmntID")                          AS "TotalInstallments",
            SUM("INV6"."InsTotal") / NULLIF(COUNT("INV6"."InstlmntID"), 0) AS "AvgInstallment",
            MIN(CASE WHEN ("INV6"."InsTotal" - "INV6"."PaidToDate") > 0 THEN "INV6"."DueDate" END) AS "OldestDueDate"
        FROM "OINV" "OINV"
        INNER JOIN "INV6" "INV6" ON "OINV"."DocEntry" = "INV6"."DocEntry"
        WHERE "OINV"."DocStatus" = 'O' AND "OINV"."CANCELED"  = 'N'
        GROUP BY "OINV"."CardCode"
    ) "INV6_AGG" ON ("INV6_AGG"."CardCode" = "OCRD"."CardCode")

    LEFT JOIN (
        SELECT
            "CV"."U_CardCode"                                   AS "CardCode",
            "CV"."U_Pag_ent"                                    AS "OriginalAmount"
        FROM "@SCGD_CVENTA" "CV"
        INNER JOIN (
            SELECT "U_CardCode", MAX("CreateDate") AS "MaxCreateDate" FROM "@SCGD_CVENTA"
            WHERE "Canceled" = 'N' AND "U_CardCode" IS NOT NULL AND "U_CardCode" != '' GROUP BY "U_CardCode"
        ) "LAST" ON  "CV"."U_CardCode" = "LAST"."U_CardCode" AND "CV"."CreateDate" = "LAST"."MaxCreateDate"
        WHERE "CV"."Canceled" = 'N'
    ) "CVENTA_AGG" ON ("CVENTA_AGG"."CardCode" = "OCRD"."CardCode")
    
    WHERE "OCRD"."CardType" = 'C'
    AND "OCRD"."QryGroup2" = 'Y' 
    AND "OCRD"."QryGroup19" = 'Y' 

    GROUP BY
        "OCRD"."CardCode", "OCRD"."CardName", "OCRD"."LicTradNum",
        CAST("OCRD"."Phone1" AS NVARCHAR(50)), CAST("OCRD"."Phone2" AS NVARCHAR(50)), CAST("OCRD"."Cellular" AS NVARCHAR(50)),
        "OCRD"."CreateDate", COALESCE("OCRD"."CreditLine",0), "OADM"."SysCurrncy",
        "ORCT_AGG"."LastPayDate", "ORCT_AGG"."LastPayAmount", "OCRD"."CreditLine", "OCRD"."U_GB_CrdLmV"
)
WHERE CAST(ROUND("GB_CA_AGINNING_Overdue",0) AS INTEGER) >= 0
AND "OCRD_CreditLine"  > 0
ORDER BY "GB_CA_AGINNING_Overdue" DESC;`;

  await db.exec(`SET SCHEMA ${company.schema};`);
  const result = await db.exec(statement);

  return result;
}

module.exports = {
  get,
};
