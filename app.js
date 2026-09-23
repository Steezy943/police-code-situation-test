// Connect runtime elements safely once DOM anchors finish caching
window.addEventListener('DOMContentLoaded', () => {
    const registryCountElem = document.getElementById('registry-count');
    if (registryCountElem) {
        registryCountElem.innerText = `${masterDatabase.length} APD Codes`;
    }
    
    if (typeof initRadarEngine === 'function') {
        initRadarEngine();
    }
    
    buildCodebookView();
});

function toggleView(event, viewId) {
    document.querySelectorAll('.console-tab-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view-content-block').forEach(v => v.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    const viewBlock = document.getElementById(viewId);
    if (viewBlock) {
        viewBlock.classList.add('active');
    }
    
    if (viewId === 'assessment-deck' && !testModeActive) {
        startOfficerMarathon();
    }
}

function startOfficerMarathon() {
    testModeActive = true;
    marathonPointer = 0;
    testScoreCorrect = 0;
    
    document.querySelectorAll('.console-tab-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view-content-block').forEach(v => v.classList.remove('active'));
    
    const tabs = document.querySelectorAll('.console-tab-item');
    if (tabs && tabs.length > 1) {
        tabs[1].classList.add('active');
    }
    
    const assessBlock = document.getElementById('assessment-deck');
    if (assessBlock) {
        assessBlock.classList.add('active');
    }

    document.getElementById('stat-progress').innerText = `1 / ${officerMarathonQuestions.length}`;
    document.getElementById('stat-accuracy').innerText = "100%";
    renderMarathonQuestion();
}
function renderMarathonQuestion() {
    const forwardBtn = document.getElementById('forward-btn');
    if (forwardBtn) forwardBtn.style.display = 'none';
    
    if (marathonPointer >= officerMarathonQuestions.length) {
        renderFinalPercentageScore();
        return;
    }

    let currentCard = officerMarathonQuestions[marathonPointer];
    let questionHeading = `Question ${marathonPointer + 1} of 20: ${currentCard.question}`;
    
    if (understandingLevel === 1 && currentCard.layman) {
        questionHeading = `Question ${marathonPointer + 1} of 20 [Translated Breakdown]: ${currentCard.layman}`;
    }

    document.getElementById('prompt-textbox').innerText = questionHeading;
    let targetBox = document.getElementById('options-stack');
    targetBox.innerHTML = "";

    currentCard.options.forEach((optText, optIdx) => {
        let divNode = document.createElement('div');
        divNode.className = "quiz-option-row";
        divNode.innerText = optText;
        divNode.onclick = () => evaluateMarathonAnswer(divNode, optIdx, currentCard.matchIndex);
        targetBox.appendChild(divNode);
    });
}

function evaluateMarathonAnswer(selectedEl, userIdx, trueIdx) {
    let rows = document.querySelectorAll('.quiz-option-row');
    rows.forEach(r => r.onclick = null);

    if (userIdx === trueIdx) {
        selectedEl.classList.add('matched-correct');
        testScoreCorrect++;
    } else {
        selectedEl.classList.add('matched-error');
        if (rows[trueIdx]) {
            rows[trueIdx].classList.add('matched-correct');
        }
    }

    let runningPct = Math.round((testScoreCorrect / (marathonPointer + 1)) * 100);
    document.getElementById('stat-accuracy').innerText = `${runningPct}%`;
    
    const forwardBtn = document.getElementById('forward-btn');
    if (forwardBtn) forwardBtn.style.display = 'inline-block';
}
function advanceQuizSession() {
    marathonPointer++;
    if (marathonPointer < officerMarathonQuestions.length) {
        document.getElementById('stat-progress').innerText = `${marathonPointer + 1} / ${officerMarathonQuestions.length}`;
        renderMarathonQuestion();
    } else {
        renderFinalPercentageScore();
    }
}

function renderFinalPercentageScore() {
    testModeActive = false;
    let finalPercentage = Math.round((testScoreCorrect / officerMarathonQuestions.length) * 100);
    document.getElementById('stat-progress').innerText = "Completed";
    document.getElementById('stat-accuracy').innerText = `${finalPercentage}%`;

    let ratingMessage = "Needs Review. Study the reference sheet more.";
    if (finalPercentage >= 90) ratingMessage = "Excellent Work! Outstanding Officer Readiness.";
    else if (finalPercentage >= 75) ratingMessage = "Passed. Solid situational awareness.";

    document.getElementById('prompt-textbox').innerHTML = `
        <div class="final-score-card">
            <h2>Marathon Assessment Complete</h2>
            <p>Atlanta Police Knowledge Diagnostic Result Profile</p>
            <div class="score-pct">${finalPercentage}%</div>
            <p><strong>Correct Responses:</strong> ${testScoreCorrect} out of ${officerMarathonQuestions.length}</p>
            <p style="margin-top: 10px; color: var(--accent-blue);">${ratingMessage}</p>
            <button class="next-stage-btn" style="margin-top:20px; float:none;" onclick="startOfficerMarathon()">Retake Assessment</button>
        </div>
    `;
    document.getElementById('options-stack').innerHTML = "";
    const forwardBtn = document.getElementById('forward-btn');
    if (forwardBtn) forwardBtn.style.display = 'none';
}

function buildCodebookView() {
    let list = document.getElementById('codebook-list');
    if (!list) return;
    list.innerHTML = "";
    
    masterDatabase.forEach(item => {
        let div = document.createElement('div');
        div.className = "extended-card";
        
        let descString = item.desc;
        let displayTranslationBanner = "";
        if (understandingLevel === 1 && item.layman) {
            descString = item.desc;
            displayTranslationBanner = `<div class="translation-banner">💡 Plain English: ${item.layman}</div>`;
        }

        div.innerHTML = `
            <div class="card-top-row">
                <span class="card-badge">${item.id}</span>
                <span class="card-label">${descString}</span>
            </div>
            ${displayTranslationBanner}
            <div class="sentence-instruction">"${item.sentence}"</div>
        `;
        list.appendChild(div);
    });
    
    const countElem = document.getElementById('registry-count');
    if (countElem) {
        countElem.innerText = `${masterDatabase.length} APD Codes`;
    }
}

function filterCodebook() {
    let query = document.getElementById('codeSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.extended-card');
    cards.forEach(card => {
        let bodyTxt = card.innerText.toLowerCase();
        card.style.display = bodyTxt.includes(query) ? 'flex' : 'none';
    });
}
