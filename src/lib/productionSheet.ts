import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ProductionItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  customization?: Record<string, string>;
}

interface ProductionSheetData {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  address: {
    fullName?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: ProductionItem[];
  createdAt: string;
}

export async function downloadProductionSheet(
  data: ProductionSheetData
): Promise<void> {
  // Create a temporary container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  document.body.appendChild(container);

  const formattedDate = new Date(data.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Build HTML for each item card
  const itemCards = data.items
    .map(
      (item, idx) => `
    <div style="page-break-inside: avoid; border: 2px solid #0a3d2e; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <!-- Card Header -->
      <div style="background: linear-gradient(135deg, #0a3d2e, #0e5540); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="color: #c9a84c; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Production Order</div>
          <div style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 2px;">#${data.orderId}</div>
        </div>
        <div style="text-align: right;">
          <div style="color: #c9a84c; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Item ${idx + 1} of ${data.items.length}</div>
          <div style="color: #ffffff; font-size: 14px; font-weight: 600; margin-top: 2px;">${formattedDate}</div>
        </div>
      </div>

      <!-- Card Body -->
      <div style="padding: 20px; display: flex; gap: 20px;">
        <!-- Product Image -->
        <div style="width: 300px; height: 300px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; flex-shrink: 0; background: #ffffff; padding: 8px;">
          <img src="${item.image || "/images/placeholder-product.svg"}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain;" crossorigin="anonymous" />
        </div>

        <!-- Product Details -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <!-- Product Name -->
          <div>
            <div style="font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Product Name</div>
            <div style="font-size: 22px; font-weight: 700; color: #1c1917; margin-top: 4px; line-height: 1.3;">${item.name}</div>
          </div>

          ${item.customization && Object.keys(item.customization).length > 0 ? `
          <!-- Personalization Box -->
          <div style="background: #fffbeb; border: 2px solid #c9a84c; border-radius: 8px; padding: 14px; margin-top: 12px;">
            <div style="font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 8px;">✏️ Personalization Details</div>
            ${Object.entries(item.customization).map(([key, val]) => `
              <div style="display: flex; gap: 8px; margin-bottom: 4px; font-size: 14px;">
                <span style="color: #78716c; min-width: 120px; text-transform: capitalize;">${key.replace(/_/g, ' ')}</span>
                <span style="color: #c9a84c; font-weight: 400;">→</span>
                <span style="font-size: 16px; font-weight: 700; color: #1c1917;">${val}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Quantity Badge -->
          <div style="margin: 16px 0;">
            <div style="font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 6px;">Quantity</div>
            <div style="display: inline-block; background: #0a3d2e; color: #ffffff; font-size: 28px; font-weight: 800; padding: 8px 24px; border-radius: 8px;">
              x${item.quantity}
            </div>
          </div>

          <!-- Customer Info Box -->
          <div style="background: #f5f0e8; border-radius: 8px; padding: 14px;">
            <div style="font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 8px;">Customer Details</div>
            <div style="font-size: 15px; font-weight: 600; color: #1c1917;">${data.customerName}</div>
            ${data.customerPhone ? `<div style="font-size: 13px; color: #57534e; margin-top: 2px;">Phone: ${data.customerPhone}</div>` : ""}
            <div style="font-size: 13px; color: #57534e; margin-top: 2px;">
              ${data.address.addressLine1 || ""}${data.address.city ? `, ${data.address.city}` : ""}${data.address.state ? `, ${data.address.state}` : ""} ${data.address.pincode || ""}
            </div>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div style="background: #f5f0e8; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 12px; color: #57534e;">
          <strong style="color: #0a3d2e;">GRAHA PRAVESH</strong> &nbsp;|&nbsp; Production Reference
        </div>
        <div style="font-size: 12px; color: #57534e;">
          Print Date: ${new Date().toLocaleDateString("en-IN")}
        </div>
      </div>
    </div>
  `
    )
    .join("");

  container.innerHTML = `
    <div style="padding: 24px; font-family: 'Segoe UI', Arial, sans-serif;">
      ${itemCards}
    </div>
  `;

  // Wait for images to load
  const images = container.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

  try {
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Production-${data.orderId}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
