import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [selectedMenu, setSelectedMenu] = useState({});
  const navigate = useNavigate();
  const menu = [
    {
      title: "Charts",
      navigationUrl: "/chart"
    },
    {
      title: "Statistics",
      navigationUrl: "/statistics"
    }
  ];
  const handleNavigate = item => {
    setSelectedMenu(item);
    navigate(item.navigationUrl);
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigate({ title: "home", navigationUrl: "/" })}
        >
          Home
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {menu.map((item, index) => {
              return (
                <li className="nav-item" key={index}>
                  <div
                    className={`nav-link ${item.title === selectedMenu.title ? "active" : ""}`}
                    aria-current="page"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavigate(item)}
                  >
                    {item.title}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
