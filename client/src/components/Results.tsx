const Results = ({ results }: any) => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Results</h2>
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((result: any, index: number) => (
              <li
                key={index}
                className="p-4 border rounded-lg bg-gray-100 shadow-md"
              >
                <h3 className="text-xl font-bold">{result.destination}</h3>
                <p>{result.description}</p>
                <p className="text-sm text-gray-600">
                  Travel dates: {result.startDate} - {result.endDate}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No results yet. Please submit a request!</p>
        )}
      </div>
    );
  };

  export default Results;