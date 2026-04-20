// === Keto macro calculator ===
(function() {
  const form = document.getElementById('calc-form');
  if (!form) return;

  const state = { weightUnit: 'kg', heightUnit: 'cm' };

  const age = form.querySelector('#c-age');
  const sex = form.querySelector('#c-sex');
  const wKg = form.querySelector('#c-weight');
  const wLb = form.querySelector('#c-weight-lb');
  const hCm = form.querySelector('#c-height');
  const hFt = form.querySelector('#c-height-ft');
  const hIn = form.querySelector('#c-height-in');
  const activity = form.querySelector('#c-activity');
  const goal = form.querySelector('#c-goal');

  const outCal = document.getElementById('r-cal');
  const outFat = document.getElementById('r-fat');
  const outPro = document.getElementById('r-pro');
  const outCarb = document.getElementById('r-carb');

  // Unit toggle behavior
  form.querySelectorAll('.unit-toggle').forEach(tog => {
    const type = tog.dataset.unit; // 'weight' or 'height'
    tog.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tog.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.val;

        // Sync converted value before switching
        if (type === 'weight') {
          if (val === 'lb' && state.weightUnit === 'kg') {
            wLb.value = Math.round((+wKg.value || 0) * 2.20462);
          } else if (val === 'kg' && state.weightUnit === 'lb') {
            wKg.value = Math.round((+wLb.value || 0) / 2.20462);
          }
          state.weightUnit = val;
        } else {
          if (val === 'ft' && state.heightUnit === 'cm') {
            const totalIn = (+hCm.value || 0) / 2.54;
            hFt.value = Math.floor(totalIn / 12);
            hIn.value = Math.round(totalIn % 12);
          } else if (val === 'cm' && state.heightUnit === 'ft') {
            const totalIn = (+hFt.value || 0) * 12 + (+hIn.value || 0);
            hCm.value = Math.round(totalIn * 2.54);
          }
          state.heightUnit = val;
        }

        // Show/hide inputs
        tog.closest('.calc-field').querySelectorAll('.input-wrap').forEach(w => {
          w.style.display = (w.dataset.show === val) ? '' : 'none';
        });

        calc();
      });
    });
  });

  function getWeightKg() {
    return state.weightUnit === 'kg'
      ? (+wKg.value || 0)
      : (+wLb.value || 0) / 2.20462;
  }
  function getHeightCm() {
    return state.heightUnit === 'cm'
      ? (+hCm.value || 0)
      : ((+hFt.value || 0) * 12 + (+hIn.value || 0)) * 2.54;
  }

  function calc() {
    const a = +age.value || 30;
    const w = getWeightKg() || 70;
    const h = getHeightCm() || 170;
    const s = sex.value;
    const act = +activity.value;
    const g = goal.value;

    let bmr = 10 * w + 6.25 * h - 5 * a + (s === 'male' ? 5 : -161);
    let tdee = bmr * act;

    if (g === 'lose') tdee *= 0.8;
    else if (g === 'gain') tdee *= 1.1;

    const fatCal = tdee * 0.75;
    const proCal = tdee * 0.20;
    const carbCal = tdee * 0.05;

    outCal.textContent = Math.round(tdee);
    outFat.textContent = Math.round(fatCal / 9);
    outPro.textContent = Math.round(proCal / 4);
    outCarb.textContent = Math.round(carbCal / 4);
  }

  form.addEventListener('input', calc);
  calc();
})();
