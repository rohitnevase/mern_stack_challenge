import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

function Charts() {
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

  const handleItemClick = item => {
    setSelectedMonth(item);
  };

  useEffect(() => {}, [selectedMonth]);

  return (
    <div style={{ margin: "2em" }}>
      <div style={{ display: "flex", gap: "1em" }}>
        <div style={{ display: "flex", gap: "0.5em" }}>
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
        </div>
      </div>

      <div style={{ marginTop: "2em" }}>
        <BarChart month={selectedMonth.number ? selectedMonth.number : 3} />
        <PieChart month={selectedMonth.number ? selectedMonth.number : 3} />
      </div>
    </div>
  );
}

export default Charts;
