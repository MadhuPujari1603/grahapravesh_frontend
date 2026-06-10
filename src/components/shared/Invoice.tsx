import React, { forwardRef } from "react";
import { formatPrice, formatDate } from "@/lib/utils";

interface InvoiceProps {
  order: any;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ order }, ref) => {
  const customer =
    typeof order.userId === "object" ? order.userId : null;

  // Use values stored on the order at creation time.
  // Fall back to recalculating for older orders that predate the deliveryCharge field.
  const subtotal: number =
    order.itemsSubtotal ??
    order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping: number =
    order.deliveryCharge ?? (order.totalAmount - subtotal);
  const grandTotal: number = order.totalAmount;

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px",
        color: "#1c1917",
        backgroundColor: "#ffffff",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #0a3d2e",
          paddingBottom: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src="/images/SAMPAGANGA.jpg"
            alt="Graha Pravesh"
            style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px" }}
          />
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#0a3d2e",
                margin: "0",
                letterSpacing: "2px",
              }}
            >
              GRAHA PRAVESH
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#c9a84c",
                margin: "2px 0 0 0",
                fontStyle: "italic",
                letterSpacing: "1px",
              }}
            >
              Where Every Dream Home Begins
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#0a3d2e",
              margin: "0",
              textTransform: "uppercase",
            }}
          >
            Invoice
          </h2>
          <p style={{ fontSize: "11px", color: "#6b7280", margin: "4px 0 0 0" }}>
            Graha Pravesh Home Decor
            <br />
            India
          </p>
        </div>
      </div>

      {/* Invoice Details Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#f8f7f4",
          padding: "16px 20px",
          borderRadius: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", color: "#6b7280", margin: "0", textTransform: "uppercase", fontWeight: "600" }}>
            Invoice No.
          </p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#0a3d2e", margin: "2px 0 0 0" }}>
            GP-{order.orderId}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "11px", color: "#6b7280", margin: "0", textTransform: "uppercase", fontWeight: "600" }}>
            Invoice Date
          </p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#1c1917", margin: "2px 0 0 0" }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "11px", color: "#6b7280", margin: "0", textTransform: "uppercase", fontWeight: "600" }}>
            Payment Method
          </p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#1c1917", margin: "2px 0 0 0", textTransform: "capitalize" }}>
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "11px", color: "#6b7280", margin: "0", textTransform: "uppercase", fontWeight: "600" }}>
            Payment Status
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: order.paymentStatus === "paid" ? "#0a3d2e" : "#c9a84c",
              margin: "2px 0 0 0",
              textTransform: "capitalize",
            }}
          >
            {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1", minWidth: "200px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#0a3d2e",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 8px 0",
              borderBottom: "2px solid #c9a84c",
              paddingBottom: "6px",
              display: "inline-block",
            }}
          >
            Bill To
          </h3>
          <div style={{ fontSize: "13px", color: "#1c1917" }}>
            <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>
              {customer?.name || order.address?.fullName || "N/A"}
            </p>
            {customer?.phone && (
              <p style={{ margin: "0 0 2px 0", color: "#4b5563" }}>Phone: {customer.phone}</p>
            )}
            {customer?.email && (
              <p style={{ margin: "0 0 2px 0", color: "#4b5563" }}>{customer.email}</p>
            )}
          </div>
        </div>
        <div style={{ flex: "1", minWidth: "200px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#0a3d2e",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "0 0 8px 0",
              borderBottom: "2px solid #c9a84c",
              paddingBottom: "6px",
              display: "inline-block",
            }}
          >
            Ship To
          </h3>
          <div style={{ fontSize: "13px", color: "#1c1917" }}>
            <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>
              {order.address?.fullName}
            </p>
            <p style={{ margin: "0 0 2px 0", color: "#4b5563" }}>
              {order.address?.addressLine1}
            </p>
            {order.address?.addressLine2 && (
              <p style={{ margin: "0 0 2px 0", color: "#4b5563" }}>
                {order.address.addressLine2}
              </p>
            )}
            <p style={{ margin: "0 0 2px 0", color: "#4b5563" }}>
              {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </p>
            <p style={{ margin: "0 0 2px 0", color: "#4b5563" }}>
              Phone: {order.address?.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "24px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#0a3d2e",
              color: "#ffffff",
            }}
          >
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              S.No
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Product
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Qty
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "right",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Unit Price (&#8377;)
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "right",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total (&#8377;)
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any, idx: number) => (
            <tr
              key={idx}
              style={{
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafaf8",
              }}
            >
              <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                {idx + 1}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {item.name}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "13px",
                }}
              >
                {formatPrice(item.price)}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {formatPrice(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "32px",
        }}
      >
        <div style={{ width: "280px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              fontSize: "13px",
              color: "#4b5563",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <span>Shipping</span>
            <span style={{ color: shipping === 0 ? "#0a3d2e" : "#1c1917" }}>
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#0a3d2e",
            }}
          >
            <span>Grand Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "2px solid #0a3d2e",
          paddingTop: "20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#0a3d2e",
            margin: "0 0 8px 0",
          }}
        >
          Thank you for shopping with Graha Pravesh!
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
          If you have any questions about your order, please contact our support team.
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
          Return Policy: Items can be returned within 7 days of delivery in original condition.
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            margin: "16px 0 0 0",
            fontStyle: "italic",
          }}
        >
          This is a computer-generated invoice and does not require a signature.
        </p>
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";

export default Invoice;
