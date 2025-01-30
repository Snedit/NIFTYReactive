import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Table.css";

const OptionList = () => {
  const [options, setOptions] = useState([]);
  const [totalOpen, setTotalOpen] = useState(0);
  const [totalClose, setTotalClose] = useState(0);
  const [totalHigh, setTotalHigh] = useState(0);
  const [totalLow, setTotalLow] = useState(0);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/optionData")
      .then((response) => {
        console.log(response.data);
        setOptions(response.data.data);
        console.log("total high: ", response.data.totalHigh);
        // Summing values from the received data

        setTotalHigh(response.data.total_high);
        setTotalLow(response.data.total_low);
        setTotalClose(response.data.total_close);
        setTotalOpen(response.data.total_open);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h2 className="heading">Option Data</h2>
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
          {options.map((option) => (
            <tr key={option.Ticker}>
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
                <button onClick={() => alert("Delete Coming Soon!")}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Total Open: </strong> {totalOpen}
      </p>
      <p>
        <strong>Total Close: </strong> {totalClose}
      </p>
      <p>
        <strong>Total High: </strong> {totalHigh}
      </p>
      <p>
        <strong>Total Low: </strong> {totalLow}
      </p>
    </div>
  );
};

export default OptionList;
