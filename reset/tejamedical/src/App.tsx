import { HashRouter, Route, Routes } from "react-router-dom";
import Billing from "./components/Billing/Billing";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import CustomerList from "./components/Customers/CustomerList";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/billing" element={<Billing />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/customerlist" element={<CustomerList />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
