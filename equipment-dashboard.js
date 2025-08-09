function parseManliftSize(description) {
  const regex = /manlift.*?(\d+(\.\d+)?)\s*(ft|feet|m|meters)/i;
  const match = description.match(regex);
  if (!match) return null;
  let size = parseFloat(match[1]);
  const unit = match[3].toLowerCase();
  if (unit === "ft" || unit === "feet") {
    size *= 0.3048; // feet to meters
  }
  return size;
}

function analyzeEquipments(equipments) {
  let crawlerCount = 0, mobileCraneCount = 0, manliftCount = 0, manliftTotalSizeM = 0;
  let dumberCount = 0, forkliftCount = 0, boomTruckCount = 0, dwmCount = 0;

  equipments.forEach(eq => {
    const desc = (eq.description || "").toLowerCase();

    if (desc.includes("craw") && desc.includes("crane")) {
      crawlerCount++;
    } else if (desc.includes("crane") && !desc.includes("craw")) {
      mobileCraneCount++;
    }

    if (desc.includes("manlift")) {
      manliftCount++;
      const size = parseManliftSize(desc);
      if (size) manliftTotalSizeM += size;
    }

    if (desc.includes("dumber")) dumberCount++;
    if (desc.includes("forklift")) forkliftCount++;
    if (desc.includes("boom truck")) boomTruckCount++;
    if (desc.includes("dwm")) dwmCount++;
  });

  return {
    crawlerCount,
    mobileCraneCount,
    manliftCount,
    manliftAvgSizeM: manliftCount ? (manliftTotalSizeM / manliftCount).toFixed(2) : "N/A",
    dumberCount,
    forkliftCount,
    boomTruckCount,
    dwmCount
  };
}

function renderDashboardStats(stats) {
  document.getElementById('stat-crawler').textContent = stats.crawlerCount;
  document.getElementById('stat-mobile').textContent = stats.mobileCraneCount;
  document.getElementById('stat-manlift').textContent = stats.manliftCount;
  document.getElementById('stat-manlift-avg').textContent = stats.manliftAvgSizeM;
  document.getElementById('stat-dumber').textContent = stats.dumberCount;
  document.getElementById('stat-forklift').textContent = stats.forkliftCount;
  document.getElementById('stat-boom').textContent = stats.boomTruckCount;
  document.getElementById('stat-dwm').textContent = stats.dwmCount;
}

export function initEquipmentDashboard() {
  // Set your deployed Worker URL here
  fetch("https://ancient-block-0551.nafil-8895-s.workers.dev")
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
