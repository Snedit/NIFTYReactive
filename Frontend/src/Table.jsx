import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Table.css";
import OptionForm from "./OptionForm";
import DisplaySearchResults from "./SearchResult";
import deleteItem from "./Delete";
import update from "./Update";

const handleSearch = (searchTicker) => {
  if (!searchTicker.trim()) {
    alert("Please enter a valid Ticker!");
    return;
  }

  axios
    .get(`https://niftyreactive.onrender.com/optionData/${searchTicker}`)
    .then((response) => {
      if (response.data) {
        setSearchResult(response.data); // Set the found record
      } else {
        alert("Ticker not found!");
        setSearchResult(null);
      }
    })
    .catch((error) => {
      console.error("Error fetching Ticker:", error);
      alert("Ticker not found!");
      setSearchResult(null);
    });
};
const OptionList = () => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [searchTicker, setSearchTicker] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const itemsPerPage = 5;
  const [totalOpen, setTotalOpen] = useState(0);
  const [totalClose, setTotalClose] = useState(0);
  const [totalHigh, setTotalHigh] = useState(0);
  const [totalLow, setTotalLow] = useState(0);

  // Fetch data from backend
  const fetchData = () => {
    axios
      .get("https://niftyreactive.onrender.com/optionData")
      .then((response) => {
        const data = response.data.data || response.data;
        setOptions(data);
        setFilteredOptions(data);
        setTotalHigh(response.data.total_high || 0);
        setTotalLow(response.data.total_low || 0);
        setTotalClose(response.data.total_close || 0);
        setTotalOpen(response.data.total_open || 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(fetchData, []);
  const closeResults = () => {
    setSearchResult([]);
  };
  const handleSearch = () => {
    if (!searchTicker.trim()) {
      alert("Please enter a valid Ticker!");
      return;
    }

    axios
      .get(`https://niftyreactive.onrender.com/optionData/${searchTicker}`)
      .then((response) => {
        if (response.data) {
          console.log(response.data.data);
          alert("found");
          setSearchResult([response.data.data]);
        } else {
          alert("Ticker not found!");
          setSearchResult([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching Ticker:", error);
        alert("Ticker not found!");
        setSearchResult(null);
      });
  };

  // Clear search results
  const clearSearch = () => {
    setSearchTicker("");
    setSearchResult(null);
  };

  // Handle Date Filtering
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate === "") {
      setFilteredOptions(options);
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

  // Handle Update Click
  const handleEdit = (index, option) => {
    setEditingIndex(index);
    setEditValues({ ...option }); // Store current values
  };

  // Handle Input Change
  const handleInputChange = (e, field) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  // Handle Save Update
  const handleSaveEdit = () => {
    update(editValues.Ticker, editValues, fetchData);
    setEditingIndex(null);
  };

  // Handle Cancel Update
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValues({});
  };

  return (
    <div>
      <OptionForm refreshData={fetchData} />
      <h2 className="heading">NIFTY Records</h2>

      <div className="filters">
        <div className="searchBar">
          <div className="searchContainer">
            <input
              type="text"
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              placeholder="Search by Ticker..."
              className="searchInput"
            />
            <button onClick={() => setSearchTicker("")} className="resetButton">
              X
            </button>
          </div>
          <button onClick={handleSearch} className="searchButton">
            Search
          </button>
          {searchResult && searchResult.length > 0 && (
            <DisplaySearchResults
              searchResults={searchResult}
              closeResults={closeResults}
              refreshData={fetchData}
            />
          )}
        </div>

        {/* Date Filter */}
        <div className="dateFilter">
          <label>Filter by Date:</label>
          <input type="date" value={filterDate} onChange={handleDateChange} />
          {/* <button
            onClick={() => {
              setFilterDate("");
              setFilteredOptions(options);
            }}
          >
            Reset
          </button> */}
        </div>
      </div>
      {/* Table */}
      <table border="1" className="displayTable">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
            <th>OI</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((option, index) => (
            <tr key={index}>
              <td>{option.Ticker}</td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="Date"
                    value={editValues.Date}
                    onChange={(e) => handleInputChange(e, "Date")}
                    className="edited"
                  />
                ) : (
                  option.Date
                )}
              </td>

              {/* Editable Fields */}
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editValues.Open}
                    onChange={(e) => handleInputChange(e, "Open")}
                    className="border p-1 rounded"
                  />
                ) : (
                  option.Open
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editValues.High}
                    onChange={(e) => handleInputChange(e, "High")}
                    className="border p-1 rounded"
                  />
                ) : (
                  option.High
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editValues.Low}
                    onChange={(e) => handleInputChange(e, "Low")}
                    className="border p-1 rounded"
                  />
                ) : (
                  option.Low
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editValues.Close}
                    onChange={(e) => handleInputChange(e, "Close")}
                    className="border p-1 rounded"
                  />
                ) : (
                  option.Close
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editValues.Volume}
                    onChange={(e) => handleInputChange(e, "Volume")}
                    className="border p-1 rounded"
                  />
                ) : (
                  option.Volume
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editValues.OI}
                    onChange={(e) => handleInputChange(e, "OI")}
                    className="border p-1 rounded"
                  />
                ) : (
                  option.OI
                )}
              </td>

              {/* Actions */}
              <td>
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      ✔
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="ml-2 bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                    >
                      ❌
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(index, option)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteItem(option.Ticker, fetchData)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
