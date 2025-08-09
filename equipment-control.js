document.addEventListener("DOMContentLoaded", () => {

  const equipmentListEl = document.getElementById("equipment-list");
  const addBtn = document.getElementById("add-equipment-btn");
  const searchInput = document.getElementById("equipment-search");
  const modal = document.getElementById("equipment-modal");
  const closeModalBtn = document.getElementById("equipment-modal-close");
  const form = document.getElementById("equipment-form");
  const modalTitle = document.getElementById("equipment-modal-title");

  if (!equipmentListEl || !addBtn || !searchInput || !modal || !closeModalBtn || !form || !modalTitle) {
    console.error("Equipment section elements not found.");
    return;
  }

  let equipmentData = [];
  let editingId = null;

  function loadEquipment() {
    // mock data
    equipmentData = [
      { id: 1, name: "Forklift 12", type: "Vehicle", status: "active" },
      { id: 2, name: "Conveyor A1", type: "Machine", status: "maintenance" },
      { id: 3, name: "Drill Press X", type: "Machine", status: "inactive" }
    ];
    renderEquipment(equipmentData);
  }

  function renderEquipment(list) {
    equipmentListEl.innerHTML = "";
    if (!list.length) {
      equipmentListEl.innerHTML = "<p>No equipment found.</p>";
      return;
    }
    list.forEach(eq => {
      const card = document.createElement("div");
      card.className = "equipment-card";
      card.innerHTML = `
        <div class="eq-details">
          <strong>${eq.name}</strong>
          <span>Type: ${eq.type || "-"}</span>
          <span class="eq-status ${eq.status}">${capitalize(eq.status)}</span>
        </div>
        <div class="equipment-actions">
          <button class="edit-eq" data-id="${eq.id}">Edit</button>
          <button class="del-eq" data-id="${eq.id}">Delete</button>
        </div>
      `;
      equipmentListEl.appendChild(card);
    });
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = equipmentData.filter(e =>
      e.name.toLowerCase().includes(term) ||
      (e.type && e.type.toLowerCase().includes(term))
    );
    renderEquipment(filtered);
  });

  addBtn.addEventListener("click", () => {
    editingId = null;
    form.reset();
    modalTitle.textContent = "Add Equipment";
    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("eq-name").value.trim();
    const type = document.getElementById("eq-type").value.trim();
    const status = document.getElementById("eq-status").value;
    if (!name) return;

    if (editingId) {
      const eq = equipmentData.find(e => e.id === editingId);
      if (!eq) return;
      eq.name = name;
      eq.type = type;
      eq.status = status;
    } else {
      equipmentData.push({ id: Date.now(), name, type, status });
    }

    renderEquipment(equipmentData);
    modal.classList.add("hidden");
  });

  equipmentListEl.addEventListener("click", e => {
    if (e.target.classList.contains("edit-eq")) {
      const id = parseInt(e.target.dataset.id);
      const eq = equipmentData.find(eq => eq.id === id);
      if (!eq) return;
      editingId = id;
      document.getElementById("eq-name").value = eq.name;
      document.getElementById("eq-type").value = eq.type;
      document.getElementById("eq-status").value = eq.status;
      modalTitle.textContent = "Edit Equipment";
      modal.classList.remove("hidden");
    }
    if (e.target.classList.contains("del-eq")) {
      const id = parseInt(e.target.dataset.id);
      equipmentData = equipmentData.filter(eq => eq.id !== id);
      renderEquipment(equipmentData);
    }
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  loadEquipment();

});
