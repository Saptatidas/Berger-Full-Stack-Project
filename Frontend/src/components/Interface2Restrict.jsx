import './Int2_Full.css'
import { Link } from "react-router-dom";
function Interface_2_Restrict(){
    return (
        <div>
            <input type="checkbox" id="menu-toggle" />
            <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
            <div className="sidebar">
                <h1>BERGER</h1>
                <Link to="/login/restrict/menu">MENU</Link>
                <Link to="/login/restrict/report">REPORTS</Link>
                {/* <a href="sku.html">ENTRY</a>
                <a href="cust.html">DATA</a> */}
                {/* <!-- <a href="#">SKU Query</a>
                <a href="#">Customer Limit</a> --> */}
            </div>
            <div className="content">
                <h1>Welcome </h1>
                <p>
                    BERGER PAINTS INDIA
        
                </p>
            </div>
        </div>
    );
}
export default Interface_2_Restrict;