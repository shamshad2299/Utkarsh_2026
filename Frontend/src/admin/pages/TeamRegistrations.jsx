import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";

const TeamRegistrations = () => {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const handleExportTeam = async () => {
        try {
            const token = localStorage.getItem("adminAccessToken");

            const response = await api.get(
                "/admin/auth/export-registrations?type=team",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob", // IMPORTANT for Excel
                }
            );

            // Create downloadable link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "team-registrations.xlsx");

            document.body.appendChild(link);
            link.click();

            link.remove();
        } catch (error) {
            console.error("Error exporting team registrations:", error);
        }
    };



    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const token = localStorage.getItem("adminAccessToken");

                const res = await api.get(
                    "/admin/auth/registrations?type=team",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRegistrations(res.data.data);
            } catch (error) {
                //consol.error("Error fetching team registrations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);
    const filteredRegistrations = registrations.filter((reg) => {
        const teamName = reg.teamId?.teamName?.toLowerCase() || "";
        const leaderId = reg.teamId?.teamLeader?.userId?.toLowerCase() || "";
        const leaderName = reg.teamId?.teamLeader?.name?.toLowerCase() || "";
        const eventTitle = reg.eventId?.title?.toLowerCase() || "";

        const memberNames =
            reg.teamId?.teamMembers
                ?.map((member) => member.name.toLowerCase())
                .join(" ") || "";

        const search = searchTerm.toLowerCase();

        return (
            teamName.includes(search) ||
            leaderId.includes(search) ||
            leaderName.includes(search) ||
            eventTitle.includes(search) ||
            memberNames.includes(search)
        );
    });

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Team Event Registrations
                </h1>

                <input
                    type="text"
                    placeholder="Search by Team, Leader, Member or Event"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" bg-black border px-3 py-2 rounded w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleExportTeam}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    📥 Export Team Excel
                </button>

            </div>

            <p className="text-gray-500 text-sm mb-3">
                Showing {filteredRegistrations.length} of {registrations.length} registrations
            </p>


            <div className="overflow-x-auto bg-black shadow rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Team Name</th>
                            <th className="px-4 py-3">Leader ID</th>
                            <th className="px-4 py-3">Leader Name</th>
                            <th className="px-4 py-3">Event</th>
                            <th className="px-4 py-3">Members</th>
                            <th className="px-4 py-3">Registered At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg._id} className="border-t">
                                <td className="px-4 py-2">
                                    {reg.teamId?.teamName}
                                </td>

                                <td className="px-4 py-2">
                                    {reg.teamId?.teamLeader?.userId}
                                </td>

                                <td className="px-4 py-2">
                                    {reg.teamId?.teamLeader?.name}
                                </td>

                                <td className="px-4 py-2">
                                    {reg.eventId?.title}
                                </td>

                                <td className="px-4 py-2">
                                    {reg.teamId?.teamMembers
                                        ?.map((member) => member.name)
                                        .join(", ")}
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

export default TeamRegistrations;
