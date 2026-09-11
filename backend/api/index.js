const express = require("express");
const app = express();
const routes = require("./datacredit");
const { createHanaConnection } = require("../config/db");
const cors = require("cors");

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  try {
    await createHanaConnection();
  } catch (error) {
    console.log("Error on database connection!", error.message);
  }
});

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

//Routes
app.use("/datacredit", routes);
