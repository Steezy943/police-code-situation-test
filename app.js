window.understandingLevel = 2;
window.marathonPointer = 0;
window.testScoreCorrect = 0;
window.testModeActive = false;

window.officerMarathonQuestions = [
    { question: "An emergency zone transmission states a unit requires immediate assistance on scene. Identify the signal.", options: ["Signal 29", "Signal 59", "Signal 63", "Code 21"], matchIndex: 2, layman: "Help request! An officer is trapped and requires immediate team backup assistance.", id: "Signal 63", desc: "OFFICER NEEDS HELP" },
    { question: "A patrol vehicle initiates high-speed tactical pursuit mechanics against a fleeing felony car down I-20.", options: ["Signal 72", "Signal 72P", "Code 3", "Signal 79"], matchIndex: 1, layman: "High-speed chase! Police are actively pursuing a fleeing criminal car down the highway.", id: "Signal 72P", desc: "Pursuit" },
    { question: "Units respond Code 3 to an ongoing armed hijacking of a commercial vehicle. What signal classifies this active event?", options: ["Signal 35C", "Signal 44C", "Signal 36B", "Signal 21"], matchIndex: 0, layman: "Carjacking in progress! A thief is stealing a car by gunpoint or physical force right now.", id: "Signal 35C", desc: "Carjacking (In progress)" },
    { question: "Dispatch transmits an alert regarding an armed individual carrying an unholstered rifle near a transit station.", options: ["Signal 54", "Signal 69", "Signal 78", "Code 25"], matchIndex: 1, layman: "Armed person! An individual is walking near a public space carrying a weapon out in the open.", id: "Signal 69", desc: "Person Armed" },
    { question: "A priority dispatch logs an active armed robbery inside a retail storefront right now.", options: ["Signal 44B", "Signal 36B", "Signal 36P", "Code 5B"], matchIndex: 1, layman: "Store hold-up in progress! An armed suspect is robbing a business right this second.", id: "Signal 36B", desc: "Robbery In progress Business" },
    { question: "A suspect violently rips a purse away from a pedestrian on a public pathway and runs. What signal describes this event?", options: ["Signal 45", "Signal 77", "Signal 44P", "Signal 36P"], matchIndex: 1, layman: "Snatch theft robbery! A criminal just ripped property away from a walking citizen and fled.", id: "Signal 77", desc: "Snatch Thief" },
    { question: "A residential call involving a dynamic family physical altercation is reported to dispatch.", options: ["Signal 29", "Signal 58", "Signal 23", "Code 5A"], matchIndex: 1, layman: "Domestic fight! Family structures are fighting violently inside a residential house block.", id: "Signal 58", desc: "Domestic Disturbance" },
    { question: "Units handle a traffic stop and discover an active felony arrest warrant on the operator during verification.", options: ["Code 23", "Code 28A", "Code 28B", "Code 17"], matchIndex: 1, layman: "Wanted check hit! Computer lookups show this driver has a valid arrest warrant pending.", id: "Code 28A", desc: "Wanted Check - Wanted" },
    { question: "A supervisor requests an emergency assignment execution utilizing full assets (Lights and sound sirens required).", options: ["Code 1", "Code 2", "Code 3", "Code 7"], matchIndex: 2, layman: "Maximum response mode! Rush to the crime scene immediately using flashing lights and emergency sirens.", id: "Code 3", desc: "Emergency Lights & Siren Required" },
    { question: "A major collision is verified on the highway where a split fuel line has caused the vehicle engine to fully ignite.", options: ["Signal 34", "Signal 41F", "Signal 41IT", "Signal 30"], matchIndex: 1, layman: "Car crash fire! A vehicle accident impact split open gas components and burst into large flames.", id: "Signal 41F", desc: "Auto Accident/Fire" },
    { question: "Bomb detection squads locate an active improvised explosive artifact package under a municipal bridge.", options: ["Signal 73P", "Code 25", "Signal 73", "Code 30"], matchIndex: 1, layman: "Bomb found! Threat investigators discovered a confirmed explosive device layout left at a site.", id: "Code 25", desc: "Located/Suspected Explosive Device" },
    { question: "An emergency unit drops off the radio grid mid-call, and tracking operators verify a dynamic 911 drop loop.", options: ["Signal 16", "Signal 39", "Signal 55", "Code 22"], matchIndex: 2, layman: "Dropped emergency call line! A 911 call line disconnected instantly before details could be verified.", id: "Signal 55", desc: "911 Hang-up" },
    { question: "A field unit deploys an oleoresin capsicum (pepper spray) canister to handle a combative, non-compliant subject.", options: ["Code 20", "Code 23", "Code 31", "Signal 47"], matchIndex: 0, layman: "Chemical control tool deployment! An officer used pepper spray on a fighting suspect.", id: "Code 20", desc: "O.C. Used" },
    { question: "Detectives complete an on-scene investigation where stolen goods are recovered and safely handed back to the citizen.", options: ["Code 16", "Code 19", "Code 12", "Signal 52"], matchIndex: 0, layman: "Stolen property return! Returning recovered stolen items cleanly back to their original owner.", id: "Code 16", desc: "Release Stolen Property To Owner" },
    { question: "A patrol officer locates an empty vehicle on an access shoulder that has been stripped and left abandoned.", options: ["Signal 1", "Signal 1R", "Signal 37", "Code 10"], matchIndex: 0, layman: "Deserted junk vehicle! An empty car has been left dumped on the public roadside permanently.", id: "Signal 1", desc: "Abandon Auto" },
    { question: "A specialized call is dispatched regarding a suspect looking through structural blinds into a private residential space.", options: ["Signal 54", "Signal 70", "Signal 66", "Signal 71"], matchIndex: 2, layman: "Peeping tom prowler! Someone is spying on citizens illegally through their private home window glass panes.", id: "Signal 66", desc: "Peeping Tom" },
    { question: "An alarm company triggers tracking lines for a hidden, non-sounding monitoring breach layout inside a jewelry vault.", options: ["Signal 2A", "Signal 2S", "Signal 6B", "Code 14A"], matchIndex: 1, layman: "Silent break-in alarm! A hidden commercial security sensor tripped without making any sound.", id: "Signal 2S", desc: "Silent Alarm" },
    { question: "A vehicle collision occurs on an arterial road resulting in multiple passengers pinned inside the compressed wreckage.", options: ["Signal 41I", "Signal 41IT", "Signal 87", "Signal 92"], matchIndex: 1, layman: "Trapped in crash! Wreckage compressed on impact, trapping passengers tightly inside.", id: "Signal 41IT", desc: "Auto Accident/Trapped" },
    { question: "A home invasion is called in by a resident hiding inside a closet while suspects break through a window.", options: ["Signal 6R", "Signal 42R", "Signal 36R", "Signal 44R"], matchIndex: 2, layman: "Active break-in with occupants! Armed robbers forced their way inside a house while residents were home.", id: "Signal 36R", desc: "Robbery In progress Residential" },
    { question: "Command lines order all units on Sector 2 to immediately transition communication strings over to a tactical backup channel.", options: ["Signal 39", "Signal 62", "Signal 67", "Code 9"], matchIndex: 1, layman: "Change radio channels! All responding police units switch their radios to a backup channel now.", id: "Signal 62", desc: "Switch Radio Channel" }
];

window.addEventListener('DOMContentLoaded', () => {
    if (typeof initRadarEngine === 'function') initRadarEngine();
    buildCodebookView();
});
function toggleView(event, viewId) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view-content-block').forEach(v => v.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'assessment-deck' && !window.testModeActive) { startOfficerMarathon(); }
}

function startOfficerMarathon() {
    window.testModeActive = true;
    window.marathonPointer = 0;
    window.testScoreCorrect = 0;
    document.getElementById('stat-progress').innerText = `1 / ${window.officerMarathonQuestions.length}`;
    document.getElementById('stat-accuracy').innerText = "100%";
    renderMarathonQuestion();
}

function renderMarathonQuestion() {
    document.getElementById('forward-btn').style.display = 'none';
    if (window.marathonPointer >= window.officerMarathonQuestions.length) {
        renderFinalPercentageScore(); return;
    }
    let currentCard = window.officerMarathonQuestions[window.marathonPointer];
    let heading = (window.understandingLevel === 1) ? currentCard.layman : currentCard.question;
    document.getElementById('prompt-textbox').innerText = heading;
    let targetBox = document.getElementById('options-stack');
    targetBox.innerHTML = "";
    currentCard.options.forEach((optText, optIdx) => {
        let divNode = document.createElement('div');
        divNode.className = "quiz-option-row"; divNode.innerText = optText;
        divNode.onclick = () => evaluateMarathonAnswer(divNode, optIdx, currentCard.matchIndex);
        targetBox.appendChild(divNode);
    });
}

function evaluateMarathonAnswer(selectedEl, userIdx, trueIdx) {
    let rows = document.querySelectorAll('.quiz-option-row');
    rows.forEach(r => r.onclick = null);
    if (userIdx === trueIdx) {
        selectedEl.classList.add('matched-correct'); window.testScoreCorrect++;
    } else {
        selectedEl.classList.add('matched-error'); rows[trueIdx].classList.add('matched-correct');
    }
    let pct = Math.round((window.testScoreCorrect / (window.marathonPointer + 1)) * 100);
    document.getElementById('stat-accuracy').innerText = `${pct}%`;
    document.getElementById('forward-btn').style.display = 'inline-block';
}
function advanceQuizSession() {
    window.marathonPointer++;
    if (window.marathonPointer < window.officerMarathonQuestions.length) {
        document.getElementById('stat-progress').innerText = `${window.marathonPointer + 1} / ${window.officerMarathonQuestions.length}`;
        renderMarathonQuestion();
    } else { renderFinalPercentageScore(); }
}

function renderFinalPercentageScore() {
    window.testModeActive = false;
    let finalPercentage = Math.round((window.testScoreCorrect / window.officerMarathonQuestions.length) * 100);
    document.getElementById('stat-progress').innerText = "Completed";
    document.getElementById('stat-accuracy').innerText = `${finalPercentage}%`;
    document.getElementById('prompt-textbox').innerHTML = `
        <div class="final-score-card">
            <h2>Marathon Assessment Complete</h2>
            <div class="score-pct">${finalPercentage}%</div>
            <p><strong>Correct Responses:</strong> ${window.testScoreCorrect} out of ${window.officerMarathonQuestions.length}</p>
            <button class="action-btn-primary" style="margin-top:20px;" onclick="startOfficerMarathon()">Retake Assessment</button>
        </div>`;
    document.getElementById('options-stack').innerHTML = "";
    document.getElementById('forward-btn').style.display = 'none';
}

function buildCodebookView() {
    let list = document.getElementById('codebook-list');
    if (!list || !window.masterDatabase) return;
    list.innerHTML = "";
    window.masterDatabase.forEach(item => {
        let div = document.createElement('div'); div.className = "extended-card";
        let descString = (window.understandingLevel === 1 && item.layman) ? item.layman : item.desc;
        let transBanner = (window.understandingLevel === 1 && item.layman) ? `<div class="translation-banner">Translation Note: ${item.layman}</div>` : "";
        div.innerHTML = `
            <div class="card-top-row"><span class="card-badge">${item.id}</span><span class="card-label">${descString}</span></div>
            ${transBanner}
            <div class="sentence-instruction">"${item.sentence}"</div>`;
        list.appendChild(div);
    });
    document.getElementById('registry-count').innerText = `${window.masterDatabase.length} APD Codes`;
}

function filterCodebook() {
    let query = document.getElementById('codeSearch').value.toLowerCase();
    document.querySelectorAll('.extended-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? 'flex' : 'none';
    });
}

function balanceProbabilities(changedTier) {
    let sliders = ['easy', 'medium', 'hard', 'officer'];
    let changedVal = parseFloat(document.getElementById(`rate-${changedTier}`).value) || 0;
    document.getElementById(`val-${changedTier}`).innerText = `${changedVal}%`;
    let remainder = 100 - changedVal;
    let otherSliders = sliders.filter(s => s !== changedTier);
    let sumOthers = otherSliders.reduce((sum, s) => sum + (parseFloat(document.getElementById(`rate-${s}`).value) || 0), 0);
    otherSliders.forEach(s => {
        let curVal = parseFloat(document.getElementById(`rate-${s}`).value) || 0;
        let scaled = sumOthers > 0 ? Math.round((curVal / sumOthers) * remainder) : Math.round(remainder / 3);
        document.getElementById(`rate-${s}`).value = scaled; document.getElementById(`val-${s}`).innerText = `${scaled}%`;
    });
    window.radarConfig = {
        easyRate: parseFloat(document.getElementById('rate-easy').value) || 0,
        mediumRate: parseFloat(document.getElementById('rate-medium').value) || 0,
        hardRate: parseFloat(document.getElementById('rate-hard').value) || 0,
        officerRate: parseFloat(document.getElementById('rate-officer').value) || 0
    };
}

function toggleSettingsModal(open) { document.getElementById('settingsModal').classList.toggle('active', open); }
function applySettingsParametersUpdate() {
    window.understandingLevel = parseInt(document.getElementById('understandingLevelSelect').value) || 2;
    buildCodebookView(); if (window.testModeActive) { renderMarathonQuestion(); } toggleSettingsModal(false);
}
