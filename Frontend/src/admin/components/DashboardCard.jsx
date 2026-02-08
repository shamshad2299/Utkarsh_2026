import axios from "axios";
const DashboardCard = ({ title, value }) => {

const handleExportAll = async () => {
  try {
    const token = localStorage.getItem("adminAccessToken");

    const response = await axios.get(
      "http://localhost:7000/api/admin/auth/export-registrations?type=all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Required for file download
      }
    );

    // Create downloadable file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "all-registrations.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();
  } catch (error) {
    console.error("Error exporting all registrations:", error);
  }
};

  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl text-gray-500 font-bold mt-2">{value}</p>
      <button
        onClick={handleExportAll}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        📥 Export All Registrations
      </button>

    </div>
  );
};

export default DashboardCard;
