export function initEquipmentList() {
  const fileInput = document.getElementById("csvFile");
  const uploadBtn = document.getElementById("uploadCsvBtn");
  const statusBox = document.getElementById("csv-status");
  const tableBox = document.getElementById("equipment-table");

  if (!fileInput || !uploadBtn) return;

  uploadBtn.onclick = () => {
    const file = fileInput.files[0];
    if (!file) {
      statusBox.textContent = "Please select a CSV file first.";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = parseCSV(text);

      if (rows.length < 2) {
        statusBox.textContent = "❌ Not enough data rows.";
        return;
      }

      const headers = rows.shift().map(h => h.trim());
      const requiredHeaders = ["plantNo","regNo","description","owner","location","engineer","rigCHName","rigCHNo","status"];

      if (headers.length !== requiredHeaders.length ||
          !requiredHeaders.every((h, i) => h === headers[i])) {
        statusBox.textContent = "❌ CSV headers mismatch: " + requiredHeaders.join(", ");
        return;
      }

      const records = rows.map(cols => ({
        plantNo: cols[0] || "",
        regNo: cols[1] || "",
        description: cols[2] || "",
        owner: cols[3] || "",
        location: cols[4] || "",
        engineer: cols[5] || "",
        rigCHName: cols[6] || "",
        rigCHNo: cols[7] || "",
        status: cols[8] || ""
      }));

      fetch("https://nameless-recipe-b0e0.nafil-8895-s.workers.dev/upload-equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipments: records })
      })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          statusBox.textContent = `✅ Uploaded ${records.length} rows successfully.`;
          renderTable(records);
        } else {
          statusBox.textContent = "❌ Failed: " + (resp.message || "Unknown error");
        }
      })
      .catch(err => {
        statusBox.textContent = "❌ Error uploading CSV.";
        console.error(err);
      });
    };
    reader.readAsText(file);
  };

  /** CSV parser with quote/comma support */
  function parseCSV(str) {
    const out = [];
    let row = [], val = "", inQuotes = false;
    for (let i = 0; i < str.length; i++) {
      const char = str[i], next = str[i+1];
      if (char === '"' && inQuotes && next === '"') { val += '"'; i++; }
      else if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { row.push(val); val = ""; }
      else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (val || row.length) row.push(val);
        if (row.length) out.push(row.map(v => v.trim()));
        row = []; val = "";
        if (char === '\r' && next === '\n') i++;
      } else { val += char; }
    }
    if (val || row.length) {
      row.push(val);
      if (row.length) out.push(row.map(v => v.trim()));
    }
    return out;
  }

  function renderTable(data) {
    const table = document.createElement("table");
    table.border = "1"; table.cellPadding = "5"; table.style.width = "100%";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Plant No</th><th>Reg No</th><th>Description</th>
          <th>Owner</th><th>Location</th><th>Engineer</th>
          <th>Rig C/H Name</th><th>Rig C/H No.</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td>${row.plantNo}</td>
            <td>${row.regNo}</td>
            <td>${row.description}</td>
            <td>${row.owner}</td>
            <td>${row.location}</td>
            <td>${row.engineer}</td>
            <td>${row.rigCHName}</td>
            <td>${row.rigCHNo}</td>
            <td>${row.status}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
    tableBox.innerHTML = "";
    tableBox.appendChild(table);
  }
}
