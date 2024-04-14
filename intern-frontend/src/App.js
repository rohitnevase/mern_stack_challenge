import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TransactionTable from "./screens/ProductsTable";
import Charts from "./screens/Charts";
import Statistics from "./screens/Statistics";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<TransactionTable />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/chart" element={<Charts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
