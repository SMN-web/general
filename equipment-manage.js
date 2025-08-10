export function initEquipmentManage() {
  // Look up the container when called — ensures it exists
  const container = document.getElementById("manage-table-container");
  if (!container) {
    console.error("Manage table container not found in DOM.");
    return;
  }

  container.textContent = "Loading...";

  // Fetch equipment list from backend
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
    "plantNo","regNo","description","owner",
    "location","engineer","rigCHName","rigCHNo","status"
  ];

  let allData = data;
  let filteredData = [...allData];
  const activeFilters = {};

  const table = document.createElement("table");
  table.border = "1";
  table.cellPadding = "5";
  table.style.width = "100%";
  const thead = document.createElement("thead");

  // Header row
  const headerRow = document.createElement("tr");
  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Filter row
  const filterRow = document.createElement("tr");
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

  function applyFilters() {
    filteredData = allData.filter(row => {
      return Object.entries(activeFilters).every(([col, val]) => {
        if (!val) return true;
        return (row[col] || "").toString().toLowerCase().includes(val.toLowerCase());
      });
    });
    renderRows();
  }

  function renderRows() {
    tbody.innerHTML = "";
    filteredData.forEach(row => {
      const tr = document.createElement("tr");
      columns.forEach(col => {
        const td = document.createElement("td");
        td.textContent = row[col] || "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  applyFilters();
  container.innerHTML = "";
  container.appendChild(table);
}
