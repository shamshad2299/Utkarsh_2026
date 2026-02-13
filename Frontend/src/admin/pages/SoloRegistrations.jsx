import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";

const SoloRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("adminAccessToken");

        const response = await api.get(
          "/admin/auth/registrations?type=solo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRegistrations(response.data.data);
      } catch (error) {
        console.error("Error fetching solo registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // ✅ MOVE EXPORT FUNCTION HERE (TOP LEVEL)
  const handleExportSolo = async () => {
    try {
      const token = localStorage.getItem("adminAccessToken");

      const response = await api.get(
        "/admin/auth/export-registrations?type=solo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "solo-registrations.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting solo registrations:", error);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const userId = reg.userId?.userId?.toLowerCase() || "";
    const name = reg.userId?.name?.toLowerCase() || "";
    const event = reg.eventId?.title?.toLowerCase() || "";

    return (
      userId.includes(searchTerm.toLowerCase()) ||
      name.includes(searchTerm.toLowerCase()) ||
      event.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <div className="p-6">Loading...</div>;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Solo Event Registrations
            </h1>

            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Solo Event Registrations
                </h1>

                <input
                    type="text"
                    placeholder="Search by User ID, Name or Event"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black border px-3 py-2 rounded w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleExportSolo}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    📥 Export Solo Excel
                </button>



            </div>
            <p className="text-gray-500 text-sm mb-2">
                Showing {filteredRegistrations.length} of {registrations.length} registrations
            </p>



            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr >
                            <th className="px-4 py-3">User ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Event</th>
                            <th className="px-4 py-3">Fee</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Registered At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg._id} className="border-t bg-white text-black">
                                <td className="px-4 py-2">
                                    {reg.userId?.userId}
                                </td>

                                <td className="px-4 py-2">
                                    {reg.userId?.name}
                                </td>

                                <td className="px-4 py-2">
                                    {reg.eventId?.title}
                                </td>

                                <td className="px-4 py-2">
                                    ₹{reg.eventId?.fee}
                                </td>

                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${reg.paymentStatus === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {reg.paymentStatus}
                                    </span>
                                </td>

                                <td className="px-4 py-2">
                                    {new Date(reg.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SoloRegistrations;
