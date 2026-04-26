/* ===== TA Exchange Auth System (localStorage) ===== */
const TAAuth = (() => {
  const STORAGE_KEY = 'taex_users';
  const SESSION_KEY = 'taex_session';

  // Seed demo users on first load
  function seedDemoUsers() {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const demoUsers = [
      {
        id: 'simon-valentine',
        email: 'simon@ta.exchange',
        password: 'demo123',
        firstName: 'Simon',
        lastName: 'Valentine',
        role: 'Leader',
        linkedin: 'https://www.linkedin.com/in/simoncvalentine/',
        avatar: 'https://taex007.wpenginepowered.com/wp-content/uploads/2022/01/IMG_5290.jpg',
        bio: 'Founder of TA Exchange. Passionate about building communities that help Talent Acquisition professionals grow.',
        company: 'TA Exchange',
        title: 'Founder',
        joined: '2021-12-01',
        groups: ['ta-community', 'ta-manager', 'ta-leader', 'ta-now', 'employer-branding', 'talent-attraction'],
        connections: ['genevive-calib']
      },
      {
        id: 'genevive-calib',
        email: 'genevive@ta.exchange',
        password: 'demo123',
        firstName: 'Genevive',
        lastName: 'Calib',
        role: 'Individual Contributor',
        linkedin: 'https://www.linkedin.com/in/genevivecalib/',
        avatar: '',
        bio: 'Talent Acquisition Specialist passionate about candidate experience and employer branding.',
        company: 'Tech Innovations',
        title: 'Senior Recruiter',
        joined: '2022-03-10',
        groups: ['ta-community', 'ta-now', 'talent-attraction'],
        connections: ['simon-valentine']
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  }

  function getUsers() {
    seedDemoUsers();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      const session = { userId: user.id, email: user.email, name: user.firstName + ' ' + user.lastName, avatar: user.avatar, loggedInAt: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password.' };
  }

  function register(data) {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const id = (data.firstName + '-' + data.lastName).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newUser = {
      id,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'Individual Contributor',
      linkedin: data.linkedin || '',
      avatar: '',
      bio: '',
      company: '',
      title: '',
      joined: new Date().toISOString().split('T')[0],
      groups: ['ta-community'],
      connections: []
    };
    users.push(newUser);
    saveUsers(users);
    // Auto login
    const session = { userId: newUser.id, email: newUser.email, name: newUser.firstName + ' ' + newUser.lastName, avatar: newUser.avatar, loggedInAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: newUser };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  function getSession() {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const users = getUsers();
    return users.find(u => u.id === session.userId) || null;
  }

  function getUserById(id) {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
  }

  function getAllMembers() {
    return getUsers();
  }

  function updateProfile(id, updates) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    Object.assign(users[idx], updates);
    saveUsers(users);
    return true;
  }

  function requireAuth() {
    if (!getSession()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
      return false;
    }
    return true;
  }

  function isLoggedIn() {
    return !!getSession();
  }

  // Initialize
  seedDemoUsers();

  return { login, register, logout, getSession, getCurrentUser, getUserById, getAllMembers, updateProfile, requireAuth, isLoggedIn };
})();

/* ===== Groups Data ===== */
const TAGroups = [
  {
    id: 'ta-community',
    name: 'TA Community',
    tag: 'Individual',
    image: 'https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/businext-img29.jpg',
    description: 'A community for individual contributors in Talent Acquisition to share knowledge, ask questions, and grow together.',
    memberCount: 247,
    topics: 42,
    created: '2021-12-01'
  },
  {
    id: 'ta-manager',
    name: 'TA Manager Community',
    tag: 'Management',
    image: 'https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/businext-img27.jpg',
    description: 'For TA Managers looking to develop their leadership skills, share best practices, and connect with peers.',
    memberCount: 156,
    topics: 31,
    created: '2021-12-01'
  },
  {
    id: 'ta-leader',
    name: 'TA Leader Community',
    tag: 'Leaders',
    image: 'https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/businext-img28.jpg',
    description: 'An exclusive group for senior Talent Acquisition leaders to discuss strategy, transformation, and industry trends.',
    memberCount: 89,
    topics: 24,
    created: '2021-12-01'
  },
  {
    id: 'ta-now',
    name: 'TA for NOW',
    tag: 'For All',
    image: 'https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/businext-img32.jpg',
    description: 'Stay current with real-time discussions about what\'s happening in Talent Acquisition right now.',
    memberCount: 312,
    topics: 67,
    created: '2022-01-15'
  },
  {
    id: 'employer-branding',
    name: 'Employer Branding',
    tag: 'For All',
    image: 'https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/businext-img30.jpg',
    description: 'Dedicated to employer branding strategies, employee value propositions, and building compelling talent brands.',
    memberCount: 198,
    topics: 38,
    created: '2022-01-15'
  },
  {
    id: 'talent-attraction',
    name: 'Talent Attraction',
    tag: 'For All',
    image: 'https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/businext-img31.jpg',
    description: 'Explore sourcing strategies, candidate engagement techniques, and innovative approaches to attracting top talent.',
    memberCount: 223,
    topics: 45,
    created: '2022-02-01'
  }
];

/* ===== Activity Feed Data ===== */
const TAActivity = {
  getItems() {
    const stored = localStorage.getItem('taex_activity');
    if (stored) return JSON.parse(stored);
    const defaults = [
      { id: 1, userId: 'simon-valentine', type: 'post', group: 'ta-leader', content: 'Just published a new article on the future of AI in recruitment. Would love to hear your thoughts!', timestamp: Date.now() - 3600000 * 2, likes: 12, comments: [] },
      { id: 3, userId: 'simon-valentine', type: 'post', group: 'employer-branding', content: 'What EVP frameworks are you using in 2026? We\'re looking to refresh ours and want to benchmark.', timestamp: Date.now() - 3600000 * 24, likes: 15, comments: [] },
      { id: 4, userId: 'genevive-calib', type: 'post', group: 'talent-attraction', content: 'Has anyone had success with programmatic job advertising? Looking for platform recommendations.', timestamp: Date.now() - 3600000 * 48, likes: 6, comments: [] }
    ];
    localStorage.setItem('taex_activity', JSON.stringify(defaults));
    return defaults;
  },
  addPost(userId, group, content) {
    const items = this.getItems();
    const newItem = { id: Date.now(), userId, type: 'post', group, content, timestamp: Date.now(), likes: 0, comments: [] };
    items.unshift(newItem);
    localStorage.setItem('taex_activity', JSON.stringify(items));
    return newItem;
  },
  likePost(postId) {
    const items = this.getItems();
    const post = items.find(i => i.id === postId);
    if (post) { post.likes++; localStorage.setItem('taex_activity', JSON.stringify(items)); }
    return post;
  },
  addComment(postId, userId, text) {
    const items = this.getItems();
    const post = items.find(i => i.id === postId);
    if (post) {
      post.comments.push({ userId, text, timestamp: Date.now() });
      localStorage.setItem('taex_activity', JSON.stringify(items));
    }
    return post;
  }
};

/* ===== Shared Header Rendering ===== */
function renderHeader(activePage) {
  const session = TAAuth.getSession();

  // If logged in, show BuddyBoss-style header
  if (session) {
    const user = TAAuth.getCurrentUser();
    const avatarFallback = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#535EE0"/><text x="20" y="26" text-anchor="middle" fill="white" font-size="16">' + session.name.charAt(0) + '</text></svg>');
    const avatarSrc = session.avatar || avatarFallback;
    const userName = session.name;
    const userId = session.userId;

    // Add logged-in class to body
    document.body.classList.add('bb-logged-in');

    return `<header class="header">
      <div class="container">
        <a href="index.html" class="bb-header-logo"><img src="https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/talogosmallv200.png" alt="TA Exchange"></a>
        <div class="bb-header-right">
          <a href="#" class="bb-header-btn" title="Search"><i class="fas fa-search"></i></a>
          <div class="bb-header-sep"></div>
          <a href="#" class="bb-header-btn" title="Messages"><i class="far fa-comment-dots"></i><span class="bb-header-badge">1</span></a>
          <a href="#" class="bb-header-btn" title="Notifications"><i class="far fa-bell"></i><span class="bb-header-badge">9</span></a>
          <div class="bb-user-wrap">
            <span class="bb-user-name">${userName}</span>
            <div class="bb-user-avatar"><img src="${avatarSrc}" alt="${userName}"></div>
            <div class="bb-user-dropdown">
              <div class="bb-user-dropdown-header">
                <div class="avatar-sm"><img src="${avatarSrc}" alt="${userName}"></div>
                <div class="bb-user-dropdown-info">
                  <div class="name">${userName}</div>
                  <div class="handle">@${userName.replace(/\s+/g, '')}</div>
                </div>
              </div>
              <div class="bb-user-dropdown-nav">
                <a href="profile.html?id=${userId}"><i class="fas fa-user"></i> Profile</a>
                <a href="profile.html?id=${userId}"><i class="fas fa-cog"></i> Account</a>
                <div class="divider"></div>
                <a href="activity.html"><i class="fas fa-stream"></i> Timeline</a>
                <a href="#"><i class="fas fa-bell"></i> Notifications</a>
                <a href="#"><i class="fas fa-envelope"></i> Messages</a>
                <div class="divider"></div>
                <a href="#"><i class="fas fa-user-friends"></i> Connections</a>
                <a href="groups.html"><i class="fas fa-users"></i> Groups</a>
                <a href="#"><i class="fas fa-graduation-cap"></i> Courses</a>
                <a href="#"><i class="fas fa-comments"></i> Forums</a>
                <div class="divider"></div>
                <a href="#"><i class="fas fa-paper-plane"></i> Email Invites</a>
                <a href="#" onclick="TAAuth.logout(); return false;"><i class="fas fa-sign-out-alt"></i> Log Out</a>
              </div>
            </div>
          </div>
        </div>
        <button class="mobile-toggle" onclick="toggleBuddyPanel()"><i class="fas fa-bars"></i></button>
      </div>
    </header>`;
  }

  // Logged-out: public header
  return `<header class="header">
    <div class="container">
      <a href="index.html" class="logo"><img src="https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/talogosmallv200.png" alt="TA Exchange"></a>
      <nav class="main-nav">
        <a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a>
        <a href="about.html" ${activePage==='about'?'class="active"':''}>About</a>
        <a href="groups.html" ${activePage==='groups'?'class="active"':''}>Groups</a>
        <a href="articles.html" ${activePage==='articles'?'class="active"':''}>Articles</a>
        <a href="members.html" ${activePage==='members'?'class="active"':''}>Members</a>
        <a href="contact.html" ${activePage==='contact'?'class="active"':''}>Contact</a>
      </nav>
      <div class="header-right">
        <i class="fas fa-search search-icon"></i>
        <a href="login.html" class="header-signin">Sign in</a>
        <a href="apply.html" class="header-signup">Sign up</a>
      </div>
      <button class="mobile-toggle" onclick="document.querySelector('.main-nav').classList.toggle('open')"><i class="fas fa-bars"></i></button>
    </div>
  </header>`;
}

/* ===== BuddyPanel Sidebar (Logged-In) ===== */
function renderSidebar(activePage) {
  if (!TAAuth.isLoggedIn()) return '';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large', href: 'groups.html' },
    { id: 'groups', label: 'Groups', icon: 'fas fa-users', href: 'groups.html' },
    { id: 'forums', label: 'Forums', icon: 'far fa-comment', href: '#' },
    { id: 'members', label: 'Members', icon: 'fas fa-user-friends', href: 'members.html' },
    { id: 'products', label: 'TA Products', icon: 'fas fa-desktop', href: '#' },
    { id: 'services', label: 'TA Services', icon: 'fas fa-file-alt', href: '#' },
    { id: 'tools', label: 'TA Tools', icon: 'fas fa-tools', href: '#' },
    { id: 'articles', label: 'Articles', icon: 'fas fa-align-left', href: 'articles.html' },
    { id: 'add-listing', label: 'Add TA Listing', icon: '', href: '#', isTAIcon: true },
    { id: 'courses', label: 'Webinars & Courses', icon: 'fas fa-video', href: '#' },
    { id: 'help', label: 'Help', icon: 'fas fa-question-circle', href: '#' }
  ];

  const menuHTML = menuItems.map(item => {
    const activeClass = activePage === item.id ? ' active' : '';
    const iconHTML = item.isTAIcon
      ? '<span class="ta-icon">ta</span>'
      : '<i class="' + item.icon + '"></i>';
    return '<li><a href="' + item.href + '" class="' + activeClass + '">' + iconHTML + ' ' + item.label + '</a></li>';
  }).join('');

  return '<aside class="buddypanel">' +
    '<div class="panel-head">' +
      '<button class="panel-toggle" onclick="toggleBuddyPanel()" title="Toggle sidebar"><i class="fas fa-th-large"></i></button>' +
      '<a href="index.html" class="panel-logo"><img src="https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/cropped-talogo-v2F-150x150.png" alt="TA Exchange"></a>' +
    '</div>' +
    '<ul class="buddypanel-menu">' + menuHTML + '</ul>' +
  '</aside>' +
  '<div class="bb-panel-overlay" onclick="toggleBuddyPanel()"></div>';
}

function toggleBuddyPanel() {
  var panel = document.querySelector('.buddypanel');
  var overlay = document.querySelector('.bb-panel-overlay');
  if (panel) {
    panel.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  }
}

/* ===== Initialize Logged-In Layout ===== */
function initBuddyLayout(activePage) {
  var sidebarHTML = renderSidebar(activePage);
  if (sidebarHTML) {
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
  }
}

function renderFooter() {
  return `<footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo"><img src="https://taex007.wpenginepowered.com/wp-content/uploads/2021/12/talogosmallv-white.png" alt="TA Exchange"></a>
          <p>Leading the way in Talent Acquisition. Join the community shaping the future of recruitment.</p>
          <div class="footer-social">
            <a href="https://www.linkedin.com/company/thetalentacquisitionexchange/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-facebook-f"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <h4>Quick Links</h4>
          <a href="about.html">About Us</a>
          <a href="groups.html">Groups</a>
          <a href="articles.html">Articles</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-links">
          <h4>Resources</h4>
          <a href="faq.html">FAQ</a>
          <a href="testimonials.html">Testimonials</a>
          <a href="careers.html">Careers</a>
          <a href="help.html">Help</a>
        </div>
        <div class="footer-links">
          <h4>Legal</h4>
          <a href="terms.html">Terms of Service</a>
          <a href="privacy.html">Privacy Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 - Talent Acquisition Exchange</p>
      </div>
    </div>
  </footer>`;
}

/* ===== Utility Functions ===== */
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  return new Date(timestamp).toLocaleDateString();
}

function getInitials(name) {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
}

function avatarHTML(user, size) {
  size = size || 40;
  if (user && user.avatar) {
    return `<img src="${user.avatar}" alt="${user.firstName}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
  }
  const name = user ? user.firstName + ' ' + user.lastName : '?';
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:${size*0.4}px;">${getInitials(name)}</div>`;
}
