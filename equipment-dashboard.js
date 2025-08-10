function parseManliftSize(description) {
  // Regex to capture number + unit after 'manlift'
  const regex = /manlift.*?(\d+(\.\d+)?)\s*(ft|feet|m|meters)/i;
  const match = description.match(regex);
  if (!match) return null;

  let size = parseFloat(match[1]);
  const unit = match[3].toLowerCase();

  // Convert feet to meters if needed
  if (unit === "ft" || unit === "feet") {
    size *= 0.3048;
  }

  // Round to nearest whole meter
  return Math.round(size);
}

function analyzeEquipments(equipments) {
  let crawlerCount = 0;
  let mobileCraneCount = 0;
  let manliftSizesCount = {};

  equipments.forEach(eq => {
    const desc = (eq.description || "").toLowerCase();

    // Crane categorisation
    if (desc.includes("craw") && desc.includes("crane")) {
      crawlerCount++;
    } else if (desc.includes("crane") && !desc.includes("craw")) {
      mobileCraneCount++;
    }

    // Manlift size tracking
    if (desc.includes("manlift")) {
      const size = parseManliftSize(desc);
      const key = size ? `${size} m` : "Unknown size";
      manliftSizesCount[key] = (manliftSizesCount[key] || 0) + 1;
    }
  });

  return { crawlerCount, mobileCraneCount, manliftSizesCount };
}

function renderDashboardStats(stats) {
  // Update Cranes count
  document.getElementById('stat-crawler').textContent = stats.crawlerCount;
  document.getElementById('stat-mobile').textContent = stats.mobileCraneCount;

  // Prepare Manlift list sorted from lowest to highest (Unknown last)
  const manliftListElem = document.getElementById('manlift-sizes-list');
  manliftListElem.innerHTML = "";

  const sortedSizes = Object.entries(stats.manliftSizesCount)
    .sort((a, b) => {
      if (a[0] === "Unknown size") return 1; // push unknown to bottom
      if (b[0] === "Unknown size") return -1;
      const numA = parseInt(a[0]); // from "12 m"
      const numB = parseInt(b[0]);
      return numA - numB;
    });

  sortedSizes.forEach(([size, count]) => {
    const li = document.createElement('li');
    li.textContent = `${size}: ${count}`;
    manliftListElem.appendChild(li);
  });
}

export function initEquipmentDashboard() {
  // Fetch all equipment from backend Worker
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

  // Refresh button
  const btn = document.getElementById('refresh-dashboard-btn');
  if (btn) btn.onclick = () => initEquipmentDashboard();
}
