const express = require("express");
const router = express.Router();
const Product = require("../models/productSchema");
const axios = require("axios");

// API to initialize the database
router.get("/data", async (req, res) => {
  try {
    const fetchedData = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
    const products = await Product.insertMany(fetchedData.data);
    res.send({ message: "success", data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
