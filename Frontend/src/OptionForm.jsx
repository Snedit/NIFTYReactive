// import React, { useState } from "react";
// import axios from "axios";

// const OptionForm = ({ refreshData }) => {
//   const [isFormVisible, setIsFormVisible] = useState(false);

//   const [formData, setFormData] = useState({
//     Ticker: "",
//     Date: "",
//     Time: "",
//     Open: 0.0,
//     High: 0.0,
//     Low: 0.0,
//     Close: 0.0,
//     Volume: 0,
//     OI: 0,
//   });

//   const handleStringChange = (e) => {
//     // convert the string to upper case
//     setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
//   };

//   const handleFloatChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
//   };
//   const handleIntChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     //niftyreactive.onrender.com
//     axios
//       .post("https://niftyreactive.onrender.com/optionData", formData)

//       .then(() => {
//         alert("Data Added Successfully!");
//         setFormData({
//           // Clear form fields after submission
//           Ticker: "",
//           Date: "",
//           Time: "",
//           Open: 0.0,
//           High: 0.0,
//           Low: 0.0,
//           Close: 0.0,
//           Volume: 0,
//           OI: 0,
//         });
//         refreshData();
//       })
//       .catch((error) => {
//         console.error("Error adding data:", error);
//         alert("Data not added. Please check the console for errors.");
//       });
//   };

//   return (
//     <div className="optionForm">
//       <button
//         onClick={() => setIsFormVisible(!isFormVisible)}
//         className="toggleButton"
//       >
//         {isFormVisible ? "Hide Form" : "Add New Entry"}
//       </button>
//       {isFormVisible && (
//         <>
//           <h2>Add New Option</h2>
//           <form onSubmit={handleSubmit} className="submitForm">
//             <label htmlfor="Ticker">Enter Ticker</label>
//             <input
//               value={formData.Ticker}
//               type="text"
//               name="Ticker"
//               placeholder="Ticker"
//               onChange={handleStringChange}
//               required
//             />

//             <label htmlFor="Date">Enter Date:</label>
//             <input
//               value={formData.Date}
//               type="date"
//               name="Date"
//               placeholder="Date (YYYY-MM-DD)"
//               onChange={handleStringChange}
//               required
//             />
//             <label htmlFor="Time">Enter time:</label>
//             <input
//               value={formData.Time}
//               type="time"
//               name="Time"
//               placeholder="Time (HH:MM)"
//               onChange={handleStringChange}
//               required
//             />
//             <label htmlFor="Open">Enter Open Price:</label>
//             <input
//               value={formData.Open}
//               type="number"
//               step="0.01"
//               name="Open"
//               placeholder="Open Price"
//               onChange={handleFloatChange}
//               required
//             />
//             <label htmlFor="High">Enter High Price:</label>
//             <input
//               value={formData.High}
//               type="number"
//               step="0.01"
//               name="High"
//               placeholder="High Price"
//               onChange={handleFloatChange}
//               required
//             />
//             <label htmlFor="Low">Enter Low Price:</label>
//             <input
//               value={formData.Low}
//               type="number"
//               step="0.01"
//               name="Low"
//               placeholder="Low Price"
//               onChange={handleFloatChange}
//               required
//             />
//             <label htmlFor="Close">Enter Close Price:</label>
//             <input
//               value={formData.Close}
//               type="number"
//               step="0.01"
//               name="Close"
//               placeholder="Close Price"
//               onChange={handleFloatChange}
//               required
//             />
//             <label htmlFor="Volume">Enter the volume:</label>
//             <input
//               value={formData.Volume}
//               type="number"
//               name="Volume"
//               placeholder="Volume"
//               onChange={handleIntChange}
//               required
//             />
//             <label htmlFor="OP">Enter the Open Interest:</label>
//             <input
//               value={formData.OI}
//               type="number"
//               name="OI"
//               placeholder="Open Interest (OI)"
//               onChange={handleIntChange}
//               required
//             />
//             <button type="submit">Add</button>
//           </form>
//         </>
//       )}
//     </div>
//   );
// };

// export default OptionForm;

import React, { useState } from "react";
import axios from "axios";

const OptionForm = ({ refreshData }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

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
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
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
      .post("https://niftyreactive.onrender.com/optionData", formData)
      .then(() => {
        alert("Data Added Successfully!");
        setFormData({
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
        refreshData();
      })
      .catch((error) => {
        console.error("Error adding data:", error);
        alert("Data not added. Please check the console for errors.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* ✅ Toggle Button */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        {isFormVisible ? "Hide Form" : "Add New Entry"}
      </button>

      {/* ✅ Form */}
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 w-full max-w-lg bg-gray-800 text-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Add New Option
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-300">Ticker</label>
              <input
                value={formData.Ticker}
                type="text"
                name="Ticker"
                placeholder="Enter Ticker"
                onChange={handleStringChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Date</label>
              <input
                value={formData.Date}
                type="date"
                name="Date"
                onChange={handleStringChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Time</label>
              <input
                value={formData.Time}
                type="time"
                name="Time"
                onChange={handleStringChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Open</label>
              <input
                value={formData.Open}
                type="number"
                step="0.01"
                name="Open"
                onChange={handleFloatChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">High</label>
              <input
                value={formData.High}
                type="number"
                step="0.01"
                name="High"
                onChange={handleFloatChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Low</label>
              <input
                value={formData.Low}
                type="number"
                step="0.01"
                name="Low"
                onChange={handleFloatChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Close</label>
              <input
                value={formData.Close}
                type="number"
                step="0.01"
                name="Close"
                onChange={handleFloatChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Volume</label>
              <input
                value={formData.Volume}
                type="number"
                name="Volume"
                onChange={handleIntChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300">Open Interest (OI)</label>
              <input
                value={formData.OI}
                type="number"
                name="OI"
                onChange={handleIntChange}
                required
                className="w-full px-3 py-2 rounded-md text-white"
              />
            </div>
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white px-4 py-2 mt-4 rounded-md"
          >
            Add Entry
          </button>
        </form>
      )}
    </div>
  );
};

export default OptionForm;
