(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Burger
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');
  const body = document.body;
  const setMenu = (open) => {
    if (!burger || !mobileMenu) return;
    burger.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
    body.classList.toggle('no-scroll', open);
  };
  setMenu(false);
  burger?.addEventListener('click', () => {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  mobileMenu?.querySelectorAll('[data-close]').forEach((a) =>
    a.addEventListener('click', () => setMenu(false))
  );

  // Chat panel
  const chat = $('#chat');
  const chatBody = $('#chatBody');
  const chatToggle = $('#chatToggle');
  const chatGreeting = $('#chatGreeting');
  const closeBtn = $('#chatClose');

  const toggleChat = (force) => {
    if (!chat) return;
    const willOpen = force ?? chat.hasAttribute('hidden');
    if (willOpen) chat.removeAttribute('hidden');
    else chat.setAttribute('hidden', '');
    chatToggle?.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) chatGreeting?.classList.add('is-hidden');
  };
  chatToggle?.addEventListener('click', () => toggleChat());
  chatGreeting?.addEventListener('click', () => toggleChat(true));
  closeBtn?.addEventListener('click', () => toggleChat(false));

  setTimeout(() => {
    if (chat?.hasAttribute('hidden')) chatGreeting?.classList.remove('is-hidden');
  }, 1500);

  const answers = {
    trial: 'Пробных два: 1) бесплатно — 1,5 часа в действующей группе вашего уровня; 2) индивидуально — 1 час за 2 400 ₸. Перед уроком менеджер бесплатно подберёт группу. Оставьте номер ниже — свяжемся в течение дня. ✅',
    price: 'Групповые — 23 000 ₸/мес (3×/нед, 1,5 ч, до 6 чел). Парные — 30 000 ₸/мес (3×/нед, 1 ч). Индивидуально — от 42 400 ₸/мес. Учебники, пособия и бонусы уже внутри. Доступна рассрочка Kaspi. 💳',
    format: 'Онлайн на Zoom или Google Meet. Преподаватель видит вас, вы видите экран и материалы. Все занятия записываются и остаются у вас. Один уровень — около 3,5 месяцев, в конце финальный экзамен и сертификат. 🎓',
    ielts: 'Готовим к IELTS на персональном курсе под ваш целевой балл. Наши студенты сдавали на 6.0, 7.0 и выше — реальные скриншоты в разделе «Результаты». Пробный урок — бесплатно. ✍️',
    kids: 'Да, занимаемся со школьниками с младшего возраста. Подбираем учителя по характеру ребёнка и формат — групповой, парный или индивидуальный. Расскажите про возраст и уровень — менеджер подберёт.',
    kaspi: 'Да, рассрочка Kaspi доступна. Также можно платить помесячно — без долгого договора. Пакет учебников и бонусов входит в стоимость.',
  };

  const addMsg = (text, dir = 'in') => {
    if (!chatBody) return;
    const div = document.createElement('div');
    div.className = `chat__msg chat__msg--${dir}`;
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  $$('.chat__quick button').forEach((btn) =>
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      addMsg(btn.textContent, 'out');
      setTimeout(() => addMsg(answers[q] || '...'), 250);
    })
  );

  $$('[data-close-chat]').forEach((el) =>
    el.addEventListener('click', () => toggleChat(false))
  );
})();

// Lead form — local thank-you, no client-side bot calls (token must stay server-side)
function submitLead(ev) {
  ev.preventDefault();
  const f = ev.target;
  const fd = new FormData(f);
  const name = (fd.get('name') || '').toString().trim();
  const phone = (fd.get('phone') || '').toString().trim();
  if (!name || !phone) {
    f.reportValidity();
    return false;
  }
  const note = f.querySelector('.form__note');
  if (note) {
    note.textContent = `✓ Спасибо, ${name}! Менеджер Speak'n Go свяжется по ${phone} в течение дня.`;
    note.style.color = '#0F1A3D';
    note.style.fontWeight = '700';
  }
  const btn = f.querySelector('button[type="submit"]');
  if (btn) {
    btn.textContent = '✓ Заявка принята';
    btn.disabled = true;
    btn.style.background = '#0F1A3D';
  }
  f.querySelectorAll('input, select').forEach((el) => (el.disabled = true));
  return false;
}
