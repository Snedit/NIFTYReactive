import axios from "axios";

const update = (ticker, newData, refreshData) => {
  axios
    .put(`http://127.0.0.1:5000/optionData/${ticker}`, newData)
    .then(() => {
      alert(`Ticker ${ticker} updated successfully!`);
      refreshData(); // Refresh table after update
    })
    .catch((error) => {
        alert(error);
      console.log("An error occurred!", error);
    });
};

export default update;
