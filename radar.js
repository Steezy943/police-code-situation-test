const radarConfig = {
    easyRate: 25,
    mediumRate: 25,
    hardRate: 25,
    officerRate: 25
};

let activeBlips = [];
const maxBlips = 7;
let sweepAngle = 0;
let hoveredBlip = null;
let mouseX = -999;
let mouseY = -999;

let canvas, ctx, cx, cy, maxRadius;

function initRadarEngine() {
    canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    maxRadius = canvas.width / 2;

    canvas.addEventListener('mousemove', handleRadarMouseMove);
    canvas.addEventListener('mouseout', handleRadarMouseLeave);
    canvas.addEventListener('click', handleRadarClick);

    window.requestAnimationFrame(runRadarLoop);
}

function runRadarLoop(timestamp) {
    sweepAngle = (sweepAngle + 0.02) % (Math.PI * 2);
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1;
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
    ctx.stroke();
    let grandTotal = radarConfig.easyRate + radarConfig.mediumRate + radarConfig.hardRate + radarConfig.officerRate;

    if (grandTotal > 0 && Math.random() < 0.015 && activeBlips.length < maxBlips) {
        generateProbabilisticTarget(grandTotal);
    }

    hoveredBlip = null;

    activeBlips.forEach(blip => {
        let distToMouse = Math.hypot(blip.x - mouseX, blip.y - mouseY);
        if (distToMouse <= 14) { hoveredBlip = blip; }

        let angleToBlip = Math.atan2(blip.y - cy, blip.x - cx);
        if (angleToBlip < 0) angleToBlip += Math.PI * 2;
        
        let angleDiff = sweepAngle - angleToBlip;
        if (angleDiff < 0) angleDiff += Math.PI * 2;

        if (angleDiff < 0.08) { 
            blip.pulseRadius = blip.radius;
            blip.pulseOpacity = 1.0;
        } else {
            blip.pulseRadius += 0.3;
            blip.pulseOpacity = Math.max(blip.pulseOpacity - 0.015, 0.0);
        }

        ctx.fillStyle = getTierColor(blip.tier, 0.9);
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, blip.radius, 0, Math.PI * 2);
        ctx.fill();

        if (blip.pulseOpacity > 0) {
            ctx.strokeStyle = getTierColor(blip.tier, blip.pulseOpacity * 0.5);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(blip.x, blip.y, blip.pulseRadius + 6, 0, Math.PI * 2);
            ctx.stroke();
        }
    });

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweepAngle);
    let bladeGrad = ctx.createLinearGradient(0, 0, maxRadius, 0);
    bladeGrad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    bladeGrad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    
    ctx.fillStyle = bladeGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxRadius, -0.3, 0, false);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();

    if (hoveredBlip) { drawRadarTooltip(hoveredBlip); }

    const telemetryElem = document.getElementById('telemetryStatus');
    if (telemetryElem) {
        telemetryElem.innerText = `Active Targets: ${activeBlips.length} / ${maxBlips}`;
    }
    window.requestAnimationFrame(runRadarLoop);
}

function getTierColor(tier, opacity) {
    if (tier === 'easy') return `rgba(34, 197, 94, ${opacity})`;
    if (tier === 'medium') return `rgba(234, 179, 8, ${opacity})`;
    if (tier === 'hard') return `rgba(220, 38, 38, ${opacity})`;
    return `rgba(59, 130, 246, ${opacity})`;
}

function generateProbabilisticTarget(total) {
    let targetRand = Math.random() * total;
    let chosenTier = 'officer';
    
    if (targetRand <= radarConfig.easyRate) chosenTier = 'easy';
    else if (targetRand <= (radarConfig.easyRate + radarConfig.mediumRate)) chosenTier = 'medium';
    else if (targetRand <= (radarConfig.easyRate + radarConfig.mediumRate + radarConfig.hardRate)) chosenTier = 'hard';

    if (typeof officerMarathonQuestions === 'undefined' || officerMarathonQuestions.length === 0) return;
    let randomMeta = officerMarathonQuestions[Math.floor(Math.random() * officerMarathonQuestions.length)];

    let angle = Math.random() * Math.PI * 2;
    let distance = (Math.random() * (maxRadius - 50)) + 30;
    activeBlips.push({
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        radius: 6,
        pulseRadius: 6,
        pulseOpacity: 0,
        tier: chosenTier,
        metaData: randomMeta
    });
}
function handleRadarMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}

function handleRadarMouseLeave() {
    mouseX = -999;
    mouseY = -999;
    hoveredBlip = null;
}

function handleRadarClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let foundIdx = -1;
    for (let i = 0; i < activeBlips.length; i++) {
        let dist = Math.hypot(activeBlips[i].x - clickX, activeBlips[i].y - clickY);
        if (dist <= 16) { foundIdx = i; break; }
    }

    if (foundIdx !== -1) {
        activeBlips.splice(foundIdx, 1);
        hoveredBlip = null;
        if (typeof startOfficerMarathon === 'function') { startOfficerMarathon(); }
    }
}

function clearRadarTargets() {
    activeBlips = [];
    hoveredBlip = null;
}

function drawRadarTooltip(blip) {
    ctx.save();
    let txtCode = blip.metaData.id || "Code";
    let txtDesc = blip.metaData.desc || blip.metaData.question.substring(0, 15) + "...";
    let displayTxt = `${txtCode}: ${txtDesc}`;
    let sceneStr = `Scene: ${blip.metaData.context || 'Atlanta Area'}`;

    ctx.font = 'bold 11px sans-serif';
    let w1 = ctx.measureText(displayTxt).width;
    let w2 = ctx.measureText(sceneStr).width;
    let width = Math.max(w1, w2) + 16;
    let height = 38;
    let tx = blip.x + 12;
    let ty = blip.y - 12;

    if (tx + width > canvas.width) tx = blip.x - width - 12;
    if (ty + height > canvas.height) ty = canvas.height - height - 10;
    if (ty < 0) ty = 10;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.rect(tx, ty, width, height);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.fillText(displayTxt, tx + 8, ty + 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(sceneStr, tx + 8, ty + 28);
    ctx.restore();
}
