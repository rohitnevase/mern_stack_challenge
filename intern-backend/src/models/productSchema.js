const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  title: {
    type: String
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  image: {
    type: String
  },
  sold: {
    type: Boolean,
    default: false
  },
  dateOfSale: {
    type: Date
  }
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
