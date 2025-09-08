export const loadCartFromLocal = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  }
  return [];
};
