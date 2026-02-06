export const getFilterFromURL = (location, param) => {
  const params = new URLSearchParams(location.search);
  return params.get(param) || 'all';
};

export const setFilterToURL = (navigate, location, param, value) => {
  const params = new URLSearchParams(location.search);
  
  if (value === 'all') {
    params.delete(param);
  } else {
    params.set(param, value);
  }
  
  navigate(`${location.pathname}?${params.toString()}`, { replace: true });
};