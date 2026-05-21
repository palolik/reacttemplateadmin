import jsPDF from "jspdf";


// ── Convert image URL/path to base64 via canvas ──────────
const toBase64 = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null); // gracefully skip if load fails
    img.src = src;
  });

// ── Generate QR code as base64 PNG ───────────────────────
const generateQR = (text) =>
  QRCode.toDataURL(text, {
    width: 120,
    margin: 1,
    color: { dark: "#111827", light: "#ffffff" },
  });

export const downloadInvoice = async (order) => {
  const doc      = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW    = 210;
  const pageH    = 297;
  const ml       = 14;
  const mr       = 14;
  const contentW = pageW - ml - mr;
  let   y        = 0;

  // ── helpers (no hex conversion — set RGB directly) ───────
  const bold     = (sz) => { doc.setFont("helvetica","bold");   doc.setFontSize(sz); };
  const normal   = (sz) => { doc.setFont("helvetica","normal"); doc.setFontSize(sz); };
  const right    = (text, x, cy) => doc.text(String(text), x, cy, { align:"right" });
  const stripHtml= (html) => (html||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
  const checkPage= (needed=10) => { if (y+needed > pageH-20) { doc.addPage(); y=14; } };

  // ── colour shortcuts (light palette, no darks) ───────────
  //  text
  const cBlack  = () => doc.setTextColor(30, 30, 30);       // near-black body text
  const cMid    = () => doc.setTextColor(90, 90, 90);        // secondary text
  const cLight  = () => doc.setTextColor(160, 160, 160);     // labels / captions
  const cGreen  = () => doc.setTextColor(13, 148, 136);      // discount / accent
  //  fill
  const fWhite  = () => doc.setFillColor(255, 255, 255);
  const fGray1  = () => doc.setFillColor(248, 249, 250);     // lightest bg
  const fGray2  = () => doc.setFillColor(241, 243, 245);     // table header
  const fStripe = () => doc.setFillColor(252, 253, 253);     // row stripe
  const fYellow = () => doc.setFillColor(255, 251, 235);     // payment block
  //  draw
  const dGray   = () => doc.setDrawColor(220, 223, 228);     // dividers / borders
  const dYellow = () => doc.setDrawColor(253, 230, 138);     // payment border
  const dAccent = () => doc.setDrawColor(20, 184, 166);      // header accent line

  // ── Load logo & QR in parallel ───────────────────────────
  const invoiceNo = `INV-${order._id.slice(-8).toUpperCase()}`;
  const orderUrl  = `${window.location.origin}/order/${order._id}`;

  const [logoB64] = await Promise.all([
    toBase64("/assets/logo.png"),

  ]);

  // ── HEADER — white background, logo left, company right ──
  fWhite(); doc.rect(0, 0, pageW, 32, "F");

  // teal accent bar at very top
  dAccent(); doc.setFillColor(20, 184, 166);
  doc.rect(0, 0, pageW, 2, "F");

  // Logo (white bg already behind it)
  if (logoB64) {
    doc.addImage(logoB64, "PNG", ml, 4, 58, 20);
  } else {
    bold(13); cBlack();
    doc.text("Pripack", ml, 17);
  }




  bold(10); cBlack();
    right("INVOICE", pageW - mr, 14);
  normal(8); cLight();
  right(invoiceNo, pageW - mr, 20);
  normal(8); cMid();
  right("www.pripacklab.com", pageW - mr, 17);
  right("support@pripacklab.com", pageW - mr, 23);

  // bottom border of header
  dGray(); doc.setLineWidth(0.4);
  doc.line(0, 32, pageW, 32);

  y = 40;

  // ── BILL TO + META ────────────────────────────────────────
  const orderDate = new Date(order.orderDate).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  normal(7); cLight();
  doc.text("BILL TO", ml, y); y += 4;
  bold(10); cBlack();
  doc.text(order.buyerName || "", ml, y); y += 4;
  normal(8); cMid();
  doc.text(order.buyerPhone || "", ml, y); y += 4;
  if (order.buyerEmail) { doc.text(order.buyerEmail, ml, y); y += 4; }
  const addrLines = doc.splitTextToSize(order.buyerAddress || "", 80);
  addrLines.forEach(line => { doc.text(line, ml, y); y += 3.5; });

  const metaX = pageW - mr;
  let metaY = 40;
  const metaRow = (label, value) => {
    normal(7); cLight();  right(label, metaX, metaY); metaY += 3.5;
    bold(8);   cBlack();  right(value, metaX, metaY); metaY += 5.5;
  };
  metaRow("DATE",    orderDate);
  metaRow("STATUS",  order.currentStatus || "");
  metaRow("PAYMENT", order.paymentMethod || "");

  y = Math.max(y, metaY) + 4;

  dGray(); doc.setLineWidth(0.3);
  doc.line(ml, y, pageW - mr, y); y += 5;

  // ── DELIVERY ─────────────────────────────────────────────
  if (order.delivery) {
    fGray1(); doc.roundedRect(ml, y, contentW, 10, 2, 2, "F");
    normal(7); cLight();
    doc.text("AREA", ml+3, y+4); doc.text("PERIOD", ml+55, y+4); doc.text("CHARGE", ml+110, y+4);
    bold(8); cBlack();
    doc.text(order.delivery.area||"",            ml+3,   y+8);
    doc.text(order.delivery.period||"",          ml+55,  y+8);
    doc.text(`Tk. ${order.delivery.charge}`,     ml+110, y+8);
    y += 15;
  }

  // ── ITEMS TABLE ───────────────────────────────────────────
  fGray2(); doc.rect(ml, y, contentW, 7, "F");
  normal(7); cLight();
  const col = { name: ml+2, size: ml+82, qty: ml+112, units: ml+127, price: ml+148, total: pageW-mr };
  doc.text("PRODUCT", col.name, y+4.5);
  doc.text("SIZE/CUT", col.size, y+4.5);
  doc.text("QTY",   col.qty,   y+4.5, { align:"center" });
  doc.text("UNITS", col.units, y+4.5, { align:"center" });
  doc.text("PRICE", col.price, y+4.5, { align:"right"  });
  doc.text("TOTAL", col.total, y+4.5, { align:"right"  });
  y += 9;

  order.cartItems.forEach((item, idx) => {
    const units    = parseInt(item.units) || 1;
    const price    = parseFloat(item.selectedPrice) || 0;
    const rowTotal = price * units;
    const nameLines = doc.splitTextToSize(item.productName || "", 75);
    const descLines = [];
    (item.unitDetails || []).forEach((ud, ui) => {
      const plain = stripHtml(ud.description);
      if (plain) descLines.push(...doc.splitTextToSize(`Unit ${ui+1}: ${plain}`, 75));
    });
    const rowH = Math.max(10, (nameLines.length + descLines.length) * 4 + 5);
    checkPage(rowH + 4);

    if (idx % 2 === 0) { fStripe(); doc.rect(ml, y, contentW, rowH, "F"); }

    bold(8); cBlack();
    nameLines.forEach((line, li) => doc.text(line, col.name, y + 5 + li * 4));

    let descY = y + 5 + nameLines.length * 4;
    normal(7); cLight();
    descLines.forEach(line => { doc.text(line, col.name, descY); descY += 3.5; });

    normal(7.5); cMid();
    let scY = y + 5;
    if (item.selectedSize) { doc.text(item.selectedSize, col.size, scY); scY += 4; }
    if (item.selectedCut)  { doc.text(item.selectedCut,  col.size, scY); }

    normal(8); cMid();
    doc.text(String(item.selectedQty || "—"), col.qty,   y+5, { align:"center" });
    doc.text(String(units),                   col.units, y+5, { align:"center" });
    doc.text(`Tk. ${price.toFixed(2)}`,       col.price, y+5, { align:"right"  });
    bold(8); cBlack();
    doc.text(`Tk. ${rowTotal.toFixed(2)}`,    col.total, y+5, { align:"right"  });

    dGray(); doc.setLineWidth(0.2);
    doc.line(ml, y+rowH, pageW-mr, y+rowH);
    y += rowH;
  });

  y += 6;
  checkPage(30);

  // ── TOTALS ────────────────────────────────────────────────
  const totX = pageW - mr;
  const labX = pageW - mr - 60;
  const totRow = (label, value, isBold, colorFn = cMid) => {
    if (isBold) bold(9); else normal(8);
    colorFn();
    doc.text(label, labX, y);
    right(value, totX, y);
    y += 5;
  };
  totRow("Subtotal",        `Tk. ${(order.subtotal||0).toFixed(2)}`);
  totRow("Delivery Charge", `Tk. ${(order.deliveryCharge||0).toFixed(2)}`);
  if (order.discount > 0) {
    totRow(
      `Discount${order.coupon ? ` (${order.coupon})` : ""}`,
      `- Tk. ${parseFloat(order.discount).toFixed(2)}`,
      false, cGreen
    );
  }
  dGray(); doc.setLineWidth(0.3);
  doc.line(labX, y, totX, y); y += 4;
  totRow("Total", `Tk. ${parseFloat(order.totalPrice).toFixed(2)}`, true, cBlack);

  y += 5;
  checkPage(20);

  // ── PAYMENT DETAILS (online) ──────────────────────────────
  if (order.transactionId) {
    fYellow(); doc.roundedRect(ml, y, contentW, 18, 2, 2, "F");
    dYellow(); doc.setLineWidth(0.3);
    doc.roundedRect(ml, y, contentW, 18, 2, 2, "S");
    normal(7); cLight();
    doc.text("VIA", ml+3, y+5); doc.text("REF CODE", ml+50, y+5);
    doc.text("TRXID", ml+100, y+5); doc.text("STATUS", ml+148, y+5);
    bold(8); cBlack();
    doc.text(order.paymentMethod||"", ml+3,   y+11);
    doc.text(order.referenceCode||"", ml+50,  y+11);
    doc.text(order.transactionId||"", ml+100, y+11);
    doc.text(order.paymentStatus||"", ml+148, y+11);
    y += 24;
  }

  y += 4;
  checkPage(50);



  // ── FOOTER ────────────────────────────────────────────────
  // footer pinned to bottom of every page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const fy = pageH - 10;
    dGray(); doc.setLineWidth(0.2);
    doc.line(ml, fy - 5, pageW - mr, fy - 5);
    normal(7); cLight();
    doc.text("Thank you for your order! For queries contact us at support@pripacklab.com", pageW / 2, fy - 1, { align: "center" });
    doc.text("This is a computer-generated invoice and does not require a physical signature.", pageW / 2, fy + 3, { align: "center" });
  }

  // ── SAVE ──────────────────────────────────────────────────
  doc.save(`${invoiceNo}.pdf`);
};