// hooks/useEventFilters.js
import { useMemo } from 'react';

export const useEventFilters = (events, selectedCategoryFilter, selectedTypeFilter, searchQuery) => {
  return useMemo(() => {
    let filtered = [...events];

    // Apply category filter
    if (selectedCategoryFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventCategoryId = event.category?._id;
        const eventCategoryName = event.category?.name?.toLowerCase() || "";
        return (
          eventCategoryId === selectedCategoryFilter ||
          eventCategoryName.includes(selectedCategoryFilter.toLowerCase())
        );
      });
    }

    // Apply event type filter
    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter((event) => {
        const eventType = getEventTypeText(event.teamSize, event.eventType).toLowerCase();
        return eventType === selectedTypeFilter.toLowerCase();
      });
    }

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        const title = event.title?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        const categoryName = event.category?.name?.toLowerCase() || "";
        const venueName = event.venueName?.toLowerCase() || "";
        const subCategoryName = event.subCategory?.title?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          categoryName.includes(query) ||
          venueName.includes(query) ||
          subCategoryName.includes(query)
        );
      });
    }

    return filtered;
  }, [events, selectedCategoryFilter, selectedTypeFilter, searchQuery]);
};