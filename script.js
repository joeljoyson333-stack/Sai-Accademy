// ===== ADMIN MODE =====
let isAdmin = sessionStorage.getItem('sai_admin_mode') === 'true';

// Helper to apply admin state
function checkAdminState() {
  document.body.classList.toggle('admin-mode', isAdmin);
  const adminToggle = document.getElementById('adminToggle');
  if (adminToggle) {
    adminToggle.classList.toggle('active', isAdmin);
    adminToggle.textContent = isAdmin ? '🔓' : '🔒';
    adminToggle.title = isAdmin ? 'Admin Mode ON — Click to Logout' : 'Admin Login';
  }
  
  // Update admin-only elements visibility
  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(el => {
    // If it's a block-level action div or similar
    if (el.tagName === 'DIV' || el.tagName === 'BUTTON') {
       el.style.display = isAdmin ? 'block' : 'none';
    } else {
       el.style.display = isAdmin ? 'inline-block' : 'none';
    }
  });
  
  if (typeof renderAchievements === 'function') {
    renderAchievements();
  }
}

// ===== ACHIEVEMENTS DATA =====
let achievementsData = [
  { id: 1, score: '98%', name: 'Joel J.', detail: '12th Maths — State Board', year: '2025 Batch' },
  { id: 2, score: '96%', name: 'Karthik R.', detail: '10th Maths — State Board', year: '2025 Batch' },
  { id: 3, score: '95%', name: 'Ananya M.', detail: '12th Maths — State Board', year: '2024 Batch' },
  { id: 4, score: '94%', name: 'Ravi K.', detail: '10th Overall — All Subjects', year: '2024 Batch' },
  { id: 5, score: '97%', name: 'Sneha V.', detail: '10th Maths — State Board', year: '2025 Batch' },
  { id: 6, score: '93%', name: 'Arun D.', detail: '12th Maths — State Board', year: '2024 Batch' },
];

// Load saved data from localStorage
function loadAchievements() {
  const saved = localStorage.getItem('sai_academy_achievements');
  if (saved) {
    try {
      achievementsData = JSON.parse(saved);
    } catch (e) {
      // Use defaults
    }
  }
}

function saveAchievements() {
  localStorage.setItem('sai_academy_achievements', JSON.stringify(achievementsData));
}

// ===== RENDER ACHIEVEMENTS =====
function renderAchievements() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;

  grid.innerHTML = achievementsData.map((item, index) => `
    <div class="achievement-card antigravity-subtle" id="achievement-${item.id}" style="animation-delay: ${index * 0.3}s;">
      <div class="admin-only" style="display: ${isAdmin ? 'block' : 'none'}; position: absolute; top: 10px; right: 10px; z-index: 5;">
        <button class="achievement-edit-btn" onclick="toggleEditAchievement(${item.id})" style="position: static; display: inline-block; margin-right: 5px;">✏️ Edit</button>
        <button onclick="deleteAchievement(${item.id})" style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 12px; padding: 4px 12px; font-size: 0.72rem; color: #dc2626; cursor: pointer; font-weight: 600;">🗑️ Delete</button>
      </div>
      <div class="achievement-display">
        <div class="achievement-score">${item.score}</div>
        <h4 class="achievement-name">${item.name}</h4>
        <p class="achievement-detail">${item.detail}</p>
        <span class="achievement-year">${item.year}</span>
      </div>
      <div class="achievement-edit-form" id="edit-form-${item.id}">
        <label>Name</label>
        <input type="text" id="edit-name-${item.id}" value="${item.name}" />
        <label>Score</label>
        <input type="text" id="edit-score-${item.id}" value="${item.score}" />
        <label>Detail</label>
        <input type="text" id="edit-detail-${item.id}" value="${item.detail}" />
        <label>Year</label>
        <input type="text" id="edit-year-${item.id}" value="${item.year}" />
        <div class="achievement-edit-actions">
          <button class="edit-save-btn" onclick="saveEditAchievement(${item.id})">Save</button>
          <button class="edit-cancel-btn" onclick="cancelEditAchievement(${item.id})">Cancel</button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-apply fade-up to new cards
  addFadeUpClass();
  applyStagger();
  handleScrollReveal();
}

// ===== ACHIEVEMENT EDIT FUNCTIONS =====
function toggleEditAchievement(id) {
  const card = document.getElementById(`achievement-${id}`);
  if (card) {
    card.classList.toggle('editing');
  }
}

function saveEditAchievement(id) {
  const item = achievementsData.find(a => a.id === id);
  if (!item) return;

  item.name = document.getElementById(`edit-name-${id}`).value;
  item.score = document.getElementById(`edit-score-${id}`).value;
  item.detail = document.getElementById(`edit-detail-${id}`).value;
  item.year = document.getElementById(`edit-year-${id}`).value;

  saveAchievements();
  renderAchievements();
}

function cancelEditAchievement(id) {
  const card = document.getElementById(`achievement-${id}`);
  if (card) {
    card.classList.remove('editing');
  }
}

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const adminToggle = document.getElementById('adminToggle');

// ===== Admin Toggle =====
adminToggle.addEventListener('click', () => {
  if (isAdmin) {
    isAdmin = false;
    sessionStorage.removeItem('sai_admin_mode');
    checkAdminState();
  } else {
    openAdminLoginModal();
  }
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// ===== Close menu on link click =====
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.pageYOffset + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ===== Scroll Reveal Animation =====
function addFadeUpClass() {
  const elements = document.querySelectorAll(
    '.about-card, .course-card, .timing-card, .achievement-card, .contact-card, .section-header, .achievements-note, .contact-address'
  );

  elements.forEach(el => {
    if (!el.classList.contains('fade-up')) {
      el.classList.add('fade-up');
    }
  });
}

function handleScrollReveal() {
  const fadeElements = document.querySelectorAll('.fade-up');

  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight - 60) {
      el.classList.add('visible');
    }
  });
}

// ===== Stagger animation for grid items =====
function applyStagger() {
  const grids = document.querySelectorAll('.courses-grid, .achievements-grid, .contact-grid, .timings-grid');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.fade-up');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  checkAdminState();
  loadAchievements();
  renderAchievements();
  addFadeUpClass();
  applyStagger();
  handleScrollReveal();

  window.addEventListener('scroll', handleScrollReveal);
});

// ===== Close mobile menu on outside click =====
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('active') &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== ADMIN AUTHENTICATION =====
let captchaAnswer = 0;

function openAdminLoginModal() {
  document.getElementById('adminLoginModal').classList.add('active');
  document.getElementById('loginStep1').style.display = 'block';
  document.getElementById('loginStep2').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('adminEmail').value = '';
  document.getElementById('adminPassword').value = '';
}

function closeAdminLoginModal() {
  document.getElementById('adminLoginModal').classList.remove('active');
}

function handleLoginStep1() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('loginError');

  if (email === 'joeljoyson333@gmail.com' && password === 'admin123') {
    errorEl.style.display = 'none';
    document.getElementById('loginStep1').style.display = 'none';
    document.getElementById('loginStep2').style.display = 'block';
    
    // Generate CAPTCHA
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    document.getElementById('captchaMath').textContent = `${num1} + ${num2}`;
    document.getElementById('adminOTP').value = '';
    document.getElementById('adminCaptcha').value = '';
  } else {
    errorEl.textContent = 'Invalid email or password!';
    errorEl.style.display = 'block';
  }
}

function handleLoginStep2() {
  const otp = document.getElementById('adminOTP').value;
  const captcha = parseInt(document.getElementById('adminCaptcha').value);
  const errorEl = document.getElementById('loginError');

  if (otp === '1234' && captcha === captchaAnswer) {
    errorEl.style.display = 'none';
    closeAdminLoginModal();
    isAdmin = true;
    sessionStorage.setItem('sai_admin_mode', 'true');
    checkAdminState();
  } else {
    errorEl.textContent = 'Invalid OTP or CAPTCHA!';
    errorEl.style.display = 'block';
  }
}

// ===== NEW ACHIEVEMENT FUNCTIONS =====
function openAddAchievementModal() {
  document.getElementById('achievementModal').classList.add('active');
  document.getElementById('newAchName').value = '';
  document.getElementById('newAchScore').value = '';
  document.getElementById('newAchDetail').value = '';
  document.getElementById('newAchYear').value = '';
}

function closeAchievementModal() {
  document.getElementById('achievementModal').classList.remove('active');
}

function saveNewAchievement() {
  const name = document.getElementById('newAchName').value;
  const score = document.getElementById('newAchScore').value;
  const detail = document.getElementById('newAchDetail').value;
  const year = document.getElementById('newAchYear').value;

  if (!name || !score) {
    alert('Name and Score are required.');
    return;
  }

  const id = Date.now();
  achievementsData.unshift({ id, score, name, detail, year });

  saveAchievements();
  renderAchievements();
  closeAchievementModal();
}

function deleteAchievement(id) {
  if (confirm('Are you sure you want to delete this achievement?')) {
    achievementsData = achievementsData.filter(a => a.id !== id);
    saveAchievements();
    renderAchievements();
  }
}
