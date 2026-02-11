// hooks/useEvents.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

// Query Keys
export const eventKeys = {
  all: ["events"],
  lists: () => [...eventKeys.all, "list"],
  list: (filters) => [...eventKeys.lists(), { filters }],
  details: () => [...eventKeys.all, "detail"],
  detail: (id) => [...eventKeys.details(), id],
  categories: ["categories"],
  subCategories: (categoryId) => ["subCategories", categoryId],
};

// Fetch functions
const fetchEvents = async () => {
  const { data } = await api.get("/events");
  return data.data || [];
};

const fetchEvent = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data.data;
};

const fetchCategories = async () => {
  const { data } = await api.get("/category/get");
  return data.data || [];
};

const fetchSubCategories = async (categoryId) => {
  if (!categoryId) return [];
  const { data } = await api.get(`/subCategory/get-by-categ/${categoryId}`);
  return data.data || [];
};

// Custom Hooks
export const useEvents = (options = {}) => {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 60, // 1 hour - events rarely change
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    ...options,
  });
};

export const useEvent = (id, options = {}) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};

export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: eventKeys.categories,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - categories rarely change
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};

export const useSubCategories = (categoryId, options = {}) => {
  return useQuery({
    queryKey: eventKeys.subCategories(categoryId),
    queryFn: () => fetchSubCategories(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};

// Prefetch function for routes
export const prefetchEvents = async (queryClient) => {
  await queryClient.prefetchQuery({
    queryKey: eventKeys.lists(),
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 60,
  });
};

// Helper to invalidate events (call after creating/updating an event)
export const invalidateEvents = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
};

// Helper to set initial data from server-side rendering
export const setInitialEventsData = (queryClient, events) => {
  queryClient.setQueryData(eventKeys.lists(), events);
};