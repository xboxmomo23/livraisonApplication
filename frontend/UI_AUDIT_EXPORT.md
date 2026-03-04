# Audit UI - HealDrive

## 1) Fichiers contenant les éléments demandés

- Formulaires Login/Register (HTML des formulaires):
  - `/home/nadir/SanteeApplication/frontend/app.js` (dans `renderLogin` via template string)
- CSS global principal:
  - `/home/nadir/SanteeApplication/frontend/style.css`
- Logique de navigation (routeur):
  - `/home/nadir/SanteeApplication/frontend/app.js` (`const routes`, `navigate`, `handleRoute`)
- Fonctions d'affichage Dashboard Patient/Chauffeur:
  - `/home/nadir/SanteeApplication/frontend/app.js` (`renderPatientDashboard`, `renderChauffeurDashboard`)

---

## 2) Code complet de `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0070c4">
    <title>HealDrive — Transport Médical Connecté</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50:  '#f0f7ff',
                            100: '#e0effe',
                            200: '#b9dffc',
                            300: '#7cc5fa',
                            400: '#36a9f5',
                            500: '#0c8ee6',
                            600: '#0070c4',
                            700: '#01599f',
                            800: '#064c83',
                            900: '#0b406d',
                        },
                        coral:  { 400: '#f87171', 500: '#ef4444' },
                        mint:   { 400: '#34d399', 500: '#10b981' },
                        sand:   { 50: '#fdfcfa', 100: '#f8f5f0', 200: '#f0ebe2' },
                    },
                    fontFamily: {
                        display: ['"DM Serif Display"', 'Georgia', 'serif'],
                        body:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Custom Styles -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="font-body bg-sand-50 text-gray-800 min-h-screen antialiased">

    <!-- ===== TOP NAVBAR ===== -->
    <nav id="navbar" class="hidden fixed top-0 left-0 right-0 z-50 navbar-glass">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a id="nav-home-link" href="#/dashboard" class="flex items-center gap-2.5 group">
                <div class="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <i data-lucide="heart-pulse" class="w-5 h-5 text-white"></i>
                </div>
                <span class="font-display text-xl text-brand-900 tracking-tight">HealDrive</span>
            </a>
            <div id="nav-user" class="flex items-center gap-4">
                <span id="nav-role-badge" class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full hidden sm:inline"></span>
                <span id="nav-username" class="text-sm font-medium text-brand-800 hidden sm:inline"></span>
                <button id="btn-notif" class="relative p-2 rounded-lg hover:bg-brand-100/60 transition-colors">
                    <i data-lucide="bell" class="w-5 h-5 text-brand-700"></i>
                    <span id="notif-badge" class="notif-badge absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
                </button>
                <div class="h-6 w-px bg-brand-200"></div>
                <button id="btn-logout" class="flex items-center gap-2 text-sm text-gray-500 hover:text-coral-500 transition-colors font-medium">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    <span class="hidden sm:inline">Déconnexion</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- ===== MAIN CONTENT ===== -->
    <main id="app-content" class="transition-opacity duration-300"></main>

    <!-- ===== TOAST CONTAINER ===== -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"></div>

    <script src="app.js"></script>
</body>
</html>```

---

## 3) Code complet du CSS principal (`style.css`)

```css
/* ============================================================
   HealDrive — ADDITIONS: Chauffeur Dashboard + Chat
   ============================================================ */

/* ---------- Course Card (Chauffeur) ---------- */
.course-card {
    background: #fff;
    border: 1.5px solid rgba(0,0,0,.05);
    border-radius: var(--radius-xl);
    padding: 20px 24px;
    transition: var(--transition-smooth);
    position: relative;
    overflow: hidden;
}

.course-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    border-radius: 4px 0 0 4px;
    background: var(--brand-600);
    opacity: 0;
    transition: opacity .25s ease;
}

.course-card:hover {
    border-color: rgba(0,112,196,.15);
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
}

.course-card:hover::before {
    opacity: 1;
}

/* ---------- Course "En Cours" Pulse ---------- */
.pulse-live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.pulse-live::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mint-500);
    animation: pulse-soft 1.5s ease-in-out infinite;
    box-shadow: 0 0 6px rgba(16,185,129,.5);
}

/* ---------- Chat ---------- */
.chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px - 48px);
    max-height: 700px;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
}

.chat-bubble {
    max-width: 75%;
    padding: 10px 16px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.55;
    animation: fadeInUp .25s cubic-bezier(.22,1,.36,1) both;
    position: relative;
    word-wrap: break-word;
}

.chat-bubble-sent {
    align-self: flex-end;
    background: var(--brand-600);
    color: #fff;
    border-bottom-right-radius: 4px;
}

.chat-bubble-received {
    align-self: flex-start;
    background: #fff;
    border: 1px solid rgba(0,0,0,.06);
    color: #1e293b;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,.03);
}

.chat-bubble-time {
    font-size: 10px;
    opacity: .55;
    margin-top: 4px;
    display: block;
}

.chat-bubble-sent .chat-bubble-time { text-align: right; }
.chat-bubble-received .chat-bubble-time { text-align: left; }

.chat-input-bar {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid rgba(0,0,0,.06);
    background: #fff;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.chat-input {
    flex: 1;
    padding: 10px 14px;
    background: var(--sand-50);
    border: 1.5px solid rgba(0,0,0,.06);
    border-radius: 24px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: var(--transition-smooth);
}

.chat-input:focus {
    border-color: var(--brand-400, #36a9f5);
    box-shadow: 0 0 0 3px rgba(0,112,196,.08);
}

.chat-send-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--brand-600);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    box-shadow: 0 2px 8px rgba(0,112,196,.3);
    flex-shrink: 0;
}

.chat-send-btn:hover {
    background: var(--brand-700);
    transform: scale(1.05);
}

.chat-send-btn:active { transform: scale(.96); }

/* ---------- Prescription Detail Card ---------- */
.prescription-card {
    background: linear-gradient(135deg, #f0f7ff 0%, #fdfcfa 100%);
    border: 1.5px solid rgba(0,112,196,.1);
    border-radius: var(--radius-lg);
    padding: 20px;
    position: relative;
}

.prescription-card::after {
    content: 'Cerfa S3138';
    position: absolute;
    top: 12px;
    right: 16px;
    font-size: 10px;
    font-weight: 700;
    color: var(--brand-400);
    text-transform: uppercase;
    letter-spacing: .08em;
    opacity: .7;
}

/* ---------- Detail Row ---------- */
.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px dashed rgba(0,0,0,.05);
}

.detail-row:last-child { border-bottom: none; }

.detail-label {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .03em;
}

.detail-value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    text-align: right;
}

/* ---------- Empty State ---------- */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-state-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--brand-50);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

/* ---------- Typing indicator ---------- */
@keyframes typingDot {
    0%, 60%, 100% { transform: translateY(0); opacity: .4; }
    30% { transform: translateY(-4px); opacity: 1; }
}

.typing-dots span {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #94a3b8;
    margin: 0 2px;
    animation: typingDot 1.4s infinite;
}

.typing-dots span:nth-child(2) { animation-delay: .2s; }
.typing-dots span:nth-child(3) { animation-delay: .4s; }```

---

## 4) Parties de `app.js` qui gèrent l'affichage

### 4.1 Routeur (navigation)

```js
const routes = {
    '/':                    renderLogin,
    '/login':               renderLogin,
    '/dashboard':           renderPatientDashboard,
    '/new-request':         renderNewRequest,
    '/chauffeur-dashboard': renderChauffeurDashboard,
    '/notifications':       renderNotifications,
    '/course':              renderCourseEnCours,
    '/chat':                renderChat,
};

function navigate(hash) {
    window.location.hash = hash;
}

function handleRoute() {
    if (AppState.chatRefreshInterval) {
        clearInterval(AppState.chatRefreshInterval);
        AppState.chatRefreshInterval = null;
    }
    if (AppState.notificationsRefreshInterval) {
        clearInterval(AppState.notificationsRefreshInterval);
        AppState.notificationsRefreshInterval = null;
    }

    const raw = window.location.hash.slice(1) || '/';
    const [path, query] = raw.split('?');
    const params = new URLSearchParams(query || '');
    const renderer = routes[path];

    // Auth guards
    if (!AppState.currentUser && path !== '/' && path !== '/login') {
        navigate('/login');
        return;
    }
    if (AppState.currentUser && (path === '/' || path === '/login')) {
        navigate(getDashboardRoute());
        return;
    }

    // Update navbar
    const navbar = document.getElementById('navbar');
    const homeLink = document.getElementById('nav-home-link');
    if (AppState.currentUser) {
        navbar.classList.remove('hidden');
        document.getElementById('nav-username').textContent = AppState.currentUser.nom;
        homeLink.href = '#' + getDashboardRoute();

        const roleBadge = document.getElementById('nav-role-badge');
        if (AppState.currentUser.role === 'CHAUFFEUR') {
            roleBadge.textContent = 'Chauffeur';
            roleBadge.className = 'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-mint-400/15 text-green-700 hidden sm:inline';
        } else {
            roleBadge.textContent = 'Patient';
            roleBadge.className = 'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 hidden sm:inline';
        }
    } else {
        navbar.classList.add('hidden');
    }

    const app = document.getElementById('app-content');
    if (renderer) {
        app.style.opacity = '0';
        setTimeout(() => {
            renderer(app, params);
            app.style.opacity = '1';
            refreshIcons();
        }, 120);
    } else {
        app.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-screen gap-4">
                <i data-lucide="map-pin-off" class="w-16 h-16 text-brand-300"></i>
                <p class="text-lg text-gray-500">Page introuvable</p>
                <button class="btn-primary" onclick="navigate('${getDashboardRoute()}')">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
                </button>
            </div>`;
        refreshIcons();
    }
}

window.addEventListener('hashchange', handleRoute);


// ————————————————————————————————————————————
//  5. NAVBAR EVENTS
// ————————————————————————————————————————————

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-logout').addEventListener('click', () => {
        AppState.currentUser = null;
        toast('Déconnexion réussie.', 'info');
        navigate('/login');
```

### 4.2 Toutes les fonctions `render...`

```js
function renderLogin(container) {
    container.innerHTML = `
    <div class="login-bg flex items-center justify-center px-4 py-12 min-h-screen">
        <div class="card-elevated w-full max-w-md p-8 anim-fade-up" style="position:relative;z-index:1">
            <div class="flex items-center justify-center gap-3 mb-2">
                <div class="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg">
                    <i data-lucide="heart-pulse" class="w-6 h-6 text-white"></i>
                </div>
                <h1 class="font-display text-3xl text-brand-900 tracking-tight">HealDrive</h1>
            </div>
            <p class="text-center text-sm text-gray-400 mb-8">Transport médical connecté</p>

            <p class="input-label text-center mb-3">Je me connecte en tant que</p>
            <div class="grid grid-cols-2 gap-3 mb-6" id="role-selector">
                <label class="role-card active" data-role="PATIENT">
                    <input type="radio" name="role" value="PATIENT" checked>
                    <i data-lucide="user-round" class="w-7 h-7 mx-auto mb-2 text-brand-600"></i>
                    <span class="block text-sm font-semibold text-gray-700">Patient</span>
                </label>
                <label class="role-card" data-role="CHAUFFEUR">
                    <input type="radio" name="role" value="CHAUFFEUR">
                    <i data-lucide="truck" class="w-7 h-7 mx-auto mb-2 text-brand-600"></i>
                    <span class="block text-sm font-semibold text-gray-700">Chauffeur</span>
                </label>
            </div>

            <div class="mb-4">
                <label class="input-label" for="login-email">Adresse email</label>
                <input class="input-field" type="email" id="login-email" placeholder="exemple@email.com" value="marie.dupont@email.com">
            </div>
            <div class="mb-6">
                <label class="input-label" for="login-password">Mot de passe</label>
                <input class="input-field" type="password" id="login-password" placeholder="••••••••" value="demo1234">
            </div>

            <button id="btn-login" class="btn-primary w-full text-base">
                <i data-lucide="log-in" class="w-5 h-5"></i> Se connecter
            </button>

            <div class="my-5 border-t border-gray-100"></div>

            <p class="input-label text-center mb-3">Pas encore de compte ?</p>
            <div class="mb-3">
                <label class="input-label" for="register-nom">Nom</label>
                <input class="input-field" type="text" id="register-nom" placeholder="Ex: Dupont">
            </div>
            <div class="mb-3">
                <label class="input-label" for="register-prenom">Prénom</label>
                <input class="input-field" type="text" id="register-prenom" placeholder="Ex: Marie">
            </div>
            <div class="mb-3">
                <label class="input-label" for="register-email">Email</label>
                <input class="input-field" type="email" id="register-email" placeholder="exemple@email.com">
            </div>
            <div class="mb-3">
                <label class="input-label" for="register-role">Rôle</label>
                <select class="input-field" id="register-role">
                    <option value="PATIENT" selected>PATIENT</option>
                    <option value="CHAUFFEUR">CHAUFFEUR</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="input-label" for="register-telephone">Téléphone</label>
                <input class="input-field" type="tel" id="register-telephone" placeholder="Ex: 0611223344">
            </div>
            <div class="mb-4">
                <label class="input-label" for="register-password">Mot de passe</label>
                <input class="input-field" type="password" id="register-password" placeholder="••••••••">
            </div>
            <button id="btn-register" class="btn-ghost w-full text-base">
                <i data-lucide="user-plus" class="w-5 h-5"></i> S'inscrire
            </button>

            <p class="text-xs text-gray-400 text-center mt-5">MVP Demo — Données simulées</p>
        </div>
    </div>`;

    // Role card toggle
    const roleCards = container.querySelectorAll('.role-card');
    const emailInput = container.querySelector('#login-email');
    const loginPasswordInput = container.querySelector('#login-password');

    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
            // Pre-fill email based on role
            const role = card.dataset.role;
            emailInput.value = role === 'CHAUFFEUR' ? 'philippe.lefebvre@healdrive.fr' : 'marie.dupont@email.com';
        });
    });

    container.querySelector('#btn-login').addEventListener('click', async () => {
        const role = container.querySelector('input[name="role"]:checked').value;
        const email = emailInput.value.trim();
        const motDePasse = loginPasswordInput.value;

        if (!email) { toast('Veuillez saisir un email.', 'error'); return; }
        if (!motDePasse) { toast('Veuillez saisir un mot de passe.', 'error'); return; }

        try {
            await login(email, motDePasse, role);
            toast(`Bienvenue, ${AppState.currentUser.nom} !`, 'success');
            navigate(getDashboardRoute());
        } catch (error) {
            toast(error.message || 'Échec de la connexion.', 'error');
        }
    });

    container.querySelector('#btn-register').addEventListener('click', async () => {
        const role = container.querySelector('#register-role').value;
        const nom = container.querySelector('#register-nom').value.trim();
        const prenom = container.querySelector('#register-prenom').value.trim();
        const email = container.querySelector('#register-email').value.trim();
        const telephone = container.querySelector('#register-telephone').value.trim();
        const motDePasse = container.querySelector('#register-password').value;

        if (!nom || !prenom || !email || !motDePasse || !role || !telephone) {
            toast('Veuillez remplir tous les champs d’inscription.', 'error');
            return;
        }

        try {
            await sInscrire({
                nom,
                prenom,
                email,
                mot_de_passe: motDePasse,
                role,
                telephone,
            });
            emailInput.value = email;
            loginPasswordInput.value = motDePasse;
            navigate('/login');
        } catch (error) {
            // toast deja gere dans sInscrire
        }
    });
}

function renderPatientDashboard(container, params, skipRemoteLoad = false) {
    const user = AppState.currentUser;
    if (!skipRemoteLoad) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Chargement des trajets...</div>`;
        chargerTrajetsPatient(user.profilId || user.id)
            .then(() => {
                renderPatientDashboard(container, params, true);
                refreshIcons();
            })
            .catch((error) => {
                toast(error.message || 'Erreur de chargement.', 'error');
                container.innerHTML = `<div class="pt-24 text-center text-coral-500">Impossible de charger vos trajets.</div>`;
            });
        return;
    }

    const trajets = AppState.trajets.filter(t => t.patient_id === (user.profilId || user.id));
    const counts = {
        EN_ATTENTE: trajets.filter(t => t.statut === 'EN_ATTENTE').length,
        EN_COURS:   trajets.filter(t => t.statut === 'EN_COURS').length,
        ACCEPTE:    trajets.filter(t => t.statut === 'ACCEPTE').length,
        TERMINE:    trajets.filter(t => t.statut === 'TERMINE').length,
    };

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 anim-fade-up">
            <div>
                <p class="text-sm text-brand-600 font-semibold tracking-wide uppercase mb-1">Tableau de bord</p>
                <h2 class="section-title">Bonjour, ${user.nom.split(' ')[0]}</h2>
                <p class="text-gray-400 text-sm mt-1">Gérez vos transports médicaux en toute simplicité.</p>
            </div>
            <button class="btn-primary shrink-0" onclick="navigate('/new-request')">
                <i data-lucide="plus" class="w-5 h-5"></i> Nouvelle demande
            </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            ${statCard('En attente', counts.EN_ATTENTE, 'clock', 'stat-accent-sand', 'anim-delay-1')}
            ${statCard('Acceptés', counts.ACCEPTE, 'check-circle-2', 'stat-accent-blue', 'anim-delay-2')}
            ${statCard('En cours', counts.EN_COURS, 'navigation', 'stat-accent-mint', 'anim-delay-3')}
            ${statCard('Terminés', counts.TERMINE, 'flag', 'stat-accent-coral', 'anim-delay-4')}
        </div>

        <div class="card-flat overflow-hidden anim-fade-up" style="animation-delay:.2s">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-semibold text-gray-800 text-[15px]">Mes trajets</h3>
                <span class="text-xs text-gray-400">${trajets.length} trajet(s)</span>
            </div>
            ${trajets.length === 0
                ? emptyState('route-off', 'Aucun trajet pour le moment.')
                : trajets.map((t, i) => patientTrajetRow(t, i)).join('')
            }
        </div>
    </div>`;

    rafraichirBadgeNotifications();
}

function renderChauffeurDashboard(container, params, skipRemoteLoad = false) {
    const user = AppState.currentUser;
    const vehType = user.vehicule?.type || null;

    if (!skipRemoteLoad) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Chargement des courses...</div>`;
        chargerTrajetsDisponibles()
            .then(() => {
                renderChauffeurDashboard(container, params, true);
                refreshIcons();
            })
            .catch((error) => {
                toast(error.message || 'Erreur de chargement.', 'error');
                container.innerHTML = `<div class="pt-24 text-center text-coral-500">Impossible de charger les courses disponibles.</div>`;
            });
        return;
    }

    // Courses available for this chauffeur (matching vehicle type, EN_ATTENTE)
    const available = AppState.trajets.filter(t =>
        t.statut === 'EN_ATTENTE' && (!vehType || t.type_vehicule === vehType)
    );

    // My active courses
    const myCourses = AppState.trajets.filter(t =>
        t.chauffeur_id === (user.profilId || user.id) && (t.statut === 'ACCEPTE' || t.statut === 'EN_COURS')
    );

    // My completed
    const completed = AppState.trajets.filter(t =>
        t.chauffeur_id === (user.profilId || user.id) && t.statut === 'TERMINE'
    );

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 anim-fade-up">
            <div>
                <p class="text-sm text-mint-500 font-semibold tracking-wide uppercase mb-1">Espace Chauffeur</p>
                <h2 class="section-title">Bonjour, ${user.nom.split(' ')[0]}</h2>
                <p class="text-gray-400 text-sm mt-1 flex items-center gap-2">
                    <i data-lucide="${VEHICULE_LABELS[vehType || 'VSL'].icon}" class="w-4 h-4 ${VEHICULE_LABELS[vehType || 'VSL'].color}"></i>
                    ${VEHICULE_LABELS[vehType || 'VSL'].label} · ${user.vehicule?.immatriculation || 'Immatriculation non renseignée'}
                    · <span class="text-mint-500 font-medium">Disponible</span>
                </p>
            </div>
            <div class="flex gap-3">
                <div class="card-flat px-4 py-2.5 text-center">
                    <p class="text-2xl font-bold text-brand-800">${myCourses.length}</p>
                    <p class="text-[11px] text-gray-400 font-medium uppercase">Active(s)</p>
                </div>
                <div class="card-flat px-4 py-2.5 text-center">
                    <p class="text-2xl font-bold text-gray-600">${completed.length}</p>
                    <p class="text-[11px] text-gray-400 font-medium uppercase">Terminée(s)</p>
                </div>
            </div>
        </div>

        <!-- Active Courses -->
        ${myCourses.length > 0 ? `
        <div class="mb-10 anim-fade-up" style="animation-delay:.1s">
            <div class="flex items-center gap-2 mb-4">
                <span class="pulse-live text-sm font-semibold text-gray-800">Mes courses actives</span>
            </div>
            <div class="grid gap-4">
                ${myCourses.map(t => chauffeurActiveCourseCard(t)).join('')}
            </div>
        </div>` : ''}

        <!-- Available Courses -->
        <div class="anim-fade-up" style="animation-delay:.2s">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                    <i data-lucide="radio" class="w-4 h-4 text-brand-500"></i>
                    Courses disponibles
                    <span class="text-xs font-normal text-gray-400">(${vehType ? VEHICULE_LABELS[vehType].label : 'Tous véhicules'})</span>
                </h3>
                <span class="text-xs text-gray-400">${available.length} résultat(s)</span>
            </div>

            ${available.length === 0
                ? `<div class="card-flat">${emptyState('coffee', 'Aucune course disponible pour le moment. Revenez bientôt !')}</div>`
                : `<div class="grid gap-4">${available.map((t, i) => chauffeurAvailableCourseCard(t, i)).join('')}</div>`
            }
        </div>

        <!-- Completed -->
        ${completed.length > 0 ? `
        <div class="mt-10 anim-fade-up" style="animation-delay:.3s">
            <h3 class="font-semibold text-gray-800 text-[15px] mb-4 flex items-center gap-2">
                <i data-lucide="flag" class="w-4 h-4 text-gray-400"></i> Historique
            </h3>
            <div class="card-flat overflow-hidden">
                ${completed.map((t, i) => chauffeurCompletedRow(t, i)).join('')}
            </div>
        </div>` : ''}
    </div>`;

    rafraichirBadgeNotifications();
}

function renderCourseEnCours(container, params) {
    const trajetId = params.get('trajet');
    const t = AppState.trajets.find(tr => tr.id === trajetId);

    if (!t) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Course introuvable.</div>`;
        return;
    }

    const patient = getPatient(t.patient_id);
    const presc = getPrescription(t.prescription_id);
    const chauffeur = t.chauffeur_id ? getChauffeur(t.chauffeur_id) : null;
    const veh = VEHICULE_LABELS[t.type_vehicule];
    const stat = STATUT_LABELS[t.statut];

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
        <button class="btn-ghost text-xs mb-6 anim-fade" onclick="navigate('${getDashboardRoute()}')">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
        </button>

        <div class="card-elevated p-6 sm:p-8 anim-fade-up">
            <div class="flex items-center justify-between mb-6">
                <h2 class="section-title text-xl">Détail de la course</h2>
                <span class="badge ${stat.badge}">${stat.label}</span>
            </div>

            <div class="grid gap-2 mb-6">
                <div class="detail-row"><span class="detail-label">Départ</span><span class="detail-value">${t.depart}</span></div>
                <div class="detail-row"><span class="detail-label">Destination</span><span class="detail-value">${t.destination}</span></div>
                <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(t.date)} à ${t.heure}</span></div>
                <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value ${veh.color}">${veh.label}</span></div>
                ${t.distance_km ? `<div class="detail-row"><span class="detail-label">Distance</span><span class="detail-value">${t.distance_km} km</span></div>` : ''}
                ${t.tarif_estime ? `<div class="detail-row"><span class="detail-label">Tarif estimé</span><span class="detail-value">${t.tarif_estime.toFixed(2)} €</span></div>` : ''}
            </div>

            ${patient ? `
            <div class="p-3 rounded-xl bg-sand-100 mb-4">
                <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Patient</p>
                <p class="text-sm font-semibold text-gray-800">${patient.nom}</p>
                <p class="text-xs text-gray-400">${patient.telephone} · ${patient.securite_sociale}</p>
            </div>` : ''}

            ${chauffeur ? `
            <div class="p-3 rounded-xl bg-sand-100 mb-4">
                <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Chauffeur</p>
                <p class="text-sm font-semibold text-gray-800">${chauffeur.nom}</p>
                <p class="text-xs text-gray-400">${chauffeur.telephone} · ${chauffeur.vehicule.immatriculation}</p>
            </div>` : ''}

            ${presc ? `
            <div class="prescription-card mb-4">
                <p class="text-xs font-semibold text-brand-800 mb-2">Prescription</p>
                <div class="grid gap-1">
                    <div class="detail-row"><span class="detail-label">Médecin</span><span class="detail-value">${presc.medecin}</span></div>
                    <div class="detail-row"><span class="detail-label">Motif</span><span class="detail-value text-xs">${presc.motif}</span></div>
                    <div class="detail-row"><span class="detail-label">Validité</span><span class="detail-value">Jusqu'au ${formatDate(presc.date_validite)}</span></div>
                </div>
            </div>` : ''}

            <div class="flex gap-3 mt-6">
                <button class="btn-ghost flex-1" onclick="navigate('/chat?trajet=${t.id}')">
                    <i data-lucide="message-circle" class="w-4 h-4"></i> Ouvrir le chat
                </button>
                ${t.statut === 'EN_COURS' && AppState.currentUser.role === 'CHAUFFEUR' ? `
                <button class="btn-primary flex-1" onclick="terminerCourse('${t.id}'); navigate('${getDashboardRoute()}');">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Terminer
                </button>` : ''}
            </div>
        </div>
    </div>`;
}

function renderChat(container, params) {
    const trajetId = params.get('trajet');
    const t = AppState.trajets.find(tr => tr.id === trajetId);

    if (!t) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Conversation introuvable.</div>`;
        return;
    }

    const user = AppState.currentUser;
    const isPatient = user.role === 'PATIENT';
    const otherPerson = isPatient
        ? (t.chauffeur_id ? getChauffeur(t.chauffeur_id) : null)
        : getPatient(t.patient_id);

    const otherName = otherPerson ? otherPerson.nom : 'Inconnu';
    const messages = AppState.messages[trajetId] || [];

    container.innerHTML = `
    <div class="pt-20 pb-4 px-4 sm:px-6 max-w-2xl mx-auto">

        <!-- Chat Header -->
        <div class="card-flat p-4 mb-2 flex items-center justify-between anim-fade">
            <div class="flex items-center gap-3">
                <button class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onclick="navigate('${getDashboardRoute()}')">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-gray-500"></i>
                </button>
                <div class="w-9 h-9 rounded-full ${isPatient ? 'bg-mint-400/15' : 'bg-brand-100'} flex items-center justify-center">
                    <i data-lucide="${isPatient ? 'truck' : 'user-round'}" class="w-4 h-4 ${isPatient ? 'text-green-700' : 'text-brand-600'}"></i>
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-800">${otherName}</p>
                    <p class="text-xs text-gray-400">${t.depart} → ${t.destination}</p>
                </div>
            </div>
            <button class="btn-ghost text-xs py-1.5 px-3" onclick="navigate('/course?trajet=${t.id}')">
                <i data-lucide="info" class="w-3.5 h-3.5"></i> Détails
            </button>
        </div>

        <!-- Chat Body -->
        <div class="card-flat overflow-hidden chat-container anim-fade-up">
            <div class="chat-messages" id="chat-messages">
                ${messages.length === 0
                    ? `<div class="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
                           <i data-lucide="message-circle" class="w-10 h-10 mb-3 opacity-30"></i>
                           <p>Aucun message. Commencez la conversation !</p>
                       </div>`
                    : messages.map(m => chatBubble(m, user.id)).join('')
                }
            </div>

            <div class="chat-input-bar">
                <input class="chat-input" id="chat-input" type="text" placeholder="Écrivez un message..." autocomplete="off">
                <button class="chat-send-btn" id="btn-send-chat">
                    <i data-lucide="send" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    </div>`;

    // Scroll to bottom
    const messagesContainer = container.querySelector('#chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    async function refreshMessages() {
        try {
            const remoteMessages = await chargerMessagesTrajet(trajetId);
            messagesContainer.innerHTML = remoteMessages.length === 0
                ? `<div class="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
                       <i data-lucide="message-circle" class="w-10 h-10 mb-3 opacity-30"></i>
                       <p>Aucun message. Commencez la conversation !</p>
                   </div>`
                : remoteMessages.map(m => chatBubble(m, user.id)).join('');
            refreshIcons();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            // toast already handled in chargerMessagesTrajet
        }
    }

    refreshMessages();
    AppState.chatRefreshInterval = setInterval(refreshMessages, 5000);

    // Send message
    const input = container.querySelector('#chat-input');
    const sendBtn = container.querySelector('#btn-send-chat');

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        try {
            const msg = await envoyerMessage(trajetId, user.id, text);

            const wasEmpty = messagesContainer.querySelector('.flex-1.flex.flex-col');
            if (wasEmpty) wasEmpty.remove();

            messagesContainer.insertAdjacentHTML('beforeend', chatBubble(msg, user.id));
            refreshIcons();
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            refreshMessages();
        } catch (error) {
            // toast already handled in envoyerMessage
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Focus input
    setTimeout(() => input.focus(), 200);
}

function renderNotifications(container) {
    if (!AppState.currentUser) {
        navigate('/login');
        return;
    }

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-6 anim-fade-up">
            <div>
                <p class="text-sm text-brand-600 font-semibold tracking-wide uppercase mb-1">Notifications</p>
                <h2 class="section-title">Centre de notifications</h2>
            </div>
            <button class="btn-ghost text-xs" onclick="navigate('${getDashboardRoute()}')">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
            </button>
        </div>
        <div id="notifications-list" class="card-flat overflow-hidden">
            <div class="p-6 text-sm text-gray-400">Chargement...</div>
        </div>
    </div>`;

    const listEl = container.querySelector('#notifications-list');

    async function loadNotifications() {
        try {
            const notifications = await chargerNotificationsUtilisateur(AppState.currentUser.id);
            console.log(notifications);
            if (notifications.length === 0) {
                listEl.innerHTML = `<div class="p-6 text-sm text-gray-400">Aucune notification.</div>`;
            } else {
                listEl.innerHTML = notifications.map(n => `
                    <button class="w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${n.read ? '' : 'bg-brand-50/40'}" onclick="marquerNotificationLue('${n.id}').then(() => navigate('/notifications'))">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-800">${n.titre || 'Notification'}</p>
                                <p class="text-sm text-gray-600 mt-1">${n.contenu || n.message}</p>
                            </div>
                            <div class="shrink-0 text-xs text-gray-400">${n.time}</div>
                        </div>
                    </button>
                `).join('');
            }
            rafraichirBadgeNotifications();
            refreshIcons();
        } catch (error) {
            listEl.innerHTML = `<div class="p-6 text-sm text-coral-500">Impossible de charger les notifications.</div>`;
        }
    }

    loadNotifications();
    AppState.notificationsRefreshInterval = setInterval(loadNotifications, 5000);
}

function renderNewRequest(container) {
    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
        <button class="btn-ghost text-xs mb-6 anim-fade" onclick="navigate('/dashboard')">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour au tableau de bord
        </button>

        <div class="card-elevated p-6 sm:p-8 anim-fade-up">
            <h2 class="section-title mb-1">Nouvelle demande</h2>
            <p class="text-sm text-gray-400 mb-8">Remplissez les informations de votre transport médical.</p>

            <div class="flex items-center gap-2 mb-8" id="step-indicators">
                <div class="step-dot active" data-step="1">
                    <span class="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span class="text-xs font-medium text-brand-700 mt-1 hidden sm:block">Trajet</span>
                </div>
                <div class="flex-1 h-px bg-gray-200"></div>
                <div class="step-dot" data-step="2">
                    <span class="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">2</span>
                    <span class="text-xs font-medium text-gray-400 mt-1 hidden sm:block">Prescription</span>
                </div>
                <div class="flex-1 h-px bg-gray-200"></div>
                <div class="step-dot" data-step="3">
                    <span class="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">3</span>
                    <span class="text-xs font-medium text-gray-400 mt-1 hidden sm:block">Confirmation</span>
                </div>
            </div>

            <!-- STEP 1: TRAJET -->
            <div id="form-step-1">
                <div class="grid gap-5">
                    <div>
                        <label class="input-label" for="req-depart"><i data-lucide="map-pin" class="w-3.5 h-3.5 inline text-brand-500"></i> Lieu de départ</label>
                        <input class="input-field" id="req-depart" placeholder="Ex: Hôpital Necker, Paris 15e">
                    </div>
                    <div>
                        <label class="input-label" for="req-dest"><i data-lucide="flag" class="w-3.5 h-3.5 inline text-mint-500"></i> Destination</label>
                        <input class="input-field" id="req-dest" placeholder="Ex: 12 Rue de Vaugirard, Paris 6e">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="input-label" for="req-date">Date</label>
                            <input class="input-field" type="date" id="req-date" min="${todayISO()}">
                        </div>
                        <div>
                            <label class="input-label" for="req-heure">Heure</label>
                            <input class="input-field" type="time" id="req-heure" value="09:00">
                        </div>
                    </div>
                    <div>
                        <label class="input-label">Type de véhicule prescrit</label>
                        <div class="grid grid-cols-3 gap-3 mt-1" id="vehicule-selector">
                            <label class="role-card active" data-type="VSL">
                                <input type="radio" name="vehicule" value="VSL" checked>
                                <i data-lucide="car" class="w-6 h-6 mx-auto mb-1.5 text-brand-600"></i>
                                <span class="text-xs font-semibold text-gray-600">VSL</span>
                            </label>
                            <label class="role-card" data-type="AMBULANCE">
                                <input type="radio" name="vehicule" value="AMBULANCE">
                                <i data-lucide="siren" class="w-6 h-6 mx-auto mb-1.5 text-coral-500"></i>
                                <span class="text-xs font-semibold text-gray-600">Ambulance</span>
                            </label>
                            <label class="role-card" data-type="TAXI_CONV">
                                <input type="radio" name="vehicule" value="TAXI_CONV">
                                <i data-lucide="car-taxi-front" class="w-6 h-6 mx-auto mb-1.5 text-yellow-600"></i>
                                <span class="text-xs font-semibold text-gray-600">Taxi conv.</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="mt-8 flex justify-end">
                    <button class="btn-primary" id="btn-step1-next">Suivant <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
                </div>
            </div>

            <!-- STEP 2: PRESCRIPTION -->
            <div id="form-step-2" class="hidden">
                <div class="grid gap-5">
                    <div>
                        <label class="input-label" for="req-medecin">Médecin prescripteur</label>
                        <input class="input-field" id="req-medecin" placeholder="Dr. Nom Prénom">
                    </div>
                    <div>
                        <label class="input-label" for="req-etab">Établissement de soin</label>
                        <input class="input-field" id="req-etab" placeholder="Nom de l'hôpital ou clinique">
                    </div>
                    <div>
                        <label class="input-label" for="req-motif">Motif médical</label>
                        <input class="input-field" id="req-motif" placeholder="Ex: Suivi post-opératoire, séance de dialyse...">
                    </div>
                    <div>
                        <label class="input-label">Bon de transport (Cerfa S3138)</label>
                        <div class="upload-zone" id="upload-zone">
                            <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-400"></i>
                            <p class="text-sm text-gray-500">Glissez votre fichier ici ou <span class="text-brand-600 font-semibold cursor-pointer">parcourir</span></p>
                            <p class="text-xs text-gray-400">PDF ou image — 5 Mo max.</p>
                            <input type="file" id="file-prescription" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                        </div>
                        <p id="file-name" class="text-xs text-mint-500 font-medium mt-2 hidden"><i data-lucide="paperclip" class="w-3 h-3 inline"></i> <span></span></p>
                    </div>
                    <div>
                        <label class="input-label" for="req-notes">Notes complémentaires <span class="text-gray-300 font-normal">(optionnel)</span></label>
                        <textarea class="input-field" id="req-notes" rows="3" placeholder="Fauteuil roulant nécessaire, accompagnant..."></textarea>
                    </div>
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="btn-ghost" id="btn-step2-back"><i data-lucide="arrow-left" class="w-4 h-4"></i> Retour</button>
                    <button class="btn-primary" id="btn-step2-next">Suivant <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
                </div>
            </div>

            <!-- STEP 3: CONFIRMATION -->
            <div id="form-step-3" class="hidden">
                <div class="rounded-2xl bg-brand-50/60 border border-brand-100 p-5 mb-6">
                    <h4 class="font-semibold text-brand-900 text-sm mb-4 flex items-center gap-2">
                        <i data-lucide="clipboard-check" class="w-4 h-4"></i> Récapitulatif
                    </h4>
                    <div id="summary-content" class="grid gap-3 text-sm"></div>
                </div>
                <div class="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 mb-6 flex gap-3">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"></i>
                    <p class="text-sm text-yellow-800">En confirmant, votre demande sera envoyée aux chauffeurs disponibles à proximité. Vous recevrez une notification dès qu'un chauffeur accepte.</p>
                </div>
                <div class="mt-6 flex justify-between">
                    <button class="btn-ghost" id="btn-step3-back"><i data-lucide="arrow-left" class="w-4 h-4"></i> Modifier</button>
                    <button class="btn-primary" id="btn-submit"><i data-lucide="send" class="w-5 h-5"></i> Confirmer la demande</button>
                </div>
            </div>
        </div>
    </div>`;

    // --- Step logic (same as before, enhanced) ---
    const steps = [
        container.querySelector('#form-step-1'),
        container.querySelector('#form-step-2'),
        container.querySelector('#form-step-3'),
    ];

    function showStep(idx) {
        steps.forEach((s, i) => s.classList.toggle('hidden', i !== idx));
        updateStepIndicators(idx);
        refreshIcons();
    }

    function updateStepIndicators(activeIdx) {
        container.querySelectorAll('.step-dot').forEach((dot, i) => {
            const circle = dot.querySelector('span:first-child');
            const label = dot.querySelector('span:last-child');
            if (i <= activeIdx) {
                circle.className = 'w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center';
                if (label) label.className = 'text-xs font-medium text-brand-700 mt-1 hidden sm:block';
            } else {
                circle.className = 'w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center';
                if (label) label.className = 'text-xs font-medium text-gray-400 mt-1 hidden sm:block';
            }
        });
    }

    // Vehicle selector
    container.querySelectorAll('#vehicule-selector .role-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('#vehicule-selector .role-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
        });
    });

    // File upload
    const uploadZone = container.querySelector('#upload-zone');
    const fileInput = container.querySelector('#file-prescription');
    const fileNameEl = container.querySelector('#file-name');

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragging'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
    uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.classList.remove('dragging');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });

    function handleFile(file) {
        fileNameEl.classList.remove('hidden');
        fileNameEl.querySelector('span').textContent = file.name;
        toast('Fichier ajouté : ' + file.name, 'success');
    }

    // Navigation
    container.querySelector('#btn-step1-next').addEventListener('click', () => {
        const depart = container.querySelector('#req-depart').value.trim();
        const dest = container.querySelector('#req-dest').value.trim();
        const date = container.querySelector('#req-date').value;
        if (!depart || !dest || !date) { toast('Veuillez remplir tous les champs obligatoires.', 'error'); return; }
        showStep(1);
    });

    container.querySelector('#btn-step2-next').addEventListener('click', () => {
        const medecin = container.querySelector('#req-medecin').value.trim();
        if (!medecin) { toast('Veuillez indiquer le médecin prescripteur.', 'error'); return; }
        populateSummary();
        showStep(2);
    });

    container.querySelector('#btn-step2-back').addEventListener('click', () => showStep(0));
    container.querySelector('#btn-step3-back').addEventListener('click', () => showStep(1));

    function populateSummary() {
        const veh = container.querySelector('input[name="vehicule"]:checked').value;
        const vehInfo = VEHICULE_LABELS[veh];
        const summaryEl = container.querySelector('#summary-content');
        const rows = [
            ['Départ', container.querySelector('#req-depart').value],
            ['Destination', container.querySelector('#req-dest').value],
            ['Date & heure', `${formatDate(container.querySelector('#req-date').value)} à ${container.querySelector('#req-heure').value}`],
            ['Véhicule', vehInfo.label],
            ['Médecin', container.querySelector('#req-medecin').value],
            ['Établissement', container.querySelector('#req-etab').value || '—'],
            ['Motif', container.querySelector('#req-motif').value || '—'],
            ['Prescription', fileInput.files[0] ? fileInput.files[0].name : 'Non fournie'],
        ];
        summaryEl.innerHTML = rows.map(([label, val]) => `
            <div class="flex justify-between gap-4">
                <span class="text-gray-500 shrink-0">${label}</span>
                <span class="font-medium text-gray-800 text-right">${val}</span>
            </div>`).join('');
    }

    // Submit
    container.querySelector('#btn-submit').addEventListener('click', async () => {
        const veh = container.querySelector('input[name="vehicule"]:checked').value;
        const depart = container.querySelector('#req-depart').value;
        const dest = container.querySelector('#req-dest').value;
        const date = container.querySelector('#req-date').value;
        const heure = container.querySelector('#req-heure').value;
        const user = AppState.currentUser;

        if (!depart || !dest || !date || !heure || !veh) {
            toast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        try {
            await creerDemande({
                depart,
                destination: dest,
                date,
                heure,
                type_vehicule: veh,
                patientId: user.profilId || user.id,
            });
            toast('Demande envoyée !', 'success');
            navigate('/dashboard');
        } catch (error) {
            // toast already handled in creerDemande
        }
    });
}

```
