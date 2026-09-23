window.radarConfig = {
    easyRate: 25,
    mediumRate: 25,
    hardRate: 25,
    officerRate: 25
};

window.activeBlips = [];
window.sweepAngle = 0;
window.hoveredBlip = null;
window.mouseX = -999;
window.mouseY = -999;

let canvas, ctx, cx, cy, maxRadius;
const maxBlips = 7;

function initRadarEngine() {
    canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    maxRadius = canvas.width / 2;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        window.mouseX = e.clientX - rect.left;
        window.mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseout', () => {
        window.mouseX = -999;
        window.mouseY = -999;
        window.hoveredBlip = null;
    });

    canvas.addEventListener('click', handleRadarClick);
    window.requestAnimationFrame(runRadarLoop);
}
function runRadarLoop() {
    window.sweepAngle = (window.sweepAngle + 0.02) % (Math.PI * 2);
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

    let grandTotal = window.radarConfig.easyRate + window.radarConfig.mediumRate + window.radarConfig.hardRate + window.radarConfig.officerRate;
    if (grandTotal > 0 && Math.random() < 0.015 && window.activeBlips.length < maxBlips) {
        generateProbabilisticTarget(grandTotal);
    }

    window.hoveredBlip = null;
    window.activeBlips.forEach(blip => {
        let dist = Math.hypot(blip.x - window.mouseX, blip.y - window.mouseY);
        if (dist <= 14) { window.hoveredBlip = blip; }

        let angleToBlip = Math.atan2(blip.y - cy, blip.x - cx);
        if (angleToBlip < 0) angleToBlip += Math.PI * 2;
        let angleDiff = window.sweepAngle - angleToBlip;
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
    ctx.rotate(window.sweepAngle);
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

    if (window.hoveredBlip) { drawRadarTooltip(window.hoveredBlip); }

    const telemetryElem = document.getElementById('telemetryStatus');
    if (telemetryElem) {
        telemetryElem.innerText = `Active Targets: ${window.activeBlips.length} / ${maxBlips}`;
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
    if (targetRand <= window.radarConfig.easyRate) chosenTier = 'easy';
    else if (targetRand <= (window.radarConfig.easyRate + window.radarConfig.mediumRate)) chosenTier = 'medium';
    else if (targetRand <= (window.radarConfig.easyRate + window.radarConfig.mediumRate + window.radarConfig.hardRate)) chosenTier = 'hard';

    if (!window.masterDatabase || window.masterDatabase.length === 0) return;
    let randomMeta = window.masterDatabase[Math.floor(Math.random() * window.masterDatabase.length)];
    let angle = Math.random() * Math.PI * 2;
    let distance = (Math.random() * (maxRadius - 50)) + 30;

    window.activeBlips.push({
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        radius: 6, pulseRadius: 6, pulseOpacity: 0,
        tier: chosenTier, metaData: randomMeta
    });
}
