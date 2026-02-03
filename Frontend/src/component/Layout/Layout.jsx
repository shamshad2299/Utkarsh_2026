import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-24 bg-[#050214] text-white min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
