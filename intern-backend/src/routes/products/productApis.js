const express = require("express");
const router = express.Router();
const Product = require("../../models/productSchema");
const config = require("../../config/config");
const axios = require("axios");

// http://localhost:5454/
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send({ message: "success", data: products });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//an API to list the all transactions supports pagination and search
//http://localhost:5454/product/transactions?page=1&perPage=10&searchText=1090
router.get("/transactions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const searchText = req.query.searchText || "";
    const selectedMonthNumber = req.query.month ? parseInt(req.query.month) : null;

    if (
      selectedMonthNumber !== null &&
      (isNaN(selectedMonthNumber) || selectedMonthNumber < 0 || selectedMonthNumber > 12)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid month number. Month number must be between 1 and 12 or 0 to skip." });
    }

    // Construct search query
    let searchQuery = {};

    if (searchText) {
      searchQuery.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } }
      ];
    }

    if (selectedMonthNumber !== null && selectedMonthNumber !== 0) {
      searchQuery.$and = [
        {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonthNumber]
          }
        }
      ];
    }

    // If searchText can be parsed as a number, also search by price
    const parsedPrice = parseFloat(searchText);
    if (!isNaN(parsedPrice)) {
      searchQuery.$or.push({ price: parsedPrice });
    }

    // Query transactions based on search parameters and apply pagination
    const transactions = await Product.find(searchQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);
    const count = await Product.find().countDocuments();

    res.send({ message: "success", data: transactions, count: count });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//API to get statistics for selected month
//http://localhost:5454/product/statistics?month=12
router.get("/statistics", async (req, res) => {
  try {
    // Parse selected month number from request query
    const selectedMonthNumber = parseInt(req.query.month);
    if (isNaN(selectedMonthNumber) || selectedMonthNumber < 1 || selectedMonthNumber > 12) {
      return res.status(400).json({ message: "Invalid month number. Month number must be between 1 and 12." });
    }

    // Query transactions for selected month
    const transactions = await Product.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, selectedMonthNumber]
      }
    });

    // Calculate statistics
    const totalSaleAmount = transactions.reduce((total, transaction) => total + transaction.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalUnsoldItems = transactions.filter(transaction => !transaction.sold).length;

    // Return statistics as API response
    res.send({ message: "success", data: { totalSaleAmount, totalSoldItems, totalUnsoldItems } });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// An API for bar chart
// localhost:5454/product/bar-chart?month=6
router.get("/bar-chart", async (req, res) => {
  try {
    // Parse selected month number from request query
    const selectedMonthNumber = parseInt(req.query.month);
    if (isNaN(selectedMonthNumber) || selectedMonthNumber < 1 || selectedMonthNumber > 12) {
      return res.status(400).json({ message: "Invalid month number. Month number must be between 1 and 12." });
    }

    // Query transactions for selected month
    const transactions = await Product.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, selectedMonthNumber]
      }
    });

    // Initialize counters for each price range
    const priceRanges = [
      { range: "0 - 100", count: 0 },
      { range: "101 - 200", count: 0 },
      { range: "201 - 300", count: 0 },
      { range: "301 - 400", count: 0 },
      { range: "401 - 500", count: 0 },
      { range: "501 - 600", count: 0 },
      { range: "601 - 700", count: 0 },
      { range: "701 - 800", count: 0 },
      { range: "801 - 900", count: 0 },
      { range: "901 - above", count: 0 }
    ];

    // Calculate count of items falling into each price range
    transactions.forEach(transaction => {
      const price = transaction.price;
      if (price >= 0 && price <= 100) {
        priceRanges[0].count++;
      } else if (price <= 200) {
        priceRanges[1].count++;
      } else if (price <= 300) {
        priceRanges[2].count++;
      } else if (price <= 400) {
        priceRanges[3].count++;
      } else if (price <= 500) {
        priceRanges[4].count++;
      } else if (price <= 600) {
        priceRanges[5].count++;
      } else if (price <= 700) {
        priceRanges[6].count++;
      } else if (price <= 800) {
        priceRanges[7].count++;
      } else if (price <= 900) {
        priceRanges[8].count++;
      } else {
        priceRanges[9].count++;
      }
    });

    // Return price ranges and counts as API response
    res.send({ message: "success", data: priceRanges });
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// An API for pie chart
// localhost:5454/product/pie-chart?month=12
router.get("/pie-chart", async (req, res) => {
  try {
    // Parse selected month number from request query
    const selectedMonthNumber = parseInt(req.query.month);
    if (isNaN(selectedMonthNumber) || selectedMonthNumber < 1 || selectedMonthNumber > 12) {
      return res.status(400).json({ message: "Invalid month number. Month number must be between 1 and 12." });
    }

    // Query transactions for selected month
    const transactions = await Product.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, selectedMonthNumber]
      }
    });

    // Extract unique categories and count number of items for each category
    const categoryCounts = {};
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    // Prepare response data with unique categories and counts
    const responseData = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

    // Return unique categories and counts as API response
    res.send({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  An API for sends a final response of the combined JSON
// localhost:5454/product/combined-data?month=1
router.get("/combined-data", async (req, res) => {
  try {
    // Parse selected month number from request query
    const selectedMonthNumber = parseInt(req.query.month);
    if (isNaN(selectedMonthNumber) || selectedMonthNumber < 1 || selectedMonthNumber > 12) {
      return res.status(400).json({ message: "Invalid month number. Month number must be between 1 and 12." });
    }
    console.log("--------------------", config.PORT);

    // Make asynchronous requests to all three APIs
    const barChartDataPromise = axios.get(
      `http://localhost:${config.PORT}/product/bar-chart?month=${selectedMonthNumber}`
    );
    const pieChartDataPromise = axios.get(
      `http://localhost:${config.PORT}/product/pie-chart?month=${selectedMonthNumber}`
    );
    const statisticsDataPromise = axios.get(
      `http://localhost:${config.PORT}/product/statistics?month=${selectedMonthNumber}`
    );

    // Wait for all requests to complete
    const [barChartDataResponse, pieChartDataResponse, statisticsDataResponse] = await Promise.all([
      barChartDataPromise,
      pieChartDataPromise,
      statisticsDataPromise
    ]);

    // Extract data from each response
    const barChartData = barChartDataResponse.data;
    const pieChartData = pieChartDataResponse.data;
    const statisticsData = statisticsDataResponse.data;

    // Combine the responses into a single JSON object
    const combinedData = {
      barChart: barChartData,
      pieChart: pieChartData,
      statistics: statisticsData
    };

    // Send the final combined JSON object as the API response
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
