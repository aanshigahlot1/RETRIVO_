import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Lost from "./Pages/Lost";
import Found from "./Pages/Found";
import Items from "./Pages/Items";
import History from "./Pages/History";
import Confirm from "./Pages/Confirm";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/found" element={<Found />} />
        <Route path="/items" element={<Items />} />
        <Route path="/history" element={<History />} />
        <Route path="/confirm" element={<Confirm />} />
      </Routes>
    </HashRouter>
  );
}