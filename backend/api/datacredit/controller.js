const service = require("./service");
const { resolveCompany } = require("../../config/companies");

const get = async (req, res) => {
  if (!req.query.schema) {
    return res.status(400).send({ error: "Schema parameter is required" });
  }

  const company = resolveCompany(req.query.schema);

  if (!company) {
    return res
      .status(400)
      .send({ error: `Esquema no válido: ${req.query.schema}` });
  }

  try {
    const data = await service.get(company);
    res.send(data);
  } catch (error) {
    console.log("Error on datacredit query!", error.message);
    res.status(500).send({ error: "Error al consultar los datos" });
  }
};

module.exports = {
  get,
};
