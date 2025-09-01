import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import Users  from"./model/User_Model.js"
import Sku from "./model/Sku_Model.js"
import Cst from "./model/Cst_Model.js"
import oracledb from "oracledb";
import bodyParser from "body-parser";


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// CORS middleware (so React can talk to backend)
app.use(cors());

app.use(bodyParser.json());

//mongoDB

try {
    mongoose.connect("mongodb+srv://saptatidas1:1234@cluster0.jskb572.mongodb.net/").then(()=> {
        console.log("database connected")
    });
} catch (error) {
    console.log("error:",error);
}



let pool;

async function connectToOracle() {
  try {
    // Change these credentials to match your Oracle setup
    pool = await oracledb.createPool({
      user: "APPSVIEW",
      password: "APPSVIEW",
      connectString: "10.90.3.144:1521/ebs_BPPREPD", // Example for Oracle XE or PDB
      connectTimeout: 120,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
    });

    console.log("✅ Successfully connected to Oracle Database!");
    console.log(pool)

    // await connection.close();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

// connectToOracle();

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log(`Received ${req.method} request on ${req.url}`);
    next();
});

// Dummy users
// const users = [
//     { username: "admin", password: "1234" },
//     { username: "test", password: "password" }
// ];


/* -------------------- AUTH ROUTES -------------------- */
// Login route
app.post("/login", async(req, res) => {
    const { username, password } = req.body;
    console.log("Body received:", req.body);

    try{
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        const user = await Users.findOne({username});

        if(!user){
            const result = await Users.create({
                username,
                password
            })
            res.send({
                message : result
            })
            return res.json({ 
                message: "User created and logged in successfully" ,
                user: { id: user._id, username: user.username },
            });
        }
        
        // if user exists → check password
        
        if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        // role-based redirect
        if (user.username === "admin@gmail.com") {
        return res.json({ message: "Welcome Admin", role: "admin" });
        } else {
        return res.json({ message: "Welcome User", role: "user" });
        }

        // const user = users.find(
        //     (u) => {

        //         console.log(u)
            
        //        return u.username === username && u.password === password

        //     }
        // );

        // const result = await Users.create({
        //     username,
        //     password
        // })
        // res.send({
        //     message : result
        // })

        // if (Users) {
        //     res.json({message:"✅ Login successful"});
        // } else {
        //     res.status(401).json({ error: "❌ Invalid username or password" });
        // }
    }
    catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Server error" });
  }    
});




/* -------------------- SKU ROUTES (MongoDB) -------------------- */

//SKU route
app.post("/sku", async(req,res) => {

    try {

        const {sku, org, subinventory, stock} = req.body;
        console.log("Body received:", req.body);
        if (!sku || !subinventory || stock === undefined) {
            return res.status(400).json({ error: "SKU ProductName Stock required" });
        }

        const result = await Sku.create({
            sku, org, subinventory, stock
        });
        res.status(201).json({
            sku: result.sku,
            org: result.org,
            subinventory: result.subinventory,
            stock: result.stock,
        });
        
    } catch (error) {
        // if(error.code === 11000){
        //     return res.status(400).json({ message: " SKU must be unique "});
        // }
        res.status(500).json({ error: error.message});
    }
    

});
//READ ALL
// READ ALL (only return sku, subinventory, stock)
app.get("/sku", async (req, res) => {
  try {
    const products = await Sku.find({}, "sku org subinventory stock"); 
    // second argument = projection (only include these fields)

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//READ One
// READ multiple by SKU
app.post("/sku/id", async (req, res) => {
  try {
    const products = await Sku.find({ sku: req.body.sku, org: req.body.org });

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    // Return only subinventory + stock + sku
    const response = [];
    products.forEach((p) => {
      if (Array.isArray(p.subinventory) && Array.isArray(p.stock)) {
        for (let i = 0; i < p.subinventory.length; i++) {
          response.push({
            sku: p.sku,
            org: p.org,
            subinventory: p.subinventory[i],
            stock: p.stock[i],
          });
        }
      }
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//UPDATE
app.post("/sku/update", async (req, res) => {
    try {
        
        const { sku, subinventory, stock} = req.body;
        
        if(!sku){
            return res.status(400).json({ error: "SKU required" });
        }


        //Find by sku
        const product = await Sku.findOne({ sku });
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        
        }

        //Get the _id
        const id = product._id;

        //update using _id
        const updated = await Sku.findByIdAndUpdate(
            id,
            {   
                subinventory, stock 
            },
            {
                new: true
            }
        );

        res.json(
        {
            message: "Product updated succesffully",
            updatedProduct: updated
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}) 


//DELETE
app.post("/sku/delete", async( req, res) => {
    try {
        const {sku, org} =req.body;

        if(!sku && !org) {
            return res.status(400).json({
                error: "Sku and Org required"
            });
        }
        //find the product by SKU
        const product = await Sku.findOne({ sku, org });
        if(!product) {
            return res.status(404).json({   message: "Product not found"});
        }
        //Get the _id
        const id= product._id;

        //Delete by _id
        await Sku.findByIdAndDelete(id);

        res.json({
            message:"Product deleted successfully",
            deletedSku: sku
        });
    }catch(error){
        res.status(500).json(
            {  
                error: error.message
            }
        );
    }
})


//CST route
app.post("/cst", async(req,res) => {
    const {cst} = req.body;
    console.log("Body received:", req.body);
    if (!cst) {
        return res.status(400).json({ error: "SKU required" });
    }

    const result = await Cst.create({
        cst
    })
    res.send({
        message : result
    })

})

// Test route
app.post("/", (req, res) => {
    res.send("Hello world");
    console.log("heyaa");
});

app.post("/get-stock", async (req, res) => {
  const { P_ORG, P_SKU } = req.body; // params from body

  if (!P_ORG || !P_SKU) {
    return res.status(400).json({ error: "P_ORG and P_SKU are required" });
  }

  let dbconnection;
  try {

    if (!pool) throw new Error("Oracle pool not initialized");
    dbconnection = await pool.getConnection();

    const query = `
      SELECT
        SUBSTR(HOU.ATTRIBUTE4,1,2) REGN,
        HOU.NAME DEPOT,
        MSIB.SEGMENT1 SKU,
        MOQ.SUBINVENTORY_CODE SUBINVENTORY,
        MIL.SEGMENT1 LOCATOR,
        MSIB.DESCRIPTION,
        MSIB.SECONDARY_UOM_CODE UOM,
        SUM(MOQ.TRANSACTION_QUANTITY) QTY
    FROM
        MTL_ONHAND_QUANTITIES MOQ,
        MTL_SYSTEM_ITEMS_B MSIB,
        MTL_ITEM_LOCATIONS MIL,
        HR_ORGANIZATION_UNITS_V HOU
    WHERE
        MSIB.ORGANIZATION_ID=102
        AND MOQ.INVENTORY_ITEM_ID=MSIB.INVENTORY_ITEM_ID
        AND MOQ.LOCATOR_ID=MIL.INVENTORY_LOCATION_ID
        AND HOU.ORGANIZATION_ID=MOQ.ORGANIZATION_ID
        AND HOU.BUSINESS_GROUP_ID=81
        AND HOU.LOCATION_CODE = :P_ORG
        AND MSIB.SEGMENT1   = :P_SKU
    GROUP BY
        SUBSTR(HOU.ATTRIBUTE4,1,2),
        HOU.NAME,
        MSIB.SEGMENT1,
        MOQ.SUBINVENTORY_CODE,
        MIL.SEGMENT1,
        MSIB.DESCRIPTION,
        MSIB.SECONDARY_UOM_CODE
    ORDER BY
        1,2,3,4,5;

    `;

    const result = await dbconnection.execute(
        query,
        { P_ORG, P_SKU },  // bind variables dynamically
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (dbconnection) {
      try {
        await dbconnection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});

// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
// });

/* -------------------- SKU ROUTES (Oracle CRUD) -------------------- */
// 🔥 CREATE SKU
// app.post("/sku", async (req, res) => {
//   const { sku, subinventory, stock } = req.body;
//   if (!sku || !subinventory || stock === undefined) {
//     return res.status(400).json({ error: "sku, subinventory, stock required" });
//   }

//   let conn;
//   try {
//     conn = await pool.getConnection();
//     await conn.execute(
//       `INSERT INTO SKU (sku, subinventory, stock) VALUES (:sku, :subinventory, :stock)`,
//       { sku, subinventory, stock },
//       { autoCommit: true }
//     );
//     res.status(201).json({ sku, subinventory, stock });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (conn) await conn.close();
//   }
// });

// // 🔥 READ ALL
// app.get("/sku", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const result = await conn.execute(`SELECT sku, subinventory, stock FROM SKU`);
//     if (!result.rows.length) return res.status(404).json({ message: "No products found" });

//     const products = result.rows.map(r => ({
//       sku: r[0],
//       subinventory: r[1],
//       stock: r[2],
//     }));
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (conn) await conn.close();
//   }
// });

// // 🔥 READ ONE (by SKU)
// app.post("/sku/id", async (req, res) => {
//   const { sku } = req.body;
//   if (!sku) return res.status(400).json({ error: "sku required" });

//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const result = await conn.execute(
//       `SELECT sku, subinventory, stock FROM SKU WHERE sku = :sku`,
//       { sku }
//     );
//     if (!result.rows.length) return res.status(404).json({ message: "Not Found" });

//     const products = result.rows.map(r => ({
//       sku: r[0],
//       subinventory: r[1],
//       stock: r[2],
//     }));
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (conn) await conn.close();
//   }
// });

// // 🔥 UPDATE
// app.post("/sku/update", async (req, res) => {
//   const { sku, subinventory, stock } = req.body;
//   if (!sku) return res.status(400).json({ error: "sku required" });

//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const result = await conn.execute(
//       `UPDATE SKU SET subinventory = :subinventory, stock = :stock WHERE sku = :sku`,
//       { sku, subinventory, stock },
//       { autoCommit: true }
//     );
//     if (!result.rowsAffected) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product updated successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (conn) await conn.close();
//   }
// });

// // 🔥 DELETE
// app.post("/sku/delete", async (req, res) => {
//   const { sku } = req.body;
//   if (!sku) return res.status(400).json({ error: "sku required" });

//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const result = await conn.execute(
//       `DELETE FROM SKU WHERE sku = :sku`,
//       { sku },
//       { autoCommit: true }
//     );
//     if (!result.rowsAffected) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product deleted successfully", deletedSku: sku });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (conn) await conn.close();
//   }
// });

connectToOracle()
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});