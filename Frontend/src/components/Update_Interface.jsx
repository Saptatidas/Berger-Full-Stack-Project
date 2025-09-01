import { useState } from 'react';

function Update_Interface() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/cst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: code })
      });

      if (!res.ok) throw new Error("Failed to Update");
      const data = await res.json();
      setResult(data);
      setError("");
    } catch (err) {
      setError("Error Updating data");
      setResult([]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e5e5e5]">
      <div className="bg-white rounded-xl border-[1.5px] border-[#7b7878a0] p-8 w-[500px] max-w-[650px] shadow-lg/20">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          aria-label="customer-form"
        >
          <h2 className="text-xl font-bold text-center mb-2">UPDATE QUERY</h2>

          <label htmlFor="code" className="font-medium text-gray-800">
            Customer Code :
          </label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          {/* {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )} */}

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 border-collapse rounded-md text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 text-left font-semibold">
                    NAME
                  </th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">
                    DEPO
                  </th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">
                    LIMITS
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.length > 0 ? (
                  result.map((row, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 p-2">{row.name || ""}</td>
                      <td className="border border-gray-300 p-2">{row.depo || ""}</td>
                      <td className="border border-gray-300 p-2">{row.limits || ""}</td>
                    </tr>
                  ))
                ) : (
                  error && (
                  <tr>
                    <td
                      colSpan="3"
                      className="border border-gray-300 p-3 text-center text-gray-400 italic"
                    >
                      <p className="text-red-500 font-medium">{error}</p>
                    </td>
                  </tr>
                )
              )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#726d6d] hover:bg-gray-700 text-white px-6 py-2 rounded-md transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Update_Interface;
