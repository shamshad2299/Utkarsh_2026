import React, { useEffect, useMemo, useState } from "react";
import { foodStallService } from "../api/axios";
import { Trash2, RefreshCcw, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FoodStallRequests = () => {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const res = await foodStallService.getAll(params);
      setItems(res?.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load food stall requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((x) => {
      return (
        x.businessName?.toLowerCase().includes(q) ||
        x.ownerName?.toLowerCase().includes(q) ||
        x.email?.toLowerCase().includes(q) ||
        x.phoneNumber?.toLowerCase().includes(q) ||
        x.foodItems?.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await foodStallService.updateStatus(id, status);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteItem = async (id) => {
    const ok = confirm("Are you sure you want to delete this request?");
    if (!ok) return;

    setDeletingId(id);
    try {
      await foodStallService.delete(id);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ EXPORT EXCEL
  const exportToExcel = () => {
    const data = filtered.map((x, i) => ({
      "S.No": i + 1,
      "Business Name": x.businessName || "",
      "Owner Name": x.ownerName || "",
      Email: x.email || "",
      "Phone Number": x.phoneNumber || "",
      "Permanent Address": x.permanentAddress || "",
      "Food Items": x.foodItems || "",
      "No. of Stalls": x.numberOfStalls || "",
      Status: x.status || "",
      "Created At": x.createdAt ? new Date(x.createdAt).toLocaleString() : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FoodStallRequests");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `FoodStallRequests_${Date.now()}.xlsx`);
  };

  return (
    <div className="p-6 text-gray-900">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Food Stall Requests
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all food stall applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-gray-900"
          >
            <Download size={18} />
            Export Excel
          </button>

          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-gray-900"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="w-full md:flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            placeholder="Search by business name, email, owner, phone, food items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full md:w-56 px-4 py-3 rounded-xl border outline-none text-gray-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Total Requests:{" "}
            <span className="text-purple-600">{filtered.length}</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-600">
            No food stall requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3">Owner</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Food Items</th>
                  <th className="text-left px-4 py-3">Stalls</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((x) => (
                  <tr key={x._id} className="border-t">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {x.businessName}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{x.ownerName}</td>
                    <td className="px-4 py-3 text-gray-900">{x.email}</td>
                    <td className="px-4 py-3 text-gray-900">{x.phoneNumber}</td>
                    <td className="px-4 py-3 text-gray-900">{x.foodItems}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {x.numberOfStalls}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={x.status}
                        disabled={updatingId === x._id}
                        onChange={(e) => updateStatus(x._id, e.target.value)}
                        className="px-3 py-2 rounded-xl border outline-none text-gray-900"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteItem(x._id)}
                        disabled={deletingId === x._id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                        {deletingId === x._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodStallRequests;
