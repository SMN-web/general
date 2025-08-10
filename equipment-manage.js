export function initEquipmentManage() {
  const container = document.getElementById("manage-table-container");
  if (!container) return;

  container.textContent = "Loading...";

  fetch("https://ancient-block-0551.nafil-8895-s.workers.dev/get-equipment")
    .then(r => r.json())
    .then(data => data.success ? renderManageTable(data.equipments, container) :
        container.textContent = "Error: " + (data.error || "Unknown"))
    .catch(err => container.textContent = "Error: " + err.message);
}

function renderManageTable(data, container) {
  const columns = [
    "plantNo","regNo","description","owner","location",
    "engineer","rigCHName","rigCHNo","status"
  ];
  let allData = data, filteredData = [...allData], activeFilters = {};

  container.innerHTML = "";
  const downloadBtn = document.getElementById("download-btn");
  const downloadMenu = document.getElementById("download-menu");

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  const thead = document.createElement("thead");

  const headerRow = document.createElement("tr");
  ["S.No", ...columns].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    th.style.border = "1px solid #000";
    th.style.padding = "4px";
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const filterRow = document.createElement("tr");
  filterRow.appendChild(document.createElement("th"));
  columns.forEach(col => {
    const th = document.createElement("th");
    const input = document.createElement("input");
    input.type = "text";
    input.style.width = "95%";
    input.placeholder = "Filter...";
    input.addEventListener("input", () => {
      activeFilters[col] = input.value.trim();
      applyFilters();
    });
    th.appendChild(input);
    filterRow.appendChild(th);
  });
  thead.appendChild(filterRow);

  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  container.appendChild(table);

  function applyFilters(){
    filteredData = allData.filter(row =>
      Object.entries(activeFilters).every(([col, val]) =>
        !val || (row[col]||"").toLowerCase().includes(val.toLowerCase())
      )
    );
    renderRows();
  }

  function renderRows(){
    tbody.innerHTML = "";
    filteredData.forEach((row, idx) => {
      const tr = document.createElement("tr");
      const tdS = document.createElement("td");
      tdS.textContent = idx+1;
      tdS.style.border="1px solid #000";tdS.style.padding="4px";
      tr.appendChild(tdS);
      columns.forEach(col=>{
        const td = document.createElement("td");
        td.textContent = row[col]||"";
        td.style.border="1px solid #000";td.style.padding="4px";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  /* ---------- EXPORTS ---------- */
  function exportCSV(){
    let csv = "S.No,"+columns.join(",")+"\n";
    filteredData.forEach((row,i)=>{
      const rowData = [`\t${i+1}`];
      columns.forEach(col=>{
        let cell = row[col]||"";
        if(cell.includes(",")||cell.includes("\"")){
          cell = `"${cell.replace(/\"/g,'""')}"`;
        }
        rowData.push(cell);
      });
      csv += rowData.join(",")+"\n";
    });
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url;a.download=`Equipment_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(url); closeMenu();
  }

  function exportPDF(){
    const html = `
      <html><head><title>Equipment PDF</title>
      <style>table{border-collapse:collapse;width:100%}
      th,td{border:1px solid #000;padding:4px;font-size:12px}</style>
      </head><body>
      <h3>Filtered Equipment List</h3>
      <table>
      <tr><th>S.No</th>${columns.map(c=>`<th>${c}</th>`).join("")}</tr>
      ${filteredData.map((r,i)=>`<tr><td>${i+1}</td>`+
      columns.map(c=>`<td>${r[c]||""}</td>`).join("")+`</tr>`).join("")}
      </table></body></html>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if(!win){ alert("Popup blocked. Allow popups to export PDF."); return; }
    win.onload = ()=>{ win.focus(); win.print(); };
    closeMenu();
  }

  function exportJPEG(){
    try {
      const serializer = new XMLSerializer();
      const tableHtml = serializer.serializeToString(table);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${table.offsetWidth}" height="${table.offsetHeight}">
        <foreignObject width="100%" height="100%">${tableHtml}</foreignObject></svg>`;
      const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = ()=>{
        const canvas=document.createElement("canvas");
        canvas.width=img.width;canvas.height=img.height;
        const ctx=canvas.getContext("2d");
        ctx.fillStyle="white";ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
        canvas.toBlob(blob=>{
          if(!blob){ fallbackPDF(); return; }
          const a = document.createElement("a");
          a.download=`Equipment_${new Date().toISOString().slice(0,10)}.jpg`;
          a.href=URL.createObjectURL(blob);
          document.body.appendChild(a);a.click();document.body.removeChild(a);
          URL.revokeObjectURL(url); URL.revokeObjectURL(a.href);
        },"image/jpeg",0.95);
      };
      img.onerror = fallbackPDF;
      img.src = url;
