import React, { useState } from "react";

function App() {
  const [test, setTest] = useState("hello");
  
  return (
    <div>
      <h1>Test App: {test}</h1>
      <button onClick={() => setTest("world")}>Click me</button>
    </div>
  );
}

export default App;