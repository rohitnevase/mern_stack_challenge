import React, { useEffect, useState } from "react";
import { getStatistics } from "../api/api";
import { toast } from "react-toastify";

function Statistics() {
  const [data, setData] = useState([]);

  const months = [
    { number: 1, title: "January" },
    { number: 2, title: "February" },
    { number: 3, title: "March" },
    { number: 4, title: "April" },
    { number: 5, title: "May" },
    { number: 6, title: "June" },
    { number: 7, title: "July" },
    { number: 8, title: "August" },
    { number: 9, title: "September" },
    { number: 10, title: "October" },
    { number: 11, title: "November" },
    { number: 12, title: "December" }
  ];
  const [selectedMonth, setSelectedMonth] = useState(months[2]);

  // req send to server when selectedMonth get updated
  useEffect(() => {
    getData();
  }, [selectedMonth]);

  const handleItemClick = item => {
    setSelectedMonth(item);
  };

  const getData = async () => {
    try {
      const response = await getStatistics(selectedMonth.number);
      console.log(response);

      if (response.message === "success") setData(response.data);
      else toast.error("Something went wrong");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="p-4" style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
      <h3>Statistics</h3>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedMonth.title}
        </button>
        <ul className="dropdown-menu">
          {months.map((item, index) => {
            return (
              <li key={index} value={item.number} style={{ cursor: "pointer" }}>
                <div className="dropdown-item" onClick={() => handleItemClick(item)}>
                  {item.title}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="card" style={{ width: '25rem' }}>
        <div className="card-body shadow">
          <ul>
            
            <li>Total Sale Amount:<b>{Math.round(data.totalSaleAmount).toFixed(2) }</b></li>
            <li>Total Sold Items: <b>{data.totalSoldItems}</b></li>
            <li>TOtal Unsold Item: <b>{data.totalUnsoldItems}</b></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
