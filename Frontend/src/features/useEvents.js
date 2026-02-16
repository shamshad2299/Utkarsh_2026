import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

const fetchEvents = async () => {
  const { data } = await api.get("/events");
  return data;
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 10, // 10 min
    cacheTime: 1000 * 60 * 30,
  });
};

export const useEvent = (id) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

