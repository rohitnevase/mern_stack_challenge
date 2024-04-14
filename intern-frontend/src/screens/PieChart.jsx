import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { getPieChartValues } from "../api/api";

const PieChart = ({ month }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(3);

  const getData = async () => {
    try {
      const response = await getPieChartValues(month);
      if (response.message === "success") {
        setData(response.data);
        fetchDataAndRenderChart(response.data);
      } else {
        console.error("Error: Data retrieval unsuccessful.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataAndRenderChart = async renderData => {
    try {
      if (!renderData || renderData.length === 0) {
        console.warn("Warning: No data available to render chart.");
        return;
      }

      // Destroy the existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      const labels = renderData.map(item => item.category);
      const counts = renderData.map(item => item.count);

      const chartData = {
        labels: labels,
        datasets: [
          {
            data: counts,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)"
              // Add more colors as needed
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)"
              // Add more colors as needed
            ],
            borderWidth: 1
          }
        ]
      };

      const newChartInstance = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

      setChartInstance(newChartInstance);
    } catch (error) {
      console.error("Error rendering chart:", error);
    }
  };

  // req send to server when month get updated
  useEffect(() => {
    getData();

    // Clean up function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [month]);

  return (
    <div style={{ height: "400px", width: "600px", margin: "auto" }}>
      <h2>Pie Chart</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
