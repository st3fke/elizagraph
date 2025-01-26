import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api"; // Importuj apiClient
import { UUID, Character } from "@elizaos/core";

interface Agent {
  id: UUID;
  character: Character;
}

const AgentSelector: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await apiClient.getAgents();
        const agentsData = response.agents;  // Izvuci niz agenata iz odgovora
        console.log("Agents Data:", agentsData);
        setAgents(agentsData);  // Postavi niz agenata u stanje
      } catch (err) {
        setError("Failed to fetch agents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) return <div>Loading agents...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">List of Agents</h1>
    <ul className="space-y-4">
      {agents.map((agent) => (
        <li
          key={agent.id}
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-800">{agent.name}</h2>
          {/* You can add more agent details here */}
        </li>
      ))}
    </ul>
  </div>
  );
};

export default AgentSelector;