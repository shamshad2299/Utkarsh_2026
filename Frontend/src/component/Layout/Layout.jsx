import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#080131] text-white min-h-screen">
      <Navbar />
      <main className="pt-24 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
