// Dynamic imports — html2canvas (~500KB) + jsPDF (~400KB) only load when
// the customer actually clicks "Download Invoice", never on page load.
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
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

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

    const pdf = new (jsPDF as any)("p", "mm", "a4");
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
