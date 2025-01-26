

const agents = ["Agent 1", "Agent 2", "Agent 3"];

const AgentSelection = ({ selectedAgent, setSelectedAgent }: any) => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose an Agent</h2>
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent) => (
          <button
            key={agent}
            onClick={() => setSelectedAgent(agent)}
            className={`p-4 rounded-xl shadow-lg transition ${
              selectedAgent === agent
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-blue-100"
            }`}
          >
            {agent}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgentSelection;
