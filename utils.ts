export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export const formatDateVN = (dateString: string) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const isStates = (status: string) => {
  let str = "";
  switch (status) {
    case "padding":
      str = "Đang xử lý";
      break;
    case "in_transit":
      str = "Đang giao hàng";
      break;
    case "completed":
      str = "Hoàn tất";
      break;
    case "cancelled":
      str = "Đã hủy";
      break;
    default:
      str = "Không xác định";
  }
  return str;
};
