/* =========================================================
   1. LOGIC GATES & FLIP-FLOP ENGINE
   ========================================================= */
const gates = {
  and: { a: 0, b: 0, q: 0 },
  or:  { a: 0, b: 0, q: 0 },
  xor: { a: 0, b: 0, q: 0 },
  not: { a: 0, q: 1 },
  ff:  { a: 0, b: 0, q: 0, qn: 1 } // a = Set, b = Reset
};

function toggleGate(gateKey, inputPin) {
  const gate = gates[gateKey];
  
  // Toggle input bit 0 <-> 1
  gate[inputPin] = gate[inputPin] === 0 ? 1 : 0;

  // Compute Logic Gate Outputs
  if (gateKey === 'and') gate.q = gate.a & gate.b;
  if (gateKey === 'or')  gate.q = gate.a | gate.b;
  if (gateKey === 'xor') gate.q = gate.a ^ gate.b;
  if (gateKey === 'not') gate.q = gate.a === 0 ? 1 : 0;
  
  // SR Flip-Flop Circuit Logic
  if (gateKey === 'ff') {
    const s = gate.a;
    const r = gate.b;
    if (s === 1 && r === 0) { gate.q = 1; gate.qn = 0; }      // Set
    else if (s === 0 && r === 1) { gate.q = 0; gate.qn = 1; } // Reset
    else if (s === 1 && r === 1) { gate.q = 1; gate.qn = 1; } // Invalid State
    // If S=0 and R=0, hold current state
  }

  updateSVG(gateKey);
}

function updateSVG(key) {
  const g = gates[key];

  if (key === 'not') {
    setWire('not-wire-a', g.a);
    setWire('not-wire-out', g.q, true);
    document.getElementById('not-lbl-a').textContent = g.a;
    document.getElementById('not-lbl-out').textContent = g.q;
    
    const btnA = document.getElementById('not-btn-a');
    btnA.textContent = g.a;
    btnA.classList.toggle('active', g.a === 1);

    const valOut = document.getElementById('not-val-out');
    valOut.textContent = g.q;
    valOut.classList.toggle('active', g.q === 1);

  } else if (key === 'ff') {
    setWire('ff-wire-s', g.a);
    setWire('ff-wire-r', g.b);
    setWire('ff-wire-q', g.q, true);
    setWire('ff-wire-qn', g.qn, true);

    document.getElementById('ff-lbl-s').textContent = g.a;
    document.getElementById('ff-lbl-r').textContent = g.b;
    document.getElementById('ff-lbl-q').textContent = g.q;
    document.getElementById('ff-lbl-qn').textContent = g.qn;

    document.getElementById('ff-btn-a').classList.toggle('active', g.a === 1);
    document.getElementById('ff-btn-b').classList.toggle('active', g.b === 1);
    document.getElementById('ff-btn-a').textContent = g.a;
    document.getElementById('ff-btn-b').textContent = g.b;

    const stateTxt = document.getElementById('ff-state-txt');
    if (g.a === 1 && g.b === 1) {
      stateTxt.textContent = "INVALID (1,1)";
      stateTxt.className = "out-status";
    } else {
      stateTxt.textContent = g.q === 1 ? "SET (Q=1)" : "RESET (Q=0)";
      stateTxt.className = `out-status ${g.q === 1 ? 'active' : ''}`;
    }

  } else {
    // 2-Input Gates (AND, OR, XOR)
    setWire(`${key}-wire-a`, g.a);
    setWire(`${key}-wire-b`, g.b);
    setWire(`${key}-wire-out`, g.q, true);

    document.getElementById(`${key}-lbl-a`).textContent = g.a;
    document.getElementById(`${key}-lbl-b`).textContent = g.b;
    document.getElementById(`${key}-lbl-out`).textContent = g.q;

    const btnA = document.getElementById(`${key}-btn-a`);
    const btnB = document.getElementById(`${key}-btn-b`);
    btnA.textContent = g.a;
    btnB.textContent = g.b;
    btnA.classList.toggle('active', g.a === 1);
    btnB.classList.toggle('active', g.b === 1);

    const valOut = document.getElementById(`${key}-val-out`);
    valOut.textContent = g.q;
    valOut.classList.toggle('active', g.q === 1);
  }
}

function setWire(wireId, state, isOutput = false) {
  const wire = document.getElementById(wireId);
  if (!wire) return;
  
  if (state === 1) {
    wire.className.baseVal = isOutput ? "wire cyan-active" : "wire active";
  } else {
    wire.className.baseVal = "wire";
  }
}

/* =========================================================
   2. BMI CALCULATOR ENGINE
   ========================================================= */
let currentUnit = 'metric';

function switchUnit(unit) {
  currentUnit = unit;
  
  const metricBtn = document.getElementById('btn-metric');
  const imperialBtn = document.getElementById('btn-imperial');
  const metricInputs = document.getElementById('metric-inputs');
  const imperialInputs = document.getElementById('imperial-inputs');

  if (unit === 'metric') {
    metricBtn.classList.add('active');
    imperialBtn.classList.remove('active');
    metricInputs.classList.remove('hidden');
    imperialInputs.classList.add('hidden');
  } else {
    imperialBtn.classList.add('active');
    metricBtn.classList.remove('active');
    imperialInputs.classList.remove('hidden');
    metricInputs.classList.add('hidden');
  }

  document.getElementById('bmi-result').classList.add('hidden');
}

function calculateBMI(event) {
  event.preventDefault();
  let bmi = 0;

  if (currentUnit === 'metric') {
    const heightCm = parseFloat(document.getElementById('height-cm').value);
    const weightKg = parseFloat(document.getElementById('weight-kg').value);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      alert('Please enter valid positive numbers for height and weight.');
      return;
    }

    const heightM = heightCm / 100;
    bmi = weightKg / (heightM * heightM);
  } else {
    const heightFt = parseFloat(document.getElementById('height-ft').value) || 0;
    const heightIn = parseFloat(document.getElementById('height-in').value) || 0;
    const weightLbs = parseFloat(document.getElementById('weight-lbs').value);

    const totalInches = (heightFt * 12) + heightIn;

    if (!totalInches || !weightLbs || totalInches <= 0 || weightLbs <= 0) {
      alert('Please enter valid positive numbers for height and weight.');
      return;
    }

    bmi = (weightLbs / (totalInches * totalInches)) * 703;
  }

  displayResult(bmi);
}

function displayResult(bmi) {
  const resultBox = document.getElementById('bmi-result');
  const scoreVal = document.getElementById('score-val');
  const badge = document.getElementById('category-badge');

  const roundedBMI = bmi.toFixed(1);
  scoreVal.textContent = roundedBMI;

  document.querySelectorAll('.range-zone').forEach(el => el.classList.remove('active-zone'));

  let category = '';
  let badgeClass = '';
  let activeZoneClass = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    badgeClass = 'badge-underweight';
    activeZoneClass = '.range-zone.underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal Weight';
    badgeClass = 'badge-normal';
    activeZoneClass = '.range-zone.normal';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    badgeClass = 'badge-overweight';
    activeZoneClass = '.range-zone.overweight';
  } else {
    category = 'Obese';
    badgeClass = 'badge-obese';
    activeZoneClass = '.range-zone.obese';
  }

  badge.textContent = category;
  badge.className = 'category-badge ' + badgeClass;

  const activeZone = document.querySelector(activeZoneClass);
  if (activeZone) {
    activeZone.classList.add('active-zone');
  }

  resultBox.classList.remove('hidden');
}