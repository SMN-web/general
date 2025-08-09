const equipmentListEl = document.getElementById("equipment-list");
const addBtn = document.getElementById("add-equipment-btn");
const searchInput = document.getElementById("equipment-search");
const modal = document.getElementById("equipment-modal");
const closeModalBtn = document.getElementById("equipment-modal-close");
const form = document.getElementById("equipment-form");
const modalTitle = document.getElementById("equipment-modal-title");

let equipmentData = []; // Mock data array
let editingId = null;

// Mock: Initial load (replace with fetch from backend)
function loadEquipment() {
  equipmentData = [
    { id: 1, name: "Forklift 12", type: "Vehicle", status: "active" },
    { id: 2, name: "Conveyor A1", type: "Machine", status: "maintenance" },
    { id: 3, name: "Drill Press X", type: "Machine", status: "inactive" }
  ];
  renderEquipment(equipmentData);
}

// Render list
function renderEquipment(list) {
  equipmentListEl.innerHTML = "";
  if (list.length === 0) {
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

// Search filter
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = equipmentData.filter(e =>
    e.name.toLowerCase().includes(term) ||
    (e.type && e.type.toLowerCase().includes(term))
  );
  renderEquipment(filtered);
});

// Show add modal
addBtn.addEventListener("click", () => {
  editingId = null;
  form.reset();
  modalTitle.textContent = "Add Equipment";
  modal.classList.remove("hidden");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Save form
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("eq-name").value;
  const type = document.getElementById("eq-type").value;
  const status = document.getElementById("eq-status").value;

  if (editingId) {
    // Edit existing
    const eq = equipmentData.find(e => e.id === editingId);
    eq.name = name;
    eq.type = type;
    eq.status = status;
  } else {
    // Add new
    const newEq = {
      id: Date.now(),
      name,
      type,
      status
    };
    equipmentData.push(newEq);
  }
  renderEquipment(equipmentData);
  modal.classList.add("hidden");
});

// Handle edit/delete clicks
equipmentListEl.addEventListener("click", e => {
  if (e.target.classList.contains("edit-eq")) {
    const id = parseInt(e.target.dataset.id);
    const eq = equipmentData.find(eq => eq.id === id);
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

// Helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Init
loadEquipment();
