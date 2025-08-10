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

  // Clear previous table/UI
  container.innerHTML = "";

  // Use dropdown in HTML
  const downloadBtn = document.getElementById("download-btn");
  const downloadMenu = document.getElementById("download-menu");

  // Table build
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  const thead = document.createElement("thead");

  // Header row
  const headerRow = document.createElement("tr");
  ["S.No", ...columns].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    th.style.border = "1px solid #000";
    th.style.padding = "4px";
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

      // Serial number column
      const tdSerial = document.createElement("td");
      tdSerial.textContent = index + 1;
      tdSerial.style.border = "1px solid #000";
      tdSerial.style.padding = "4px";
      tr.appendChild(tdSerial);

      columns.forEach(col => {
        const td = document.createElement("td");
        td.textContent = row[col] || "";
        td.style.border = "1px solid #000";
        td.style.padding = "4px";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /* ============ EXPORT ============ */

  // CSV Export (only filtered)
  function exportFilteredToCSV() {
    let csv = "S.No," + columns.join(",") + "\n";
    filteredData.forEach((row, index) => {
      // \t to force "plain text" in Excel
      const rowData = [`\t${index + 1}`];
      columns.forEach(col => {
        let cell = row[col] || "";
        if (cell.includes(",") || cell.includes("\"")) {
          cell = `"${cell.replace(/\"/g, '""')}"`; // escape quotes
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

  // PDF Export (filtered) - robust, reliable
  function exportFilteredToPDF() {
    const html = `
      <html>
      <head>
        <title>Equipment List PDF</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 4px; font-size: 12px; }
          h3 { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h3>Filtered Equipment List</h3>
        <table>
          <tr><th>S.No</th>${columns.map(c => `<th>${c}</th>`).join("")}</tr>
          ${filteredData.map((row, i) =>
            `<tr><td>${i + 1}</td>` +
            columns.map(c => `<td>${row[c] || ""}</td>`).join("") +
            `</tr>`
          ).join("")}
        </table>
      </body>
      </html>
    `;

    // Create blob instead of writing directly (fixes print errors)
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      alert("Popup blocked. Please allow popups for PDF export.");
      return;
    }
    win.onload = function() {
      try {
        win.focus();
        win.print();
      } catch(e) {
        alert("Unable to start printing: " + e.message);
      }
    };
    closeDropdown();
  }

  /* ========== DROPDOWN UI ========== */

  function toggleDropdown() {
    downloadMenu.style.display = downloadMenu.style.display === "block" ? "none" : "block";
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
    });
  });

  applyFilters();
}
