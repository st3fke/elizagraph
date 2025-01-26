import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { apiClient } from "../lib/api"; // Adjust based on your structure

interface Agent {
    id: string;
    name: string;
}

const AgentSelector: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null); // State for selected agent
    const navigate = useNavigate(); // Initialize useNavigate for routing

    useEffect(() => {
        const loadAgents = async () => {
            try {
                const agentsData = await apiClient.fetchAgents(); // Fetch combined agents
                setAgents(agentsData);
            } catch (err) {
                setError(`Failed to fetch agents: ${err instanceof Error ? err.message : 'Unknown error'}`);
                console.error('Fetching agents failed:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAgents();
    }, []);

    const handleAgentSelection = (agent: Agent) => {
        setSelectedAgent(agent);
        navigate("/form", { state: { agent } }); // Navigate to TravelForm with agent data
    };

    if (loading) return <div>Loading agents...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose an Agent</h2>
            <div className="grid grid-cols-3 gap-4">
                {agents.map((agent) => (
                    <button
                        key={agent.id}
                        onClick={() => handleAgentSelection(agent)}
                        className={`p-4 rounded-xl shadow-lg transition ${
                            selectedAgent?.id === agent.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-blue-100"
                        }`}
                    >
                        {agent.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AgentSelector;