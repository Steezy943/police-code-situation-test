window.understandingLevel = 2;
window.marathonPointer = 0;
window.testScoreCorrect = 0;
window.testModeActive = false;

window.officerMarathonQuestions = [
    { question: "An emergency tone sounds. A unit under threat requests backup near downtown.", options: ["Signal 29", "Signal 59", "Signal 63", "Code 21"], matchIndex: 2, layman: "Help request! An officer is trapped and requires immediate team backup assistance.", id: "Signal 63", desc: "OFFICER NEEDS HELP" },
    { question: "A perimeter unit initiates an immediate tactical pursuit against a fleeing felony car.", options: ["Signal 72", "Signal 72P", "Code 3", "Signal 79"], matchIndex: 1, layman: "High-speed chase! Police are actively pursuing a fleeing criminal vehicle down the highway.", id: "Signal 72P", desc: "Pursuit" },
    { question: "Units respond Code 3 to an ongoing armed hijacking of a commercial vehicle.", options: ["Signal 35C", "Signal 44C", "Signal 36B", "Signal 21"], matchIndex: 0, layman: "Carjacking in progress! A thief is stealing a car by gunpoint or physical force right now.", id: "Signal 35C", desc: "Carjacking (In progress)" }
];

window.addEventListener('DOMContentLoaded', () => {
    if (typeof initRadarEngine === 'function') initRadarEngine();
    buildCodebookView();
});

function toggleView(event, viewId) {
    document.querySelectorAll('.console-tab-item').forEach(t => t.classList.remove('active'));
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
            <button class="next-stage-btn" style="margin-top:20px; float:none;" onclick="startOfficerMarathon()">Retake Assessment</button>
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
        div.innerHTML = `
            <div class="card-top-row"><span class="card-badge">${item.id}</span><span class="card-label">${descString}</span></div>
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

function handleRadarClick(e) {
    const rect = document.getElementById('radarCanvas').getBoundingClientRect();
    const clickX = e.clientX - rect.left; const clickY = e.clientY - rect.top;
    let foundIdx = -1;
    for (let i = 0; i < window.activeBlips.length; i++) {
        if (Math.hypot(window.activeBlips[i].x - clickX, window.activeBlips[i].y - clickY) <= 16) { foundIdx = i; break; }
    }
    if (foundIdx !== -1) {
        window.activeBlips.splice(foundIdx, 1);
        if (!window.testModeActive) { startOfficerMarathon(); }
    }
}

function clearRadarTargets() { window.activeBlips = []; window.hoveredBlip = null; }

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
function drawRadarTooltip(blip) {
    ctx.save(); let displayTxt = `${blip.metaData.id}: ${blip.metaData.desc}`;
    ctx.font = 'bold 11px sans-serif'; let width = ctx.measureText(displayTxt).width + 16;
    let tx = blip.x + 12; let ty = blip.y - 12;
    if (tx + width > canvas.width) tx = blip.x - width - 12;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.rect(tx, ty, width, 24); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f8fafc'; ctx.textBaseline = 'middle'; ctx.fillText(displayTxt, tx + 8, ty + 12); ctx.restore();
}
