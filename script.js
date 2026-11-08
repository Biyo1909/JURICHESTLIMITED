/* ========================================
   JURICHEST Limited – Web App Script
   Loading animation + Truck + Portal + Admin
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Page Loader (JURICHEST letter by letter) ----------
  createPageLoader();

  // Intercept internal navigation for loading effect
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      e.preventDefault();
      showPageLoader(() => {
        window.location.href = href;
      });
    });
  });

  // ---------- Header scroll ----------
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // ---------- Mobile menu ----------
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ---------- Toast ----------
  window.showToast = function (message, type = '') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'toast show' + (type ? ` ${type}` : '');
    setTimeout(() => toast.classList.remove('show'), 3200);
  };

  // ---------- Slideshow ----------
  const slider = document.getElementById('slider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let current = 0;
    let autoPlay;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slider.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    function startAuto() { autoPlay = setInterval(next, 4800); }
    function stopAuto() { clearInterval(autoPlay); }
    startAuto();
    slider.parentElement.addEventListener('mouseenter', stopAuto);
    slider.parentElement.addEventListener('mouseleave', startAuto);
  }

  // ---------- Customer Portal ----------
  const loginForm = document.getElementById('loginForm');
  const portalLogin = document.getElementById('portalLogin');
  const portalDashboard = document.getElementById('portalDashboard');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      if (!email) { showToast('Please enter your email or phone'); return; }

      const btn = loginForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
      btn.disabled = true;

      setTimeout(() => {
        portalLogin.classList.add('hidden');
        portalDashboard.classList.remove('hidden');
        const name = email.includes('@')
          ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
          : 'Customer';
        document.getElementById('dashboardUser').textContent = `${name} • Ikate / Kushenla area`;
        showToast('Welcome to your account', 'success');
        btn.innerHTML = original;
        btn.disabled = false;
        loginForm.reset();
      }, 900);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      portalDashboard.classList.add('hidden');
      portalLogin.classList.remove('hidden');
      showToast('You have been logged out');
    });
  }

  // Upload receipt
  const uploadReceiptBtn = document.getElementById('uploadReceiptBtn');
  const uploadArea = document.getElementById('uploadArea');
  const cancelUploadBtn = document.getElementById('cancelUploadBtn');
  const submitReceiptBtn = document.getElementById('submitReceiptBtn');

  if (uploadReceiptBtn && uploadArea) {
    uploadReceiptBtn.addEventListener('click', () => {
      uploadArea.classList.remove('hidden');
      uploadArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  if (cancelUploadBtn) {
    cancelUploadBtn.addEventListener('click', () => uploadArea.classList.add('hidden'));
  }
  if (submitReceiptBtn) {
    submitReceiptBtn.addEventListener('click', () => {
      const file = document.getElementById('receiptFile');
      if (!file || !file.files.length) {
        showToast('Please select a receipt file');
        return;
      }
      submitReceiptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      setTimeout(() => {
        showToast('Receipt submitted for verification', 'success');
        uploadArea.classList.add('hidden');
        submitReceiptBtn.innerHTML = 'Submit for Verification';
        file.value = '';
      }, 1100);
    });
  }

  // ---------- Contact Form ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      if (!name || !phone) {
        showToast('Please fill required fields');
        return;
      }
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      setTimeout(() => {
        showToast('Request received! We will contact you shortly.', 'success');
        contactForm.reset();
        btn.innerHTML = original;
        btn.disabled = false;
      }, 1000);
    });
  }

  // ---------- Admin ----------
  initAdmin();
});

/* ==================== PAGE LOADER ==================== */
function createPageLoader() {
  if (document.getElementById('pageLoader')) return;
  const loader = document.createElement('div');
  loader.id = 'pageLoader';
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-text" id="loaderText"></div>
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  `;
  document.body.appendChild(loader);

  // Type JURICHEST letter by letter
  const word = 'JURICHEST';
  const textEl = document.getElementById('loaderText');
  word.split('').forEach((letter, i) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.animationDelay = `${0.06 + i * 0.07}s`;
    textEl.appendChild(span);
  });

  // Hide after animation
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1600);
}

function showPageLoader(callback) {
  const loader = document.getElementById('pageLoader');
  if (!loader) {
    callback();
    return;
  }
  // Reset animation
  loader.classList.remove('hidden');
  const textEl = document.getElementById('loaderText');
  textEl.innerHTML = '';
  const word = 'JURICHEST';
  word.split('').forEach((letter, i) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.animationDelay = `${0.05 + i * 0.07}s`;
    textEl.appendChild(span);
  });
  // Restart bar
  const bar = loader.querySelector('.loader-bar-fill');
  bar.style.animation = 'none';
  bar.offsetHeight; // reflow
  bar.style.animation = 'loadBar 1.3s ease forwards';

  setTimeout(() => {
    callback();
  }, 1450);
}

/* ==================== ADMIN ==================== */
function initAdmin() {
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboard = document.getElementById('adminDashboard');
  const adminLogout = document.getElementById('adminLogout');

  let schedules = JSON.parse(localStorage.getItem('jurichest_schedules') || '[]');
  let customers = JSON.parse(localStorage.getItem('jurichest_customers') || '[]');

  // Seed realistic demo data for the actual areas
  if (schedules.length === 0) {
    schedules = [
      { id: 1, street: 'Kushenla Road', date: '2026-11-11', time: '08:00 – 13:00', status: 'Scheduled' },
      { id: 2, street: 'Ikate – Freedom Way (selected parts)', date: '2026-11-12', time: '09:00 – 14:00', status: 'Scheduled' },
      { id: 3, street: 'Folix Club Area', date: '2026-11-13', time: '08:00 – 12:30', status: 'Scheduled' },
      { id: 4, street: 'Ikate – selected streets', date: '2026-11-14', time: '08:30 – 14:00', status: 'Scheduled' },
    ];
    localStorage.setItem('jurichest_schedules', JSON.stringify(schedules));
  }
  if (customers.length === 0) {
    customers = [
      { id: 1, name: 'Adebayo Okonkwo', estate: 'Kushenla', balance: 18500, status: 'Pending' },
      { id: 2, name: 'Chioma Eze', estate: 'Ikate (selected)', balance: 0, status: 'Paid' },
      { id: 3, name: 'Tunde Bakare', estate: 'Folix Club Area', balance: 22000, status: 'Pending' },
      { id: 4, name: 'Fatima Hassan', estate: 'Ikate – Freedom Way', balance: 0, status: 'Paid' },
    ];
    localStorage.setItem('jurichest_customers', JSON.stringify(customers));
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('adminUser').value.trim();
      const pass = document.getElementById('adminPass').value;

      if (user === 'admin' && pass === 'jurichest2026') {
        const btn = adminLoginForm.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        setTimeout(() => {
          adminLoginView.classList.add('hidden');
          adminDashboard.classList.remove('hidden');
          renderAdminData();
          showToast('Welcome, Admin', 'success');
        }, 700);
      } else {
        showToast('Invalid credentials. Use admin / jurichest2026');
      }
    });
  }

  if (adminLogout) {
    adminLogout.addEventListener('click', () => {
      adminDashboard.classList.add('hidden');
      adminLoginView.classList.remove('hidden');
      showToast('Logged out of admin');
    });
  }

  const addScheduleForm = document.getElementById('addScheduleForm');
  if (addScheduleForm) {
    addScheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const street = document.getElementById('schedStreet').value.trim();
      const date = document.getElementById('schedDate').value;
      const time = document.getElementById('schedTime').value.trim();
      if (!street || !date || !time) {
        showToast('Please fill all schedule fields');
        return;
      }
      schedules.unshift({ id: Date.now(), street, date, time, status: 'Scheduled' });
      localStorage.setItem('jurichest_schedules', JSON.stringify(schedules));
      renderAdminData();
      addScheduleForm.reset();
      showToast('Collection schedule added', 'success');
    });
  }

  const updateBillForm = document.getElementById('updateBillForm');
  if (updateBillForm) {
    updateBillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerId = parseInt(document.getElementById('billCustomer').value);
      const amount = parseInt(document.getElementById('billAmount').value);
      const status = document.getElementById('billStatus').value;
      if (!customerId || isNaN(amount)) {
        showToast('Please select customer and enter amount');
        return;
      }
      const idx = customers.findIndex(c => c.id === customerId);
      if (idx > -1) {
        customers[idx].balance = amount;
        customers[idx].status = status;
        localStorage.setItem('jurichest_customers', JSON.stringify(customers));
        renderAdminData();
        updateBillForm.reset();
        showToast('Customer bill updated', 'success');
      }
    });
  }

  function renderAdminData() {
    const totalCustomers = customers.length;
    const pendingBills = customers.filter(c => c.status === 'Pending').length;
    const totalOwed = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
    const upcoming = schedules.length;

    const el = id => document.getElementById(id);
    if (el('statCustomers')) el('statCustomers').textContent = totalCustomers;
    if (el('statPending')) el('statPending').textContent = pendingBills;
    if (el('statOwed')) el('statOwed').textContent = '₦' + totalOwed.toLocaleString();
    if (el('statSchedules')) el('statSchedules').textContent = upcoming;

    const schedBody = document.getElementById('schedulesBody');
    if (schedBody) {
      schedBody.innerHTML = schedules.map(s => `
        <tr>
          <td>${s.street}</td>
          <td>${formatDate(s.date)}</td>
          <td>${s.time}</td>
          <td><span class="badge paid">${s.status}</span></td>
          <td>
            <button class="btn-icon danger" onclick="deleteSchedule(${s.id})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="5" style="text-align:center;color:#64748B;">No schedules yet</td></tr>';
    }

    const custBody = document.getElementById('customersBody');
    if (custBody) {
      custBody.innerHTML = customers.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.estate}</td>
          <td>₦${(c.balance || 0).toLocaleString()}</td>
          <td><span class="badge ${c.status === 'Paid' ? 'paid' : 'pending'}">${c.status}</span></td>
        </tr>
      `).join('');
    }

    const billSelect = document.getElementById('billCustomer');
    if (billSelect) {
      billSelect.innerHTML = '<option value="">Select customer</option>' +
        customers.map(c => `<option value="${c.id}">${c.name} – ${c.estate}</option>`).join('');
    }
  }

  window.deleteSchedule = function (id) {
    schedules = schedules.filter(s => s.id !== id);
    localStorage.setItem('jurichest_schedules', JSON.stringify(schedules));
    renderAdminData();
    showToast('Schedule removed');
  };

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
