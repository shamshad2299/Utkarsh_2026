import api from "../../api/axios";

export const websiteTeamService = {
  getAll: async () => {
    const res = await api.get("/website-team");
    return res.data.data;
  },

  add: async (formData) => {
    const res = await api.post("/website-team", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  toggle: async (id) => {
    const res = await api.patch(`/website-team/${id}/toggle`);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/website-team/${id}`);
    return res.data;
  },
};
