import { useState } from "react";

// import "./App.css";
import OptionList from "./Table";
import OptionForm from "./OptionForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Option Tracker</h1>

      <OptionList></OptionList>
    </div>
  );
}

export default App;
