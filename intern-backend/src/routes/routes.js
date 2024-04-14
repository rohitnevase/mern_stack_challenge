const express = require("express");
const router = express.Router();
const productsRoutes = require("./products/productApis");

router.use("/product", productsRoutes);

module.exports = router;
