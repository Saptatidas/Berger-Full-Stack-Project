import { Link } from "react-router-dom";

function Interface_2_Full() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Hidden checkbox for toggle */}
      <input type="checkbox" id="menu-toggle" className="hidden peer" />

      {/* Hamburger icon (hidden on md and above) */}
      <label
        htmlFor="menu-toggle"
        className="fixed top-0 left-0 z-30 flex h-12 w-12 cursor-pointer items-center justify-center bg-gray-100 text-2xl text-black md:hidden peer-checked:bg-gray-700 peer-checked:text-white"
      >
        &#9776;
      </label>

      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-20 h-screen w-64 bg-gray-700 p-6 text-white
                      -translate-x-full transition-transform duration-300
                      peer-checked:translate-x-0
                      md:translate-x-0 md:static">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-wide">
          BERGER
        </h1>
        <nav className="flex flex-col gap-3">
          <Link to="/login/full/menu" className="rounded-md px-3 py-2 hover:bg-[#726d6d]">
            MENU
          </Link>
          <Link to="/login/full/report" className="rounded-md px-3 py-2 hover:bg-[#726d6d]">
            REPORTS
          </Link>
          {/* <Link to="/login/full/sku/id" className="rounded-md px-3 py-2 hover:bg-[#726d6d]">
            ENTRY
          </Link>
          <Link to="/login/full/cst" className="rounded-md px-3 py-2 hover:bg-[#726d6d]">
            DATA
          </Link> */}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pt-16 md:pt-6 md:ml-64">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-gray-700">BERGER PAINTS INDIA</p>
      </div>
    </div>
  );
}

export default Interface_2_Full;
