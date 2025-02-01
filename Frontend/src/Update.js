import axios from "axios";

const update = (ticker, newData, refreshData) => {
  console.log("Updating data for", ticker, newData);
  
  axios
    .put(`https://niftyreactive.onrender.com/optionData/${ticker}`, newData)
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
