/* =========================================================
   1. LOGIC GATES & FLIP-FLOP ENGINE
   ========================================================= */

// State tracking for all interactive circuits
const gates = {
  and: { a: 0, b: 0, q: 0 },
  or:  { a: 0, b: 0, q: 0 },
  xor: { a: 0, b: 0, q: 0 },
  not: { a: 0, q: 1 },
  ff:  { a: 0, b: 0, q: 0 } // Upper (a) sets to 1, Lower (b) sets to 0
};

/**
 * Toggle gate input bit when clicking buttons
 * @param {string} gateKey - 'and', 'or', 'xor', 'not', or 'ff'
 * @param {string} inputPin - 'a' or 'b'
 */
function toggleGate(gateKey, inputPin) {
  const gate = gates[gateKey];
  if (!gate) return;

  // Toggle input value (0 <-> 1)
  gate[inputPin] = gate[inputPin] === 0 ? 1 : 0;

  // Evaluate basic logic gate outputs
  if (gateKey === 'and') gate.q = gate.a & gate.b;
  if (gateKey === 'or')  gate.q = gate.a | gate.b;
  if (gateKey === 'xor') gate.q = gate.a ^ gate.b;
  if (gateKey === 'not') gate.q = gate.a === 0 ? 1 : 0;

  // Evaluate Brookshear Flip-Flop logic
  if (gateKey === 'ff') {
    const inputA = gate.a; // Upper Input
    const inputB = gate.b; // Lower Input

    // Temporarily setting Upper Input (A) = 1 forces Output = 1
    if (inputA === 1) {
      gate.q = 1;
    }
    // Temporarily setting Lower Input (B) = 1 forces Output = 0
    if (inputB === 1) {
      gate.q = 0;
    }
    // If A = 0 and B = 0, state stays unchanged (Latched / Stored value)
  }

  // Refresh visual elements (wires, text, buttons)
  updateSVG(gateKey);
}

/**
 * Helper function to set SVG wire CSS active classes
 */
function setWire(wireId, state, isCyan = false) {
  const el = document.getElementById(wireId);
  if (!el) return;

  if (state === 1) {
    el.classList.add(isCyan ? 'cyan-active' : 'active');
  } else {
    el.classList.remove('active', 'cyan-active');
  }
}

/**
 * Updates SVG wires, button states, and label texts for a given circuit
 */
function updateSVG(key) {
  const g = gates[key];
  if (!g) return;

  if (key === 'not') {
    setWire('not-wire-a', g.a);
    setWire('not-wire-out', g.q, true);

    const lblA = document.getElementById('not-lbl-a');
    const lblOut = document.getElementById('not-lbl-out');
    if (lblA) lblA.textContent = g.a;
    if (lblOut) lblOut.textContent = g.q;

    const btnA = document.getElementById('not-btn-a');
    if (btnA) {
      btnA.textContent = g.a;
      btnA.classList.toggle('active', g.a === 1);
    }

    const valOut = document.getElementById('not-val-out');
    if (valOut) {
      valOut.textContent = g.q;
      valOut.classList.toggle('active', g.q === 1);
    }

  } else if (key === 'ff') {
    // Determine intermediate values inside flip flop circuit
    const notVal = g.b === 0 ? 1 : 0;
    const orVal = (g.a === 1 || g.q === 1) ? 1 : 0;

    setWire('ff-wire-a', g.a);
    setWire('ff-wire-b', g.b);
    setWire('ff-wire-not-out', notVal);
    setWire('ff-wire-or-out', orVal);
    setWire('ff-wire-feedback', g.q, true);
    setWire('ff-wire-out', g.q, true);

    const lblA = document.getElementById('ff-lbl-a');
    const lblB = document.getElementById('ff-lbl-b');
    const lblOut = document.getElementById('ff-lbl-out');
    if (lblA) lblA.textContent = g.a;
    if (lblB) lblB.textContent = g.b;
    if (lblOut) lblOut.textContent = g.q;

    const btnA = document.getElementById('ff-btn-a');
    const btnB = document.getElementById('ff-btn-b');
    if (btnA) {
      btnA.textContent = g.a;
      btnA.classList.toggle('active', g.a === 1);
    }
    if (btnB) {
      btnB.textContent = g.b;
      btnB.classList.toggle('active', g.b === 1);
    }

    const stateTxt = document.getElementById('ff-state-txt');
    if (stateTxt) {
      stateTxt.textContent = g.q;
      stateTxt.className = `out-status ${g.q === 1 ? 'active' : ''}`;
    }

  } else {
    // Standard 2-input gates (AND, OR, XOR)
    setWire(`${key}-wire-a`, g.a);
    setWire(`${key}-wire-b`, g.b);
    setWire(`${key}-wire-out`, g.q, true);

    const lblA = document.getElementById(`${key}-lbl-a`);
    const lblB = document.getElementById(`${key}-lbl-b`);
    const lblOut = document.getElementById(`${key}-lbl-out`);
    if (lblA) lblA.textContent = g.a;
    if (lblB) lblB.textContent = g.b;
    if (lblOut) lblOut.textContent = g.q;

    const btnA = document.getElementById(`${key}-btn-a`);
    const btnB = document.getElementById(`${key}-btn-b`);
    if (btnA) {
      btnA.textContent = g.a;
      btnA.classList.toggle('active', g.a === 1);
    }
    if (btnB) {
      btnB.textContent = g.b;
      btnB.classList.toggle('active', g.b === 1);
    }

    const valOut = document.getElementById(`${key}-val-out`);
    if (valOut) {
      valOut.textContent = g.q;
      valOut.classList.toggle('active', g.q === 1);
    }
  }
}

/* =========================================================
   2. BMI CALCULATOR ENGINE
   ========================================================= */

function switchUnit(unit) {
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
}

function calculateBMI(event) {
  event.preventDefault();

  const isMetric = document.getElementById('btn-metric').classList.contains('active');
  let bmi = 0;

  if (isMetric) {
    const heightCm = parseFloat(document.getElementById('height-cm').value);
    const weightKg = parseFloat(document.getElementById('weight-kg').value);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      alert('Please enter valid height and weight values.');
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
      alert('Please enter valid height and weight values.');
      return;
    }

    bmi = (703 * weightLbs) / (totalInches * totalInches);
  }

  // Display results
  const resultBox = document.getElementById('bmi-result');
  const scoreVal = document.getElementById('score-val');
  const badge = document.getElementById('category-badge');

  const formattedBMI = bmi.toFixed(1);
  scoreVal.textContent = formattedBMI;

  badge.className = 'category-badge';

  if (bmi < 18.5) {
    badge.textContent = 'Underweight';
    badge.classList.add('underweight');
  } else if (bmi >= 18.5 && bmi < 25) {
    badge.textContent = 'Normal weight';
    badge.classList.add('normal');
  } else if (bmi >= 25 && bmi < 30) {
    badge.textContent = 'Overweight';
    badge.classList.add('overweight');
  } else {
    badge.textContent = 'Obese';
    badge.classList.add('obese');
  }

  resultBox.classList.remove('hidden');
}

/* Initialize all diagrams when DOM loads */
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(gates).forEach(key => updateSVG(key));
});
