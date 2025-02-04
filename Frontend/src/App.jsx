import OptionList from "./Table";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* 🔥 Title */}
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">
        Option Tracker 📈
      </h1>

      {/* 📊 Table Component */}
      <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <OptionList />
      </div>
    </div>
  );
}

export default App;
