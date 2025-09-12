import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RobotoFont from "@/app/font/Roboto";

export const exportInvoicePDF = (order: any) => {
  const doc = new jsPDF();

  // Thêm font Unicode
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoFont);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  doc.text(`Hóa đơn: ${order.order_number}`, 14, 20);
  doc.text(`Khách hàng: ${order.order_recipient_name}`, 14, 30);
  doc.text(`SĐT: ${order.recipient_phone}`, 14, 40);
  doc.text(`Địa chỉ: ${order.shipping_address}`, 14, 50);

  autoTable(doc, {
    startY: 60,
    head: [["Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"]],
    body: order.order_items.map((i: any) => [
      i.product.name,
      i.quantity,
      i.price.toLocaleString(),
      (i.price * i.quantity).toLocaleString(),
    ]),
  });

  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.text(`Tổng cộng: ${order.total_all.toLocaleString()}đ`, 14, finalY + 20);

  doc.save(`invoice-${order.order_number}.pdf`);
};
