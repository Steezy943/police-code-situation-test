window.radarConfig = {
    easyRate: 25,
    mediumRate: 25,
    hardRate: 25,
    officerRate: 25
};

window.activeBlips = [];
const maxBlips = 7;

function initRadarEngine() {
    // Generate initial traditional mock testing table records queue
    for (let i = 0; i < maxBlips; i++) {
        generateLogRecord();
    }
    renderDispatchTable();
    
    // Cycle log processing update triggers periodic generation loops
    setInterval(() => {
        let grandTotal = window.radarConfig.easyRate + window.radarConfig.mediumRate + window.radarConfig.hardRate + window.radarConfig.officerRate;
        if (grandTotal > 0 && Math.random() < 0.3 && window.activeBlips.length < maxBlips) {
            generateLogRecord();
            renderDispatchTable();
        }
    }, 4000);
}

function generateLogRecord() {
    let easyVal = window.radarConfig.easyRate;
    let medVal = window.radarConfig.mediumRate;
    let hardVal = window.radarConfig.hardRate;
    let offVal = window.radarConfig.officerRate;
    let total = easyVal + medVal + hardVal + offVal;
    
    if (total === 0) return;
    
    let targetRand = Math.random() * total;
    let chosenTier = 'officer';
    if (targetRand <= easyVal) chosenTier = 'easy';
    else if (targetRand <= (easyVal + medVal)) chosenTier = 'medium';
    else if (targetRand <= (easyVal + medVal + hardVal)) chosenTier = 'hard';

    if (!window.masterDatabase || window.masterDatabase.length === 0) return;
    let randomMeta = window.masterDatabase[Math.floor(Math.random() * window.masterDatabase.length)];
    
    // Assign uniform standard city street log identifiers
    let genericLocations = ["Peachtree Street Corridor", "Interstate 20 Westbound", "Moreland Avenue Route", "Northside Drive Junction", "Cascade Road Sector", "Buckhead District Plaza", "Piedmont Park Boundary"];
    let randomLoc = genericLocations[Math.floor(Math.random() * genericLocations.length)];

    window.activeBlips.push({
        id: "REC-" + Math.floor(1000 + Math.random() * 9000),
        tier: chosenTier,
        location: randomLoc,
        metaData: randomMeta
    });
}
function renderDispatchTable() {
    const tableBody = document.getElementById('dispatchQueueBody');
    if (!tableBody) return;
    tableBody.innerHTML = "";

    window.activeBlips.forEach((blip, index) => {
        let rowNode = document.createElement('tr');
        rowNode.className = "dispatch-row";
        rowNode.onclick = () => {
            window.activeBlips.splice(index, 1);
            renderDispatchTable();
            if (typeof startOfficerMarathon === 'function') {
                startOfficerMarathon();
            }
        };

        rowNode.innerHTML = `
            <td><strong>${blip.id}</strong></td>
            <td style="color: var(--${blip.tier}); font-weight: bold;">${blip.tier.toUpperCase()}</td>
            <td>${blip.location}</td>
            <td style="text-decoration: underline; color: var(--navy-blue);">Initialize Exam Unit</td>
        `;
        tableBody.appendChild(rowNode);
    });

    const telemetryElem = document.getElementById('telemetryStatus');
    if (telemetryElem) {
        telemetryElem.innerText = `Active Log Records: ${window.activeBlips.length} / ${maxBlips}`;
    }
}

function clearRadarTargets() {
    window.activeBlips = [];
    renderDispatchTable();
}
