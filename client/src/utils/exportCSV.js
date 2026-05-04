import { format } from "date-fns";

export function exportToCSV(transactions, filename = "transactions") {
  const headers = ["Date,Title,Type,Category,Amount,Note"];
  const rows = transactions.map(t =>
    `${format(new Date(t.date), "dd/MM/yyyy")},${t.title},${t.type},${t.category},${t.amount},"${t.note || ""}"`
  );
  const blob = new Blob([[...headers, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(transactions) {
  const rows = transactions.map(t =>
    `<tr style="border-bottom:1px solid #eee">
      <td>${format(new Date(t.date), "dd MMM yyyy")}</td>
      <td>${t.title}</td>
      <td style="color:${t.type==='income'?'#22c55e':'#ef4444'}">${t.type}</td>
      <td>${t.category}</td>
      <td>₹${t.amount.toLocaleString()}</td>
    </tr>`
  ).join("");

  const html = `
    <html><head><title>Transactions</title>
    <style>body{font-family:sans-serif;padding:20px} table{width:100%;border-collapse:collapse}
    th{background:#f1f5f9;padding:8px;text-align:left} td{padding:8px}</style></head>
    <body>
      <h2>Transaction Report — ${format(new Date(), "MMMM yyyy")}</h2>
      <table><thead><tr><th>Date</th><th>Title</th><th>Type</th><th>Category</th><th>Amount</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </body></html>`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}