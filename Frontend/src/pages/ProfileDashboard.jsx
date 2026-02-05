import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  MapPin,
  LogOut,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

const ProfileDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser({
        name: "Demo User",
        email: "demo@gmail.com",
        phone: "+91 99999 99999",
        college: "BBD University, Lucknow",
        city: "Lucknow",
        utkarshId: "UTK26-DEMO",
      });

      setRegisteredEvents([
        {
          id: 1,
          title: "Hackathon 2026",
          category: "Technical Event",
          date: "26 Feb 2026",
          status: "Confirmed",
        },
        {
          id: 2,
          title: "Dance Battle",
          category: "Cultural Event",
          date: "27 Feb 2026",
          status: "Pending",
        },
      ]);

      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        name: "Aditya Singh",
        email: "aditya@gmail.com",
        phone: "+91 98765 43210",
        college: "BBD University, Lucknow",
        city: "Lucknow",
        utkarshId: "UTK26-10239",
      });
    }

    setRegisteredEvents([
      {
        id: 1,
        title: "Hackathon 2026",
        category: "Technical Event",
        date: "26 Feb 2026",
        status: "Confirmed",
      },
      {
        id: 2,
        title: "Dance Battle",
        category: "Cultural Event",
        date: "27 Feb 2026",
        status: "Confirmed",
      },
      {
        id: 3,
        title: "EDM Night Pass",
        category: "Concert",
        date: "28 Feb 2026",
        status: "Pending",
      },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#080131]" />

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-700/25 rounded-full blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-700/25 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[420px]">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_rgba(139,92,246,0.12)] p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-1 ring-white/20">
                  <User size={28} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">
                    {user.name}
                  </h2>
                  <p className="text-sm text-white/70 truncate">
                    {user.utkarshId}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <Mail size={18} className="text-purple-300" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>

                <div className="flex items-center gap-3 text-white/90">
                  <Phone size={18} className="text-purple-300" />
                  <span className="text-sm truncate">{user.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-white/90">
                  <GraduationCap size={18} className="text-purple-300" />
                  <span className="text-sm truncate">{user.college}</span>
                </div>

                <div className="flex items-center gap-3 text-white/90">
                  <MapPin size={18} className="text-purple-300" />
                  <span className="text-sm truncate">{user.city}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 py-3 rounded-2xl font-semibold bg-white text-[#080131] hover:bg-gray-100 transition">
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 flex items-center justify-center transition"
                  title="Logout"
                >
                  <LogOut size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(139,92,246,0.08)] p-6">
              <h3 className="text-lg font-bold text-white">Your Summary</h3>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Registered Events</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {registeredEvents.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/70">Account</p>
                  <p className="text-base font-bold text-white mt-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-400" />
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_70px_rgba(139,92,246,0.10)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold">
                    Profile Dashboard
                  </h1>
                  <p className="text-white/70 mt-1 text-sm sm:text-base">
                    Manage your details and view your event registrations.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-3 rounded-2xl font-semibold bg-white text-[#080131] hover:bg-gray-100 transition"
                >
                  Back to Home
                </button>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-2">
                  <CalendarDays size={20} className="text-purple-300" />
                  <h2 className="text-xl font-bold text-white">
                    Your Registered Events
                  </h2>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {registeredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-md hover:shadow-xl transition p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-purple-200 font-semibold">
                            {event.category}
                          </p>

                          <h3 className="text-xl font-extrabold text-white mt-2">
                            {event.title}
                          </h3>

                          <p className="text-sm text-white/70 mt-2">
                            Date:{" "}
                            <span className="font-semibold text-white">
                              {event.date}
                            </span>
                          </p>
                        </div>

                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold border ${
                            event.status === "Confirmed"
                              ? "bg-green-500/15 text-green-200 border-green-400/20"
                              : "bg-yellow-500/15 text-yellow-200 border-yellow-400/20"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 py-3 rounded-2xl font-semibold bg-white text-[#080131] hover:bg-gray-100 transition">
                          View Pass
                        </button>

                        <button className="flex-1 py-3 rounded-2xl font-semibold bg-white/10 border border-white/10 hover:bg-white/15 transition text-white">
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {registeredEvents.length === 0 && (
                  <div className="mt-8 text-center text-white/70">
                    No registrations yet.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/40">
              UTKARSH&apos;26 • Profile Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
