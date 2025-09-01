import { useState } from 'react';
import "./Fetch.css"

function Fetch_Interface() {
  const [sku, setSku] = useState("");
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
        body: JSON.stringify({ sku })
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
    <div className="query-box"> 
      <div className="title">
          STOCK QUERY
      </div> 
      <form 
        className="sku-form" 
        onSubmit={handleSubmit} 
        aria-label="sku-form"> 
        <label htmlFor="sku">
          SKU
        </label> 
        <div className="input-group"> 
          <input type="text" 
            id="sku" 
            name="sku" 
            placeholder="Enter SKU" 
            value={sku} 
            onChange={(e) => setSku(e.target.value)} required 
          /> 
          <button type="submit">CHECK</button> 
        </div> 
      </form> 
        
      {/* {error && <p className="error">{error}</p>}  */}
        
      <div className="result-table"> 
        <table> 
          <thead> 
            <tr> 
              <th>SUBINVENTORY</th> 
              <th>STOCKS</th> 
            </tr> 
          </thead> 
          <tbody> 
            { result.length > 0 ? ( 
              result.map((row, i) => (
                <tr key={i}> 
                  <td>{row.subinventory}</td> 
                  <td>{row.stock}</td> 
                </tr> )
                ) 
              ) : ( 
                error && ( 
                <tr> 
                  <td colSpan="2">
                  <p className="error">{error}</p></td> 
                </tr> 
                ) 
              )
            } 
          </tbody> 
        </table> 
      </div> 
    </div>
  );
}

export default Fetch_Interface;
