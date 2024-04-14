import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { getBarChartValues } from "../api/api";

const BarChart = ({ month }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await getBarChartValues(month ? month : 3);
      if (response.message === "success") {
        setData(response.data);
        renderChart(response.data);
        console.log(response.data);
      } else {
        console.error("Error: Data retrieval unsuccessful.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderChart = renderData => {
    try {
      console.log("function called", renderData);
      // Destroy the existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create a new chart instance if there is data
      if (renderData.length > 0) {
        const ctx = chartRef.current.getContext("2d");

        const labels = renderData.map(item => item.range);
        const counts = renderData.map(item => item.count);

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Count",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1
            }
          ]
        };

        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        setChartInstance(newChartInstance);
      } else {
        console.warn("Warning: No data available to render chart.");
      }
    } catch (error) {
      console.error("Error rendering chart:", error);
    }
  };

  // req send to server when req get updated
  useEffect(() => {
    console.log("in bar chart");
    const fetchDataAndRenderChart = async () => {
      try {
        await getData();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDataAndRenderChart();

    // Clean up function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [month]);

  return (
    <div style={{ height: "400px", width: "600px", margin: "auto" }} className="card shadow">
      <div className="card-body">
        <h2>Bar Chart</h2>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BarChart;
