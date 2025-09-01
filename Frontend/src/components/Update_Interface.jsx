import './Update.css';
import { useState } from 'react';

function Update_Interface() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault(); // prevent reload
    console.log("Customer Code:", code);
    try {
      const res = await fetch("http://localhost:5000/cst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku })
      });

      if (!res.ok) throw new Error("Failed to Update");
      const data = await res.json();
      setResult(data); // expecting array [{subinventory: 'ABC', stocks: 10}]
      setError("");
    } catch (err) {
      setError("Error Updating data");
      setResult([]);
    }
    // here you can call an API or update state

  };

  return (
    <div className="update-box">
      <form
        className="customer-form"
        onSubmit={handleSubmit}
        aria-label="customer-form"
      >
        <label htmlFor="code">Customer Code :</label>
        <input
          type="text"
          id="code"
          name="code"
          placeholder="Enter Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <div className="result-table">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>DEPO</th>
                <th></th>
                <th>LIMITS</th>
              </tr>
            </thead>
            <tbody>
              {/* Example placeholder rows */}
              <tr>
                <td>ABC</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="update-button">
          <button type="submit">UPDATE</button>
        </div>
      </form>
    </div>
  );
}

export default Update_Interface;
