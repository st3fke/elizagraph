import React, { useState } from "react";
import AgentSelector from "./components/AgentSelection";
import TravelForm from "./components/TravelForm";
import Results from "./components/Results";

const App = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = formData.get("destination");
    const date = formData.get("date");
    const keywords = formData.get("keywords");

    // Simulate an API call
    setResults([
      {
        destination: destination || "Unknown",
        description: `Explore amazing adventures in ${
          destination || "your chosen destination"
        }.`,
        startDate: date || "Flexible",
        endDate: "Flexible",
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!selectedAgent ? (
        <AgentSelector
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
        />
      ) : (
        <div className="w-full max-w-xl">
          <TravelForm onSubmit={handleFormSubmit} />
          <Results results={results} />
        </div>
      )}
    </div>
  );
};

export default App;