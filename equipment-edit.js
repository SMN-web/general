export function initEquipmentEdit() {
  const container = document.getElementById("edit-table-container");
  if (!container) return;
  container.textContent = "Loading...";

  // Reuse your existing /get-equipment endpoint to load rows
  fetch("https://ancient-block-0551.nafil-8895-s.workers.dev/get-equipment")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        renderEditTable(data.equipments, container);
      } else {
        container.textContent = "Error: " + (data.error || "Unknown error");
      }
    })
    .catch(err => {
      container.textContent = "Error fetching data: " + err.message;
    });
}

function renderEditTable(data, container) {
  const columns = ["plantNo", "regNo", "description", "owner", "location", "engineer", "rigCHName", "rigCHNo", "status"];
  let allData = data;
  let filteredData = [...allData];
  const activeFilters = {};
  const changedRows = new Map();

  const table = document.createElement("table");
  table.border = "1";
  table.cellPadding = "5";
  table.style.width = "100%";

  // Header row
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  columns.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  headerRow.appendChild(document.createElement("th")); // ops col
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
  filterRow.appendChild(document.createElement("th"));
  thead.appendChild(filterRow);

  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

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
    filteredData.forEach(row => {
      const tr = document.createElement("tr");
      tr.dataset.regno = row.regNo;

      columns.forEach(col => {
        const td = document.createElement("td");
        td.textContent = row[col] || "";
        td.style.cursor = col === "regNo" ? "" : "pointer";

        td.onclick = () => {
          // Skip editing regNo and active inputs
          if (col === "regNo" || td.querySelector("input")) return;

          const origVal = td.textContent;
          const input = document.createElement("input");
          input.value = origVal;
          input.style.width = "90%";

          input.onblur = onEditDone;
          input.onkeydown = e => {
            if (e.key === "Enter") input.blur();
            if (e.key === "Escape") { input.value = origVal; input.blur(); }
          };

          td.textContent = "";
          td.appendChild(input);
          input.focus();

          function onEditDone() {
            const newVal = input.value;
            td.textContent = newVal;
            if (newVal !== origVal) {
              tr.classList.add("edited-row");
              changedRows.set(row.regNo, { ...row, [col]: newVal });
              tr.querySelector(".edit-save-btn")?.classList.remove("hidden");
              tr.querySelector(".edit-cancel-btn")?.classList.remove("hidden");
            }
          }
        };

        tr.appendChild(td);
      });

      const opsTd = document.createElement("td");
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "✅";
      saveBtn.className = "edit-save-btn hidden";
      saveBtn.onclick = () => saveRow(row.regNo);

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "❌";
      cancelBtn.className = "edit-cancel-btn hidden";
      cancelBtn.onclick = () => {
        changedRows.delete(row.regNo);
        tr.classList.remove("edited-row");
        renderRows();
      };

      opsTd.appendChild(saveBtn);
      opsTd.appendChild(cancelBtn);
      tr.appendChild(opsTd);

      tbody.appendChild(tr);
    });
  }

  function saveRow(regNo) {
    const updatedRow = changedRows.get(regNo);
    if (!updatedRow) return;

    const tr = tbody.querySelector(`[data-regno="${regNo}"]`);
    tr.classList.add("saving");

    fetch("https://still-hat-b5c7.nafil-8895-s.workers.dev/edit-equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipment: updatedRow })
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          changedRows.delete(regNo);
          tr.classList.remove("edited-row", "saving");
          const idx = allData.findIndex(r => r.regNo === regNo);
          if (idx !== -1) allData[idx] = updatedRow;
          applyFilters();
        } else {
          alert("Failed to save: " + (resp.error || "Unknown error"));
          tr.classList.remove("saving");
        }
      })
      .catch(err => {
        alert("Error: " + err.message);
        tr.classList.remove("saving");
      });
  }

  applyFilters();
  container.innerHTML = "";
  container.appendChild(table);
}
