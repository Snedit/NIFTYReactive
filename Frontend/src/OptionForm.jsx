import React, { useState } from "react";
import axios from "axios";

const OptionForm = ({ refreshData }) => {
  const [formData, setFormData] = useState({
    Ticker: "",
    Date: "",
    Time: "",
    Open: 0.0,
    High: 0.0,
    Low: 0.0,
    Close: 0.0,
    Volume: 0,
    OI: 0,
  });

  const handleStringChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFloatChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };
  const handleIntChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/optionData", formData)

      .then(() => {
        alert("Data Added Successfully!");
        refreshData(); // ✅ Automatically refresh the table after submitting
        setFormData({
          // ✅ Clear form fields after submission
          Ticker: "",
          Date: "",
          Time: "",
          Open: "",
          High: "",
          Low: "",
          Close: "",
          Volume: "",
          OI: "",
        });
      })
      .catch((error) => console.error("Error adding data:", error));
  };

  return (
    <div className="optionForm">
      <h2>Add New Option</h2>
      <form onSubmit={handleSubmit} className="submitForm">
        <label htmlfor="Ticker">Enter Ticker</label>
        <input
          type="text"
          name="Ticker"
          placeholder="Ticker"
          onChange={handleStringChange}
          required
        />

        <label htmlFor="Date">Enter Date:</label>
        <input
          type="date"
          name="Date"
          placeholder="Date (YYYY-MM-DD)"
          onChange={handleStringChange}
          required
        />
        <label htmlFor="Time">Enter time:</label>
        <input
          type="time"
          name="Time"
          placeholder="Time (HH:MM)"
          onChange={handleStringChange}
          required
        />
        <label htmlFor="Open">Enter Open Price:</label>
        <input
          type="number"
          step="0.01"
          name="Open"
          placeholder="Open Price"
          onChange={handleFloatChange}
          required
        />
        <label htmlFor="High">Enter High Price:</label>
        <input
          type="number"
          step="0.01"
          name="High"
          placeholder="High Price"
          onChange={handleFloatChange}
          required
        />
        <label htmlFor="Low">Enter Low Price:</label>
        <input
          type="number"
          step="0.01"
          name="Low"
          placeholder="Low Price"
          onChange={handleFloatChange}
          required
        />
        <label htmlFor="Close">Enter Close Price:</label>
        <input
          type="number"
          step="0.01"
          name="Close"
          placeholder="Close Price"
          onChange={handleFloatChange}
          required
        />
        <label htmlFor="Volume">Enter the volume:</label>
        <input
          type="number"
          name="Volume"
          placeholder="Volume"
          onChange={handleIntChange}
          required
        />
        <label htmlFor="OP">Enter the Open Interest:</label>
        <input
          type="number"
          name="OI"
          placeholder="Open Interest (OI)"
          onChange={handleIntChange}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default OptionForm;
