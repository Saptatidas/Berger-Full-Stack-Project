import React from 'react'
// import './App.css'
// import Home from './components/Home'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interface_2_Full from './components/Interface2full';
import Interface_2_Restrict from './components/Interface2Restrict';
import Fetch_Interface from './components/Fetch_Interface';
import Update_Interface from './components/Update_Interface';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Home page */}
        {/* <Route path='/' element={<Home/>} /> */}

        {/* Login */}
        <Route path='/login' element={<Login/>} />
        
        {/* Full Dashboard after Login */}
        <Route path='/login/full' element={<Interface_2_Full/>}/>
        <Route path='/login/full/menu' element={<h2>Menu Page</h2>}/>
        <Route path='/login/full/report' element={<h2>Reports Page</h2>}/>
        <Route path='/login/full/sku/id' element={<Fetch_Interface/>}/>
        <Route path='/login/full/cst' element={<Update_Interface/>}/>

        {/* Restrict Dashboard after Login */}
        <Route path='/login/restrict' element={<Interface_2_Restrict/>}/>
        <Route path='/login/restrict/menu' element={<h2>Menu Page</h2>}/>
        <Route path='/login/restrict/report' element={<h2>Reports Page</h2>}/>
      </Routes>

    </div>
  );
}
export default App;

