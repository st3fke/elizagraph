import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api";

interface Agent {
    id: string;
    name: string;
}

const AgentSelector: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load the agents when the component mounts
        const loadAgents = async () => {
            try {
                const agentsData = await apiClient.fetchAgents();
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

    // Load the selected agent from local storage
    useEffect(() => {
        const storedAgentId = localStorage.getItem("selectedAgentId");
        if (storedAgentId) {
            const storedAgent = agents.find(agent => agent.id === storedAgentId);
            if (storedAgent) {
                setSelectedAgent(storedAgent);
            }
        }
    }, [agents]); // Run this effect whenever agents change

    const handleAgentSelection = (agent: Agent) => {
        setSelectedAgent(agent);
        localStorage.setItem("selectedAgentId", agent.id); // Store selected agent in local storage
        navigate("/form", { state: { agent } });
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