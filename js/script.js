/* VOID STUDIO · v13 interactions */
document.addEventListener('DOMContentLoaded', () => {
  const supportsFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const navbar = document.querySelector('.void-nav');
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     1. Custom cursor — restored directly from the early working version
     ---------------------------------------------------------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) {
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    }
    const hover = e.target.closest('a, button, .hover-target, input, textarea, select');
    document.body.classList.toggle('cursor-hover', !!hover);
  });

  function rafCursor(){
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    if (ring) {
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(rafCursor);
  }
  rafCursor();

  /* ----------------------------------------------------------
     2. Reveal on scroll
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal], .line-reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: .14 });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ----------------------------------------------------------
     3. Kinetic image switch
     ---------------------------------------------------------- */
  document.querySelectorAll('.kinetic').forEach(kinetic => {
    const steps = [...kinetic.querySelectorAll('.kinetic-step')];
    const imgs = [...kinetic.querySelectorAll('.kinetic-img')];
    const caption = kinetic.querySelector('.kinetic-caption');
    const progress = kinetic.querySelector('.kinetic-progress span');
    function setActive(i){
      steps.forEach((s,idx)=>s.classList.toggle('is-active', idx===i));
      imgs.forEach((img,idx)=>img.classList.toggle('is-active', idx===i));
      if(caption && steps[i]) caption.textContent = steps[i].dataset.caption || '';
      if(progress && steps.length) progress.style.height = ((i+1)/steps.length*100) + '%';
    }
    steps.forEach((step, i) => {
      step.setAttribute('role', 'button');
      step.setAttribute('tabindex', '0');
      step.classList.add('cursor-react');
      step.addEventListener('click', () => setActive(i));
      step.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          setActive(i);
        }
      });
    });
    setActive(0);
  });

  /* ----------------------------------------------------------
     4. Project hover preview image
     ---------------------------------------------------------- */
  const hoverImg = document.querySelector('.project-hover-img');
  if (hoverImg) {
    const img = hoverImg.querySelector('img');
    document.querySelectorAll('.project-row[data-img]').forEach(row => {
      row.addEventListener('mouseenter', () => {
        img.src = row.dataset.img;
        hoverImg.style.opacity = '1';
        hoverImg.style.transform = 'translate(-50%,-50%) scale(1)';
      });
      row.addEventListener('mouseleave', () => {
        hoverImg.style.opacity = '0';
        hoverImg.style.transform = 'translate(-50%,-50%) scale(.94)';
      });
      row.addEventListener('mousemove', e => {
        hoverImg.style.left = e.clientX + 28 + 'px';
        hoverImg.style.top = e.clientY + 10 + 'px';
      });
    });
  }

  /* ----------------------------------------------------------
     5. Project filters
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('btn-blue'));
      btn.classList.add('btn-blue');
      document.querySelectorAll('[data-category]').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    }));
  }

  /* ----------------------------------------------------------
     6. Magnetic controls — restored, but only on buttons/links, not image panels
     ---------------------------------------------------------- */
  if (supportsFinePointer) {
    const magnetic = document.querySelectorAll('.btn-void, .nav-cta, .hero-v9-view, .hero-v9-project-card a, .nav-pill .nav-link, .hero-v9-toplinks a');
    magnetic.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
        btn.style.transition = 'transform 90ms linear';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform 460ms cubic-bezier(.2,.8,.2,1)';
      });
    });
  }
});
