import { HashRouter, Route, Routes } from "react-router-dom";
import Billing from "./components/Billing/Billing";
import Login from "./components/Login/Login";


function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<Login />} />          
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
