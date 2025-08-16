const API_BASE = "https://odd-queen-6de9.nafil-8895-s.workers.dev";

export function initManliftStatus() {
  const searchBtn = document.getElementById('manlift-search-btn');
  const actionSelect = document.getElementById('manlift-action');
  const submitBtn = document.getElementById('manlift-submit-btn');

  function clearForm() {
    form.querySelector('.reg_no').value = '';
    form.querySelector('.plant_no').value = '';
    form.querySelector('.description').value = '';
    form.querySelector('.reason').value = '';
    form.querySelector('.date').value = '';
    actionSelect.value = 'None';
    document.getElementById('manlift-reason-block').style.display = 'block';
  }
  
  if (!searchBtn || !actionSelect || !submitBtn) return;

  // Search Logic
  searchBtn.addEventListener('click', async () => {
    const regNo = document.querySelector('#manlift-status-form .reg_no').value.trim();
    if (!regNo) return alert("Enter registration number");

    const res = await fetch(`${API_BASE}/public-equipment-lookup/${encodeURIComponent(regNo)}`);
    if (!res.ok) return alert("Equipment is not available");
    const data = await res.json();
    if (data.detected_type !== "Manlift") return alert("This registration belongs to Crane");

    document.querySelector('#manlift-status-form .plant_no').value = data.plantNo;
    document.querySelector('#manlift-status-form .description').value = data.description;
  });

  // Show Reason if Breakdown
  actionSelect.addEventListener('change', e => {
    document.getElementById('manlift-reason-block').style.display =
      e.target.value === 'breakdown' ? 'block' : 'none';
  });

  // Submit Logic
  submitBtn.addEventListener('click', async () => {
    const regNo = document.querySelector('#manlift-status-form .reg_no').value.trim();
    const action = document.querySelector('#manlift-status-form .action').value;
    const date = document.querySelector('#manlift-status-form .date').value;
    const reason = document.querySelector('#manlift-status-form .reason').value.trim();

    const payload = { regNo, equipment_type: "Manlift", action };
    if (action === "breakdown") { payload.breakdown_date = date; payload.reason = reason; }
    else { payload.repaired_date = date; }

    const res = await fetch(`${API_BASE}/equipment-status-update`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || data.error);

    if (data.success) clearForm();
  });
}
