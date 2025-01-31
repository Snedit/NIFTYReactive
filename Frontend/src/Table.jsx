import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Table.css";
import OptionForm from "./OptionForm"; // Import the form component
import deleteItem from "./Delete";
const OptionList = () => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]); // Stores filtered data
  const [totalOpen, setTotalOpen] = useState(0);
  const [totalClose, setTotalClose] = useState(0);
  const [totalHigh, setTotalHigh] = useState(0);
  const [totalLow, setTotalLow] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState(""); // Stores selected date
  const itemsPerPage = 10; // Number of items per page

  // Fetch data from backend
  const fetchData = () => {
    axios
      .get("http://127.0.0.1:5000/optionData")
      .then((response) => {
        console.log(response.data);
        const data = response.data.data || response.data; // Ensure data is an array
        setOptions(data);
        setFilteredOptions(data); // Set filtered options initially to all data

        setTotalHigh(response.data.total_high || 0);
        setTotalLow(response.data.total_low || 0);
        setTotalClose(response.data.total_close || 0);
        setTotalOpen(response.data.total_open || 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Load data when the component mounts
  useEffect(fetchData, []);

  // Handle Date Filtering
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate === "") {
      setFilteredOptions(options); // Show all if date is cleared
    } else {
      const filtered = options.filter((option) => option.Date === selectedDate);
      setFilteredOptions(filtered);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOptions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {/* Auto-updating on form submission */}
      <OptionForm refreshData={fetchData} />

      <h2 className="heading">Option Data</h2>

      {/* ✅ Date Filter Input */}
      <div className="flex items-center mb-4">
        <label className="mr-2 font-bold">Filter by Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={handleDateChange}
          className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-200"
        />
        <button
          onClick={() => {
            setFilterDate("");
            setFilteredOptions(options); // Reset filter
          }}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      <table border="1" className="displayTable">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((option, index) => (
            <tr key={index}>
              <td>{option.Ticker}</td>
              <td>{option.Date}</td>
              <td>{option.Open}</td>
              <td>{option.High}</td>
              <td>{option.Low}</td>
              <td>{option.Close}</td>
              <td>
                <button onClick={() => alert("Update Coming Soon!")}>
                  Update
                </button>
                <button onClick={() => deleteItem(option.Ticker, fetchData)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="page-number">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="page-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <div className="totals">
        <p id="openTotal">
          <strong>Total Open: </strong> {totalOpen}
        </p>
        <p id="closeTotal">
          <strong>Total Close: </strong> {totalClose}
        </p>
        <p id="highTotal">
          <strong>Total High: </strong> {totalHigh}
        </p>
        <p id="lowTotal">
          <strong>Total Low: </strong> {totalLow}
        </p>
      </div>
    </div>
  );
};

export default OptionList;
