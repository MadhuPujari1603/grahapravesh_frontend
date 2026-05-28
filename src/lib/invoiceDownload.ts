import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadInvoice(
  element: HTMLElement,
  orderId: string
): Promise<void> {
  // Temporarily make the hidden element visible for rendering
  const parent = element.parentElement;
  if (parent) {
    parent.style.position = "fixed";
    parent.style.left = "-9999px";
    parent.style.top = "0";
    parent.style.display = "block";
    parent.classList.remove("hidden");
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add extra pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    pdf.save(`Invoice-${orderId}.pdf`);
  } finally {
    // Re-hide the element
    if (parent) {
      parent.style.position = "";
      parent.style.left = "";
      parent.style.top = "";
      parent.style.display = "";
      parent.classList.add("hidden");
    }
  }
}
