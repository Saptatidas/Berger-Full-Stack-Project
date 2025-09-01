import { useState } from "react";

function Fetch_Interface() {
  const [sku, setSku] = useState("");
  const [org, setOrg] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult([]);

    if (!sku.trim()) {
      setError("Please enter a valid SKU number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/sku/id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      if (Array.isArray(data)) {
        if (data.length > 0) {
          setResult(data);
        } else {
          setError("No results found for this SKU.");
        }
      } else if (data && data.sku) {
        setResult([data]);
      } else if (data.message === "Not Found") {
        setError("No results found for this SKU.");
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError("Error fetching SKU data");
      setResult([]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] p-4">
      <div className="w-full max-w-[600px] rounded-xl border-[1.5px] border-[#7b7878a0] bg-white p-8 shadow-lg/20">
        {/* Title */}
        <div className="mb-6 text-center text-xl font-bold text-black">
          STOCK QUERY
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} aria-label="sku-form" className="mb-8">
          <label
            htmlFor="sku"
            className="mb-2 block font-bold text-gray-700 text-base"
          >
            SKU
          </label>

          <div className="flex flex-wrap gap-3 max-[500px]:flex-row">
            <input
              type="text"
              id="sku"
              name="sku"
              placeholder="Enter SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="flex-1 rounded-md border border-[gray-300] bg-[#dbdbdb3c] p-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {/* <button
              type="submit"
              className="flex-shrink-0 whitespace-nowrap rounded-md bg-[#726d6d] px-5 py-3 text-base font-medium text-white hover:bg-gray-700"
            >
              CHECK
            </button> */}
          </div>
          <label
            htmlFor="sku"
            className="mb-2 block font-bold text-gray-700 text-base"
          >
            ORG
          </label>
          <div className="flex flex-wrap gap-3 max-[500px]:flex-row">
            <input
              type="org"
              id="org"
              name="org"
              placeholder="Enter ORG"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              required
              className="flex-1 rounded-md border border-[gray-300] bg-[#dbdbdb3c] p-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="submit"
              className="flex-shrink-0 whitespace-nowrap rounded-md bg-[#726d6d] px-5 py-3 text-base font-medium text-white hover:bg-gray-700"
            >
              CHECK
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-base rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-100 px-4 py-3 text-left font-bold">
                  SUBINVENTORY
                </th>
                <th className="border border-gray-300 bg-gray-100 px-4 py-3 text-left font-bold">
                  STOCKS
                </th>
              </tr>
            </thead>
            <tbody>
              {result.length > 0 ? (
                result.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-4 py-3">
                      {row.subinventory}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {row.stock}
                    </td>
                  </tr>
                ))
              ) : (
                error && (
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-center">
                      <p className="text-red-500 font-medium">{error}</p>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Fetch_Interface;
