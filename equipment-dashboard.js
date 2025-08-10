function parseManliftSize(description) {
  const regex = /manlift.*?(\d+(\.\d+)?)\s*(ft|feet|m|meters)/i;
  const match = description.match(regex);
  if (!match) return null;
  let size = parseFloat(match[1]);
  const unit = match[3].toLowerCase();
  if (unit === "ft" || unit === "feet") size *= 0.3048;
  return Math.round(size);
}

function analyzeEquipments(equipments) {
  let crawlerCount = 0;
  let mobileCraneCount = 0;
  let manliftSizesCount = {};
  equipments.forEach(eq => {
    const desc = (eq.description || "").toLowerCase();
    if (desc.includes("craw") && desc.includes("crane")) {
      crawlerCount++;
    } else if (desc.includes("crane") && !desc.includes("craw")) {
      mobileCraneCount++;
    }
    if (desc.includes("manlift")) {
      const size = parseManliftSize(desc);
      const key = size ? size + " m" : "Unknown size";
      manliftSizesCount[key] = (manliftSizesCount[key] || 0) + 1;
    }
  });
  return { crawlerCount, mobileCraneCount, manliftSizesCount };
}

function renderDashboardStats(stats) {
  document.getElementById('stat-crawler').textContent = stats.crawlerCount;
  document.getElementById('stat-mobile').textContent = stats.mobileCraneCount;
  const manliftListElem = document.getElementById('manlift-sizes-list');
  if (!manliftListElem) return;
  manliftListElem.innerHTML = "";
  Object.entries(stats.manliftSizesCount).forEach(([size, count]) => {
    const li = document.createElement('li');
    li.textContent = `${size}: ${count}`;
    manliftListElem.appendChild(li);
  });
}

export function initEquipmentDashboard() {
  fetch("https://ancient-block-0551.nafil-8895-s.workers.dev/get-equipment")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const stats = analyzeEquipments(data.equipments);
        renderDashboardStats(stats);
      } else {
        document.getElementById('equipment-dashboard-summary').textContent =
          "Error loading equipment: " + (data.error || "Unknown error");
      }
    })
    .catch(err => {
      document.getElementById('equipment-dashboard-summary').textContent =
        "Error loading equipment: " + (err.message || err);
    });

  const btn = document.getElementById('refresh-dashboard-btn');
  if (btn) btn.onclick = () => initEquipmentDashboard();
}
