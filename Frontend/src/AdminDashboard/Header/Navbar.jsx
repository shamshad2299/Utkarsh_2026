import React from 'react'
import { Link } from "react-router-dom";

const Navbar = ({logout , admin}) => {
  console.log(admin)
  return (
     <div>
      <div className="flex max-sm:flex-col min-h-15 bg-[#2e7593] justify-between pr-10 items-center">

        <p className=" text-2xl pl-10 text-amber-300">
          UTKARSH 2026 ADMINSTRATION !
        </p>
        <div
          className="flex flex-col gap-4 
                md:flex-row md:items-center md:justify-between 
                text-white px-6 py-4 rounded-xl  "
        >
          {/* Welcome */}
          <p className="text-lg font-semibold">
            Welcome, <span className="text-blue-400">{admin?.name}</span>
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-blue-400 transition underline-offset-4 hover:underline"
            >
              View Website
            </Link>

            <Link
              to="/admin/change-password"
              className="text-sm font-medium hover:text-blue-400 transition underline-offset-4 hover:underline"
            >
              Change Password
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 px-5 py-2 rounded-md text-sm font-semibold
                 hover:bg-red-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <hr />
    </div>
  )
}

export default Navbar