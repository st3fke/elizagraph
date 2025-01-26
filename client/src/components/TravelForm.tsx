
const TravelForm = ({ onSubmit }: any) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Plan Your Trip</h2>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4"
      >
        <div>
          <label className="block text-gray-700">Destination (Optional)</label>
          <input
            type="text"
            name="destination"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter destination"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date (Optional)</label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700">Keywords</label>
          <select
            name="keywords"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="beach">Beach</option>
            <option value="mountains">Mountains</option>
            <option value="culture">Culture</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TravelForm;
