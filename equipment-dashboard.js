function parseManliftSize(description) {
  // Extract the numeric size for manlift with units
  const regex = /manlift.*?(\d+(\.\d+)?)\s*(ft|feet|m|meters)/i;
  const match = description.match(regex);
  if (!match) return null;
  let size = parseFloat(match[1]);
  const unit = match[3].toLowerCase();
  if (unit === "ft" || unit === "feet") size *= 0.3048; // convert to meters
  // Round to 2 decimals
  return parseFloat(size.toFixed(2));
}

function analyzeEquipments(equipments) {
  let crawlerCount = 0;
  let mobileCraneCount = 0;
  let manliftSizesCount = {}; // { sizeMeters: count }

  equipments.forEach(eq => {
    const desc = (eq.description || "").toLowerCase();

    // Crawler crane: contains both 'craw' and 'crane'
    if (desc.includes("craw") && desc.includes("crane")) {
      crawlerCount++;
    }
    // Mobile crane: 'crane' but not 'craw'
    else if (desc.includes("crane") && !desc.includes("craw")) {
      mobileCraneCount++;
    }

    // Manlift: track sizes
    if (desc.includes("manlift")) {
      const size = parseManliftSize(desc);
      const key = size ? size + " m" : "Unknown size";
      manliftSizesCount[key] = (manliftSizesCount[key] || 0) + 1;
    }
  });

  return {
    crawlerCount,
    mobileCraneCount,
    manliftSizesCount
  };
}

function renderDashboardStats(stats) {
  // Render Cranes section
  document.getElementById('stat-crawler').textContent = stats.crawlerCount;
  document.getElementById('stat-mobile').textContent = stats.mobileCraneCount;

  // Render Manlifts with sizes
  const manliftListElem = document.getElementById('manlift-sizes-list');
  manliftListElem.innerHTML = "";
  for (const [size, count] of Object.entries(stats.manliftSizesCount)) {
    const li = document.createElement('li');
    li.textContent = `${size}: ${count}`;
    manliftListElem.appendChild(li);
  }
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
