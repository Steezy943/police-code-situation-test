window.selectedDifficulty = "random";
window.selectedSituation = "random";
window.activeBlips = [];
const maxBlips = 7;

function initRadarEngine() {
    populateSituationDropdown();
    generateFullTableQueue();
}

function generateFullTableQueue() {
    window.activeBlips = [];
    for (let i = 0; i < maxBlips; i++) {
        generateLogRecord();
    }
    renderDispatchTable();
}

function generateLogRecord() {
    if (!window.masterDatabase || window.masterDatabase.length === 0) return;
    
    // Process filtering selection matrices parameters
    let filteredPool = window.masterDatabase;
    
    if (window.selectedDifficulty !== "random") {
        filteredPool = filteredPool.filter(item => item.tier === window.selectedDifficulty || (window.selectedDifficulty === 'officer' && item.type === 'Code'));
    }
    
    if (window.selectedSituation !== "random") {
        filteredPool = filteredPool.filter(item => item.id === window.selectedSituation);
    }
    
    if (filteredPool.length === 0) {
        filteredPool = window.masterDatabase; // Fail safe backup context
    }
    
    let randomMeta = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    let tierLabel = randomMeta.tier || (randomMeta.type === 'Code' ? 'officer' : 'easy');
    
    let genericLocations = ["Peachtree Street Corridor", "Interstate 20 Westbound", "Moreland Avenue Route", "Northside Drive Junction", "Cascade Road Sector", "Buckhead District Plaza", "Piedmont Park Boundary"];
    let randomLoc = genericLocations[Math.floor(Math.random() * genericLocations.length)];

    window.activeBlips.push({
        id: "REC-" + Math.floor(1000 + Math.random() * 9000),
        tier: tierLabel,
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
    generateFullTableQueue();
}

function handleParameterChange() {
    window.selectedDifficulty = document.getElementById('difficultySelect').value;
    window.selectedSituation = document.getElementById('situationSelect').value;
    generateFullTableQueue();
}
