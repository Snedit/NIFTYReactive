import React, { useState } from "react";
import axios from "axios";
import update from "./Update";
import deleteItem from "./Delete";
const DisplaySearchResults = ({ searchResults, closeResults, refreshData }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});

  if (!Array.isArray(searchResults) || searchResults.length === 0) {
    return <p>No results found.</p>;
  }

  // ✅ Handle Edit Click
  const handleEdit = (index, result) => {
    setEditingIndex(index);
    setEditValues({ ...result }); // Store current values
  };

  // ✅ Handle Input Change
  const handleInputChange = (e, field) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };
  const handleFloatChange = (e, field) => {
    setEditValues({ ...editValues, [field]: parseFloat(e.target.value) });
  };
  const handleIntChange = (e, field) => {
    setEditValues({ ...editValues, [field]: parseInt(e.target.value) });
  };

  // ✅ Handle Save Update
  const handleSaveEdit = () => {
    update(editValues.Ticker, editValues, refreshData);
  };

  // ✅ Handle Cancel Update
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValues({});
  };

  // ✅ Handle Delete Entry
  const handleDelete = (ticker) => {
    deleteItem(ticker, refreshData);
  };

  return (
    <div id="searchResults" className="searchResultsContainer">
      <button onClick={closeResults} className="closeButton">
        X
      </button>

      {searchResults.map((result, index) => (
        <div key={index} className="searchResult">
          <h3>{result.Ticker}</h3>

          {/* ✅ Editable Fields */}
          <p>
            {editingIndex === index ? (
              <input
                type="date"
                value={editValues.Date}
                onChange={(e) => handleInputChange(e, "Date")}
              />
            ) : (
              `${result.Date} ${result.Time}`
            )}
          </p>
          <p>
            Open:{" "}
            {editingIndex === index ? (
              <input
                type="number"
                value={editValues.Open}
                onChange={(e) => handleFloatChange(e, "Open")}
              />
            ) : (
              result.Open
            )}{" "}
            <span>
              High:{" "}
              {editingIndex === index ? (
                <input
                  type="number"
                  value={editValues.High}
                  onChange={(e) => handleFloatChange(e, "High")}
                />
              ) : (
                result.High
              )}{" "}
            </span>
            <span>
              Low:{" "}
              {editingIndex === index ? (
                <input
                  type="number"
                  value={editValues.Low}
                  onChange={(e) => handleFloatChange(e, "Low")}
                />
              ) : (
                result.Low
              )}{" "}
            </span>
            <span>
              Close:{" "}
              {editingIndex === index ? (
                <input
                  type="number"
                  value={editValues.Close}
                  onChange={(e) => handleFloatChange(e, "Close")}
                />
              ) : (
                result.Close
              )}
            </span>
          </p>
          <p>
            <span>
              Volume:{" "}
              {editingIndex === index ? (
                <input
                  type="number"
                  value={editValues.Volume}
                  onChange={(e) => handleIntChange(e, "Volume")}
                />
              ) : (
                result.Volume
              )}{" "}
            </span>
            <span>
              OI:{" "}
              {editingIndex === index ? (
                <input
                  type="number"
                  value={editValues.OI}
                  onChange={(e) => handleIntChange(e, "OI")}
                />
              ) : (
                result.OI
              )}
            </span>
          </p>

          <div className="actions">
            {editingIndex === index ? (
              <>
                <button onClick={handleSaveEdit} className="saveButton">
                  ✔
                </button>
                <button onClick={handleCancelEdit} className="cancelButton">
                  ❌
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(index, result)}
                  className="editButton"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    handleDelete(result.Ticker);
                    closeResults();
                  }}
                  className="deleteButton"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplaySearchResults;
