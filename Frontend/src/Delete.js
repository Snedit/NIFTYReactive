import axios from "axios";

const deleteItem = (ticker, refreshData) => {
  if (window.confirm(`Are you sure you want to delete ${ticker}?`)) {
    axios
      .delete(`https://niftyreactive.onrender.com/optionData/${ticker}`)
      .then(() => {
        alert("Record deleted successfully!");
        refreshData();
      })
      .catch((error) => {
        console.error("Error deleting record:", error);
      });
  }
};

export default deleteItem;
