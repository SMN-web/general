const API_BASE = "https://odd-queen-6de9.nafil-8895-s.workers.dev";

export function initCraneStatus() {
  const searchBtn = document.getElementById('crane-search-btn');
  const actionSelect = document.getElementById('crane-action');
  const submitBtn = document.getElementById('crane-submit-btn');
  
  function clearForm() {
    form.querySelector('.reg_no').value = '';
    form.querySelector('.plant_no').value = '';
    form.querySelector('.description').value = '';
    form.querySelector('.reason').value = '';
    form.querySelector('.date').value = '';
    actionSelect.value = 'breakdown';
    document.getElementById('crane-reason-block').style.display = 'block';
  }

  if (!searchBtn || !actionSelect || !submitBtn) return;

  // Search Logic
  searchBtn.addEventListener('click', async () => {
    const regNo = document.querySelector('#crane-status-form .reg_no').value.trim();
    if (!regNo) return alert("Enter registration number");

    const res = await fetch(`${API_BASE}/public-equipment-lookup/${encodeURIComponent(regNo)}`);
    if (!res.ok) return alert("Equipment is not available");
    const data = await res.json();
    if (data.detected_type !== "Crane") return alert("This registration belongs to Manlift");

    document.querySelector('#crane-status-form .plant_no').value = data.plantNo;
    document.querySelector('#crane-status-form .description').value = data.description;
  });

  // Show Reason if Breakdown
  actionSelect.addEventListener('change', e => {
    document.getElementById('crane-reason-block').style.display =
      e.target.value === 'breakdown' ? 'block' : 'none';
  });

  // Submit Logic
  submitBtn.addEventListener('click', async () => {
    const regNo = document.querySelector('#crane-status-form .reg_no').value.trim();
    const action = document.querySelector('#crane-status-form .action').value;
    const date = document.querySelector('#crane-status-form .date').value;
    const reason = document.querySelector('#crane-status-form .reason').value.trim();

    const payload = { regNo, equipment_type: "Crane", action };
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
