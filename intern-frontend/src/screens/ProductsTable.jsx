import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/api";
import { toast } from "react-toastify";

const TransactionTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [resultCount, SetResultCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  const months = [
    { number: 0, title: "All" },
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

  const [selectedMonth, setSelectedMonth] = useState(months[3]);
  useEffect(() => {
    getData();
  }, [searchText, selectedMonth, currentPage]);

  const getData = async () => {
    const response = await getAllProducts(currentPage, searchText, selectedMonth.number);
    if (response.message === "success") {
      setData(response.data);
      SetResultCount(response.count);
    } else {
      toast.error("Some thing went wrong");
      setData([]);
    }
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleItemClick = item => {
    setSelectedMonth(item);
  };

  return (
    <div>
      <h2 style={{ paddingLeft: "1em", paddingTop: "0.5em" }}>Transaction Dashboard</h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "between",
          paddingLeft: "2em",
          paddingTop: "2em",
          gap: "1em"
        }}
      >
        <input
          type="text"
          className="form-control"
          style={{ width: "40%" }}
          placeholder="Search here..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
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
      <div style={{ paddingLeft: "2em", paddingTop: "0.5em" }}>
        <h5 style={{ color: data.length === 0 ? "red" : "green" }}>{data.length} Results Found</h5>
        {searchText && <h5>Result for search : {searchText}</h5>}
        {selectedMonth && <h5>Result for Month : {selectedMonth.title}</h5>}
      </div>
      <div
        style={{
          paddingLeft: "2em",
          paddingRight: "2em",
          width: "90%",
          display: "flex",
          margin: "auto"
        }}
      >
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Sold</th>
              <th>Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>
                  <img src={item.image} alt={item.title} style={{ width: "50px" }} />
                </td>
                <td>{item.sold.toString()}</td>
                <td>{item.dateOfSale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
