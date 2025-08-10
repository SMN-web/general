export function initEquipmentManage() {
  const container = document.getElementById("manage-table-container");
  if (!container) {
    console.error("Manage table container not found in DOM.");
    return;
  }

  container.textContent = "Loading...";

  fetch("https://ancient-block-0551.nafil-8895-s.workers.dev/get-equipment")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        renderManageTable(data.equipments, container);
      } else {
        container.textContent = "Error: " + (data.error || "Unknown error");
      }
    })
    .catch(err => {
      container.textContent = "Error fetching data: " + err.message;
    });
}

function renderManageTable(data, container) {
  const columns = [
    "plantNo", "regNo", "description", "owner",
    "location", "engineer", "rigCHName", "rigCHNo", "status"
  ];

  let allData = data;
  let filteredData = [...allData];
  const activeFilters = {};

  // Clear table container
  container.innerHTML = "";

  // Get existing HTML dropdown elements
  const downloadBtn = document.getElementById("download-btn");
  const downloadMenu = document.getElementById("download-menu");

  // Table creation
  const table = document.createElement("table");
  table.border = "1";
  table.cellPadding = "5";
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  const thead = document.createElement("thead");

  // Header row with S.No
  const headerRow = document.createElement("tr");
  const thSerial = document.createElement("th");
  thSerial.textContent = "S.No";
  headerRow.appendChild(thSerial);
  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Filter row
  const filterRow = document.createElement("tr");
  filterRow.appendChild(document.createElement("th")); // for S.No
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

  /** Filtering logic **/
  function applyFilters() {
    filteredData = allData.filter(row =>
      Object.entries(activeFilters).every(([col, val]) =>
        !val || (row[col] || "").toString().toLowerCase().includes(val.toLowerCase())
      )
    );
    renderRows();
  }

  function renderRows() {
    tbody.innerHTML = "";
    filteredData.forEach((row, index) => {
      const tr = document.createElement("tr");

      // Serial number
      const tdSerial = document.createElement("td");
      tdSerial.textContent = index + 1;
      tr.appendChild(tdSerial);

      columns.forEach(col => {
        const td = document.createElement("td");
        td.textContent = row[col] || "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  /** Export Functions **/
  function exportFilteredToCSV() {
    let csv = "S.No," + columns.join(",") + "\n";
    filteredData.forEach((row, index) => {
      const rowData = [index + 1];
      columns.forEach(col => {
        let cell = row[col] ? row[col].toString() : "";
        if (cell.includes(",") || cell.includes("\"")) {
          cell = `"${cell.replace(/\"/g, '""')}"`;
        }
        rowData.push(cell);
      });
      csv += rowData.join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Equipment_List_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeDropdown();
  }

  function exportFilteredToPDF() {
    const win = window.open("", "_blank");
    let html = "<html><head><title>Equipment List</title></head><body>";
    html += "<h3>Filtered Equipment List</h3>";
    html += "<table border='1' cellpadding='5' style='border-collapse:collapse;width:100%;'>";
    html += "<tr><th>S.No</th>" + columns.map(c => `<th>${c}</th>`).join("") + "</tr>";
    filteredData.forEach((row, index) => {
      html += "<tr><td>" + (index + 1) + "</td>" +
              columns.map(c => `<td>${row[c] || ""}</td>`).join("") +
              "</tr>";
    });
    html += "</table></body></html>";
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    win.close();
    closeDropdown();
  }

  function exportFilteredToJPEG() {
    try {
      const serializer = new XMLSerializer();
      const tableHtml = serializer.serializeToString(table);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${table.offsetWidth}" height="${table.offsetHeight}">
          <foreignObject width="100%" height="100%">
            ${tableHtml}
          </foreignObject>
        </svg>`;
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          const link = document.createElement("a");
          link.download = `Equipment_List_${new Date().toISOString().slice(0, 10)}.jpg`;
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(link.href);
        }, "image/jpeg", 0.95);
      };
      img.onerror = () => {
        alert("Image export failed: Browser may not support SVG rendering.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      alert("Unable to export image without third-party libraries.");
    }
    closeDropdown();
  }

  /** Dropdown handlers **/
  function toggleDropdown() {
    downloadMenu.style.display =
      downloadMenu.style.display === "block" ? "none" : "block";
  }
  function closeDropdown() {
    downloadMenu.style.display = "none";
  }
  document.addEventListener("click", (e) => {
    if (!downloadBtn.contains(e.target) && !downloadMenu.contains(e.target)) {
      closeDropdown();
    }
  });
  downloadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleDropdown();
  });
  downloadMenu.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", () => {
      const format = item.dataset.format;
      if (format === "csv") exportFilteredToCSV();
      else if (format === "pdf") exportFilteredToPDF();
      else if (format === "image") exportFilteredToJPEG();
    });
  });

  applyFilters();
}
