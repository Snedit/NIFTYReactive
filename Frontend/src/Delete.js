import axios from "axios";

const deleteItem = (ticker, refreshData) => {
  if (window.confirm(`Are you sure you want to delete ${ticker}?`)) {
    axios
      .delete(`http://127.0.0.1:5000/optionData/${ticker}`)
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
