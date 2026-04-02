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
        connections: ['victoria-murphy', 'genevive-calib']
      },
      {
        id: 'victoria-murphy',
        email: 'victoria@ta.exchange',
        password: 'demo123',
        firstName: 'Victoria',
        lastName: 'Murphy',
        role: 'Leader',
        linkedin: 'https://www.linkedin.com/in/victoriamurphy/',
        avatar: 'https://taex007.wpenginepowered.com/wp-content/uploads/2022/01/1615530323697-300x300.jpeg',
        bio: 'Senior Talent Acquisition Leader with 15+ years of experience in global recruiting strategy.',
        company: 'Global Corp',
        title: 'VP, Talent Acquisition',
        joined: '2022-01-15',
        groups: ['ta-community', 'ta-leader', 'employer-branding'],
        connections: ['simon-valentine', 'genevive-calib']
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
        connections: ['simon-valentine', 'victoria-murphy']
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
      { id: 2, userId: 'victoria-murphy', type: 'post', group: 'ta-community', content: 'Great discussion in today\'s webinar about candidate experience metrics. Key takeaway: NPS alone isn\'t enough.', timestamp: Date.now() - 3600000 * 5, likes: 8, comments: [] },
      { id: 3, userId: 'simon-valentine', type: 'post', group: 'employer-branding', content: 'What EVP frameworks are you using in 2026? We\'re looking to refresh ours and want to benchmark.', timestamp: Date.now() - 3600000 * 24, likes: 15, comments: [] },
      { id: 4, userId: 'genevive-calib', type: 'post', group: 'talent-attraction', content: 'Has anyone had success with programmatic job advertising? Looking for platform recommendations.', timestamp: Date.now() - 3600000 * 48, likes: 6, comments: [] },
      { id: 5, userId: 'victoria-murphy', type: 'post', group: 'ta-manager', content: 'Reminder: Our monthly TA Manager roundtable is this Thursday. Topic: Hiring manager relationships.', timestamp: Date.now() - 3600000 * 72, likes: 20, comments: [] }
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
  const headerRight = session
    ? `<div class="header-user">
         <div class="header-avatar"><img src="${session.avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%235B5FC7%22/%3E%3Ctext x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2216%22%3E${session.name.charAt(0)}%3C/text%3E%3C/svg%3E'}" alt="${session.name}"></div>
         <span class="header-username">${session.name}</span>
         <div class="header-dropdown">
           <a href="profile.html?id=${session.userId}"><i class="fas fa-user"></i> My Profile</a>
           <a href="activity.html"><i class="fas fa-stream"></i> Activity</a>
           <a href="groups.html"><i class="fas fa-users"></i> Groups</a>
           <a href="members.html"><i class="fas fa-address-book"></i> Members</a>
           <hr>
           <a href="#" onclick="TAAuth.logout(); return false;"><i class="fas fa-sign-out-alt"></i> Log Out</a>
         </div>
       </div>`
    : `<a href="login.html" class="header-signin">Sign in</a>
       <a href="apply.html" class="header-signup">Sign up</a>`;

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
        ${headerRight}
      </div>
      <button class="mobile-toggle" onclick="document.querySelector('.main-nav').classList.toggle('open')"><i class="fas fa-bars"></i></button>
    </div>
  </header>`;
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
