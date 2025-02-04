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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <OptionForm refreshData={fetchData} />
      <h2 className="text-3xl font-bold text-center my-6">NIFTY Records</h2>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center bg-gray-800 p-2 rounded-lg w-full sm:w-auto">
          <div className="searchContainer">
            <input
              type="text"
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              placeholder="Search by Ticker..."
              className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
            />
            <button
              onClick={() => setSearchTicker("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              X
            </button>
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 px-4 py-2 rounded-md ml-2 hover:bg-blue-700"
          >
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
        <div className="flex items-center bg-gray-800 p-2 rounded-lg">
          <label className="mr-2">Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="bg-gray-700 text-white p-2 rounded-md"
          />
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
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2">Ticker</th>
              <th className="p-2">Date</th>
              <th className="p-2">Open</th>
              <th className="p-2">High</th>
              <th className="p-2">Low</th>
              <th className="p-2">Close</th>
              <th className="p-2">Volume</th>
              <th className="p-2">OI</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((option, index) => (
              <tr key={index}>
                <td className="p-2">{option.Ticker}</td>
                <td className="p-2">
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
                <td className="p-2">
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
                <td className="p-2">
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
                <td className="p-2">
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
                <td className="p-2">
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
                <td className="p-2">
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
                <td className="p-2">
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
                <td className="p-2">
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
                        className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteItem(option.Ticker, fetchData)}
                        className="bg-red-500 px-3 py-1 ml-2 rounded-md hover:bg-red-700"
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
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="totals ">
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
