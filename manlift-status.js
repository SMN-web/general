const API_BASE = "https://odd-queen-6de9.nafil-8895-s.workers.dev"; // Change to your Worker URL

export function initManliftStatus() {
  const searchBtn = document.getElementById('manlift-search-btn');
  const actionSelect = document.getElementById('manlift-action');
  const submitBtn = document.getElementById('manlift-submit-btn');

  if (!searchBtn || !actionSelect || !submitBtn) return;

  // Search equipment
  searchBtn.addEventListener('click', async () => {
    const regNo = document.querySelector('#manlift-status-form .reg_no').value.trim();
    if (!regNo) return alert("Enter registration number");

    const res = await fetch(`${API_BASE}/public-equipment-lookup/${encodeURIComponent(regNo)}`);
    if (!res.ok) return alert("Equipment is not available in our database");

    const data = await res.json();
    if (data.detected_type !== "Manlift") return alert("This registration belongs to Crane");

    document.querySelector('#manlift-status-form .plant_no').value = data.plant_no || "";
    document.querySelector('#manlift-status-form .description').value = data.description || "";

    fetchHistory(regNo, "manlift");
  });

  // Show/hide reason on change
  actionSelect.addEventListener('change', e => {
    document.getElementById('manlift-reason-block').style.display =
      e.target.value === 'breakdown' ? 'block' : 'none';
  });

  // Submit
  submitBtn.addEventListener('click', async () => {
    const regNo = document.querySelector('#manlift-status-form .reg_no').value.trim();
    const action = document.querySelector('#manlift-status-form .action').value;
    const date = document.querySelector('#manlift-status-form .date').value;
    const reason = document.querySelector('#manlift-status-form .reason').value.trim();

    const payload = { reg_no: regNo, equipment_type: "Manlift", action };
    if (action === "breakdown") {
      if (!reason) return alert("Reason required");
      payload.breakdown_date = date;
      payload.reason = reason;
    } else {
      payload.repaired_date = date;
    }

    const res = await fetch(`${API_BASE}/equipment-status-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || data.error);

    if (data.success) fetchHistory(regNo, "manlift");
  });
}

async function fetchHistory(regNo, type) {
  const listElem = document.getElementById(`${type}-history-list`);
  const res = await fetch(`${API_BASE}/equipment-status-history/${encodeURIComponent(regNo)}`);
  if (!res.ok) {
    listElem.innerHTML = "<li>No history</li>";
    return;
  }
  const history = await res.json();
  listElem.innerHTML = history.length
    ? history.map(h =>
      `<li>${h.current_status} | ${h.breakdown_date} → ${h.repaired_date || 'Pending'} | ${h.reason || ''}</li>`
    ).join("")
    : "<li>No history</li>";
}
