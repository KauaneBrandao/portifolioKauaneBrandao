const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

function applyTheme(t) {
  body.setAttribute('data-theme', t);
  themeIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('theme', t);
}

applyTheme(localStorage.getItem('theme') || 'light');

themeBtn.addEventListener('click', () => {
  applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  document.getElementById('backTop')
    .classList.toggle('show', window.scrollY > 400);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navLinks.forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* voltar */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/*contato*/
const form    = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const formMsg = document.getElementById('formMsg');

function setErr(id, msg) {
  const el = document.getElementById(id + '-err');
  const inp = document.getElementById(id);
  if (el) el.textContent = msg;
  if (inp) inp.classList.toggle('err-input', !!msg);
}
function clearErrs() {
  ['nome','email','mensagem'].forEach(id => setErr(id, ''));
  formMsg.className = 'form-msg';
  formMsg.textContent = '';
}

const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrs();

  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  let ok = true;

  if (!nome)              { setErr('nome', 'Informe seu nome.');           ok = false; }
  if (!email)             { setErr('email', 'Informe seu e-mail.');        ok = false; }
  else if (!validEmail(email)) { setErr('email', 'E-mail inválido.');      ok = false; }
  if (!mensagem)          { setErr('mensagem', 'Escreva uma mensagem.');   ok = false; }

  if (!ok) return;


  sendBtn.disabled = true;
  sendBtn.querySelector('.send-text').style.display  = 'none';
  sendBtn.querySelector('.send-loading').style.display = 'flex';

  await new Promise(r => setTimeout(r, 1600));

  sendBtn.disabled = false;
  sendBtn.querySelector('.send-text').style.display  = 'flex';
  sendBtn.querySelector('.send-loading').style.display = 'none';

  form.reset();
  formMsg.className = 'form-msg success';
  formMsg.innerHTML = '<i class="fa-solid fa-check-circle"></i> Mensagem enviada! Retornarei em breve.';
  setTimeout(() => { formMsg.className = 'form-msg'; }, 5000);
});

// validar
['nome','email','mensagem'].forEach(id => {
  document.getElementById(id)?.addEventListener('blur', () => {
    const v = document.getElementById(id).value.trim();
    setErr(id, '');
    if (!v) return;
    if (id === 'email' && !validEmail(v)) setErr('email', 'E-mail inválido.');
  });
});