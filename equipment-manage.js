export function initEquipmentManage() {
  const container = document.getElementById("manage-table-container");
  container.textContent = "Loading...";

  fetch("https://your-worker-subdomain.workers.dev/get-equipment")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        renderManageTable(data.equipments);
      } else {
        container.textContent = "Error: " + (data.error || "Unknown");
      }
    })
    .catch(err => {
      container.textContent = "Error fetching data: " + err.message;
    });
}

function renderManageTable(data) {
  const columns = ["plantNo","regNo","description","owner","location","engineer","rigCHName","rigCHNo","status"];
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

  // Filter inputs row
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
