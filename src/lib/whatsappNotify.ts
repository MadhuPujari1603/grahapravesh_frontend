const BUSINESS_PHONE = "918762625888";

interface OrderNotifyData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  items: { name: string; quantity: number }[];
  address?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_MESSAGES: Record<string, string> = {
  pending: "has been placed and is being reviewed",
  processing: "is now being processed and prepared",
  shipped: "has been shipped and is on its way to you",
  delivered: "has been delivered successfully",
  cancelled: "has been cancelled",
};

const PAYMENT_MESSAGES: Record<string, string> = {
  paid: "Payment has been confirmed",
  pending: "Payment is pending",
  refunded: "Payment has been refunded",
  failed: "Payment has failed",
};

export function getOrderConfirmationMessage(data: OrderNotifyData): string {
  const itemsList = data.items
    .map((item) => `  • ${item.name} (x${item.quantity})`)
    .join("\n");

  return `🏠 *GRAHA PRAVESH*
_Where Every Dream Home Begins_

✅ *Order Confirmed!*

Hi *${data.customerName}*,

Thank you for your order! Here are your order details:

📋 *Order ID:* #${data.orderId}
💰 *Total:* ${formatAmount(data.totalAmount)}

📦 *Items:*
${itemsList}

${data.address ? `📍 *Delivery Address:*\n${data.address.addressLine1 || ""}, ${data.address.city || ""}, ${data.address.state || ""} - ${data.address.pincode || ""}` : ""}

We'll keep you updated on your order status.

Thank you for choosing Graha Pravesh! 🙏`;
}

export function getStatusUpdateMessage(data: OrderNotifyData): string {
  const statusMsg = STATUS_MESSAGES[data.status] || "has been updated";
  const emoji =
    data.status === "delivered"
      ? "🎉"
      : data.status === "shipped"
      ? "🚚"
      : data.status === "processing"
      ? "⚙️"
      : data.status === "cancelled"
      ? "❌"
      : "📋";

  return `🏠 *GRAHA PRAVESH*
_Where Every Dream Home Begins_

${emoji} *Order Status Update*

Hi *${data.customerName}*,

Your order *#${data.orderId}* ${statusMsg}.

💰 *Total:* ${formatAmount(data.totalAmount)}
📦 *Status:* ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}

${data.status === "shipped" ? "📍 Your order is on its way! You'll receive it soon.\n" : ""}${data.status === "delivered" ? "We hope you love your purchase! 💚\n" : ""}
Thank you for choosing Graha Pravesh! 🙏`;
}

export function getPaymentUpdateMessage(
  data: OrderNotifyData,
  paymentStatus: string
): string {
  const paymentMsg = PAYMENT_MESSAGES[paymentStatus] || "has been updated";

  return `🏠 *GRAHA PRAVESH*
_Where Every Dream Home Begins_

💳 *Payment Update*

Hi *${data.customerName}*,

${paymentMsg} for your order *#${data.orderId}*.

💰 *Amount:* ${formatAmount(data.totalAmount)}
📋 *Payment Status:* ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}

Thank you for choosing Graha Pravesh! 🙏`;
}

export function sendWhatsAppNotification(
  customerPhone: string,
  message: string
): void {
  // Clean phone number — remove spaces, dashes, + prefix
  let phone = customerPhone.replace(/[\s\-\+]/g, "");
  // Add country code if not present
  if (phone.length === 10) {
    phone = "91" + phone;
  }

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, "_blank");
}

export function sendFromBusinessNumber(message: string): void {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${BUSINESS_PHONE}?text=${encoded}`;
  window.open(url, "_blank");
}
