import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentSelector from "./components/AgentSelector";
import TravelForm from "./components/TravelForm";
import Results from "./components/Results";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AgentSelector />} />
        <Route path="/form" element={<TravelForm />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;