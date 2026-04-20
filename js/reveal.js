// === Scroll reveal + count-up animation ===
(function() {
  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children
        const i = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
        entry.target.style.transitionDelay = (Math.min(i, 6) * 0.07) + 's';
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // Count-up numbers
  const countEls = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => countObs.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Donut fill
  const donuts = document.querySelectorAll('.donut-fg');
  const donutObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pct = parseInt(entry.target.dataset.pct, 10);
        const circ = 314;
        entry.target.style.strokeDashoffset = circ - (circ * pct / 100);
        donutObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  donuts.forEach(el => donutObs.observe(el));
})();
