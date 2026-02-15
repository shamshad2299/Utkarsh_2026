import { Outlet } from "react-router-dom";
import EventsSidebar from "../EventsPage/EventSiderBar";
const EventsLayout = () => {
  return (
    <>
      <div className="flex min-h-screen bg-[#080131] text-white">
        {/* SIDEBAR */}
        <EventsSidebar />

        {/* CONTENT */}
        <div className="flex-1 px-6 md:px-12 py-8">
          <Outlet />
        </div>
      </div>
     
    </>
  );
};

export default EventsLayout;
