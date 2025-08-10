export function initEquipmentManage() {
  const container = document.getElementById("manage-table-container");
  if (!container) {
    console.error("Manage table container not found in DOM.");
    return;
  }

  container.textContent = "Loading...";

  // Fetch equipment list from backend Worker
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

  // Create wrapper
  container.innerHTML = "";

  // Header with export button
  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.alignItems = "center";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.marginBottom = "0.5rem";

  const title = document.createElement("h3");
  title.textContent = "📋 Equipment List";

  const csvBtn = document.createElement("button");
  csvBtn.id = "export-csv-btn";
  csvBtn.textContent = "Download CSV";
  csvBtn.style.marginLeft = "1rem";

  headerDiv.appendChild(title);
  headerDiv.appendChild(csvBtn);
  container.appendChild(headerDiv);

  // Table creation
  const table = document.createElement("table");
  table.border = "1";
  table.cellPadding = "5";
  table.style.width = "100%";

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

  // Filter row (empty for S.No)
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

  // Filtering logic
  function applyFilters() {
    filteredData = allData.filter(row =>
      Object.entries(activeFilters).every(([col, val]) => {
        if (!val) return true;
        return (row[col] || "")
          .toString()
          .toLowerCase()
          .includes(val.toLowerCase());
      })
    );
    renderRows();
  }

  // Rendering logic
  function renderRows() {
    tbody.innerHTML = "";
    filteredData.forEach((row, index) => {
      const tr = document.createElement("tr");

      // S.No column
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

  // CSV export function
  function exportFilteredToCSV() {
    let csv = "S.No," + columns.join(",") + "\n";

    filteredData.forEach((row, index) => {
      const rowData = [index + 1]; // serial number
      columns.forEach(col => {
        let cell = row[col] ? row[col].toString() : "";
        // Escape quotes/commas
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
  }

  // Hook CSV button
  csvBtn.addEventListener("click", exportFilteredToCSV);

  // Initial table draw
  applyFilters();
}
