// ================================================================
//  SCRIPT.JS – ChillHub Community (General Update)
//  Fungsi: Captcha, profil, navigasi, games (Tic-Tac-Toe, RPS,
//          Number Guessing), reviews (klik untuk tunjuk edit/delete),
//          settings, changelog
// ================================================================

// Tunggu sehingga DOM siap sepenuhnya
document.addEventListener('DOMContentLoaded', function() {

    // ================================================================
    //  1. STATE & PEMBOLEH UBAH GLOBAL
    // ================================================================
    const STATE = {
        verified: false,
        selectedColor: null,
        captchaAttempts: 0,
        captchaLocked: false,
        captchaLockTimer: null,
        currentPage: 'verificationPage',
        pageHistory: ['verificationPage'],
        // Tic-Tac-Toe
        tttBoard: [],
        tttCurrentPlayer: 'X',
        tttGameOver: false,
        tttPlayerScore: 0,
        tttAIScore: 0,
        tttDrawScore: 0,
        // RPS
        rpsPlayerScore: 0,
        rpsComputerScore: 0,
        rpsDrawScore: 0,
        // Number Guessing
        ngMode: 'normal',
        ngTarget: 0,
        ngAttempts: 0,
        ngPoints: 0,
        ngTimer: 60,
        ngTimerInterval: null,
        ngGameActive: false,
        ngRangeMin: 1,
        ngRangeMax: 50,
        ngPointValue: 1,
        // Theme
        theme: 'dark',
        // Profile
        profile: null,
        // Review
        editingReviewId: null,
        // For review click-to-show-actions
        activeReviewId: null,
    };

    // ================================================================
    //  2. RUJUKAN ELEMEN
    // ================================================================
    const elements = {
        // Pages
        verificationPage: document.getElementById('verificationPage'),
        profileSetupPage: document.getElementById('profileSetupPage'),
        homePage: document.getElementById('homePage'),
        aboutFaqPage: document.getElementById('aboutFaqPage'),
        chrpgPage: document.getElementById('chrpgPage'),
        chstaffPage: document.getElementById('chstaffPage'),
        gamesPage: document.getElementById('gamesPage'),
        reviewsPage: document.getElementById('reviewsPage'),
        settingsPage: document.getElementById('settingsPage'),
        reportPage: document.getElementById('reportPage'),

        // Navigation
        stickyNav: document.getElementById('stickyNav'),
        navToggle: document.getElementById('navToggle'),
        navLinks: document.getElementById('navLinks'),
        navLinksAll: document.querySelectorAll('.nav-links li a[data-page]'),

        // Captcha
        robotBtn: document.getElementById('robotBtn'),
        captchaQuestion: document.getElementById('captchaQuestion'),
        colorBtns: document.querySelectorAll('.color-btn'),
        verifyBtn: document.getElementById('verifyBtn'),
        verifyStatus: document.getElementById('verifyStatus'),

        // Back to Top
        backToTop: document.getElementById('backToTop'),

        // Loading Spinner
        loadingSpinner: document.getElementById('loadingSpinner'),

        // Toast
        toastContainer: document.getElementById('toastContainer'),

        // FAQ
        faqQuestions: document.querySelectorAll('.faq-question'),

        // All data-page buttons
        dataPageBtns: document.querySelectorAll('[data-page]'),

        // Profile Setup
        profileForm: document.getElementById('profileForm'),
        profileName: document.getElementById('profileName'),
        profileUsername: document.getElementById('profileUsername'),
        profileAge: document.getElementById('profileAge'),
        profileGender: document.getElementById('profileGender'),
        profileRegion: document.getElementById('profileRegion'),
        profileDiscordUser: document.getElementById('profileDiscordUser'),
        profileDiscordId: document.getElementById('profileDiscordId'),

        // Profile Display (Settings)
        displayName: document.getElementById('displayName'),
        displayUsername: document.getElementById('displayUsername'),
        displayAge: document.getElementById('displayAge'),
        displayGender: document.getElementById('displayGender'),
        displayRegion: document.getElementById('displayRegion'),
        displayDiscord: document.getElementById('displayDiscord'),
        displayDiscordId: document.getElementById('displayDiscordId'),
        displayScore: document.getElementById('displayScore'),
        editProfileBtn: document.getElementById('editProfileBtn'),
        deleteDataBtn: document.getElementById('deleteDataBtn'),

        // Home greeting
        greetingMessage: document.getElementById('greetingMessage'),

        // Games
        gameTabs: document.querySelectorAll('.game-tab'),
        gameContents: {
            tictactoe: document.getElementById('tictactoeGame'),
            rps: document.getElementById('rpsGame'),
            numberguess: document.getElementById('numberguessGame'),
        },
        // Tic-Tac-Toe
        tttBoard: document.getElementById('tttBoard'),
        tttStatus: document.getElementById('tttStatus'),
        tttReset: document.getElementById('tttReset'),
        tttPlayerScore: document.getElementById('tttPlayerScore'),
        tttAIScore: document.getElementById('tttAIScore'),
        tttDrawScore: document.getElementById('tttDrawScore'),
        // RPS
        rpsBtns: document.querySelectorAll('.rps-btn'),
        rpsStatus: document.getElementById('rpsStatus'),
        rpsPlayerScore: document.getElementById('rpsPlayerScore'),
        rpsComputerScore: document.getElementById('rpsComputerScore'),
        rpsDrawScore: document.getElementById('rpsDrawScore'),
        rpsReset: document.getElementById('rpsReset'),
        // Number Guessing
        ngModeBtns: document.querySelectorAll('.ng-mode-btn'),
        ngGameArea: document.getElementById('ngGameArea'),
        ngRangeDisplay: document.getElementById('ngRange'),
        ngTimerDisplay: document.getElementById('ngTimer'),
        ngPointsDisplay: document.getElementById('ngPoints'),
        ngHintDisplay: document.getElementById('ngHint'),
        ngGuessInput: document.getElementById('ngGuessInput'),
        ngGuessBtn: document.getElementById('ngGuessBtn'),
        ngMessageDisplay: document.getElementById('ngMessage'),
        ngResetBtn: document.getElementById('ngResetBtn'),

        // Settings
        themeToggle: document.getElementById('themeToggle'),

        // Reviews
        reviewForm: document.getElementById('reviewForm'),
        reviewRating: document.getElementById('reviewRating'),
        reviewContent: document.getElementById('reviewContent'),
        submitReviewBtn: document.getElementById('submitReviewBtn'),
        reviewsList: document.getElementById('reviewsList'),

        // Changelog
        changelogList: document.getElementById('changelogList'),
    };

    // ================================================================
    //  3. FUNGSI UTILITI
    // ================================================================

    function showToast(message, type = 'info', duration = 4000) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
        };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span>${message}</span>
            <button class="toast-close" aria-label="Close notification">×</button>
        `;
        elements.toastContainer.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        toast.querySelector('.toast-close').addEventListener('click', function() {
            hideToast(toast);
        });
        const timeout = setTimeout(() => {
            hideToast(toast);
        }, duration);
        toast.addEventListener('mouseenter', () => clearTimeout(timeout));
        toast.addEventListener('mouseleave', () => {
            setTimeout(() => hideToast(toast), duration);
        });

        function hideToast(toastEl) {
            if (toastEl.classList.contains('hiding')) return;
            toastEl.classList.add('hiding');
            setTimeout(() => {
                if (toastEl.parentNode) {
                    toastEl.parentNode.removeChild(toastEl);
                }
            }, 300);
        }
    }

    function showLoading(duration = 400) {
        elements.loadingSpinner.classList.add('active');
        return new Promise(resolve => {
            setTimeout(() => {
                elements.loadingSpinner.classList.remove('active');
                resolve();
            }, duration);
        });
    }

    function getLocalData(key, defaultVal) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultVal;
        } catch { return defaultVal; }
    }

    function setLocalData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }

    // --- Profile functions ---
    function loadProfile() {
        return getLocalData('chillhub_profile', null);
    }

    function saveProfile(profile) {
        setLocalData('chillhub_profile', profile);
        STATE.profile = profile;
        updateProfileDisplay();
        updateGreeting();
    }

    function updateProfileDisplay() {
        if (!STATE.profile) return;
        const p = STATE.profile;
        if (elements.displayName) elements.displayName.textContent = p.name || '—';
        if (elements.displayUsername) elements.displayUsername.textContent = p.username || '—';
        if (elements.displayAge) elements.displayAge.textContent = p.age || '—';
        if (elements.displayGender) elements.displayGender.textContent = p.gender || '—';
        if (elements.displayRegion) elements.displayRegion.textContent = p.region || '—';
        if (elements.displayDiscord) elements.displayDiscord.textContent = p.discordUsername || 'Not set';
        if (elements.displayDiscordId) elements.displayDiscordId.textContent = p.discordId || 'Not set';
        if (elements.displayScore) elements.displayScore.textContent = p.score || 0;
    }

    function updateGreeting() {
        if (!elements.greetingMessage) return;
        if (STATE.profile && STATE.profile.name) {
            elements.greetingMessage.textContent = `Welcome ${STATE.profile.name}`;
        } else {
            elements.greetingMessage.textContent = '';
        }
    }

    function addScore(amount = 1) {
        if (!STATE.profile) return;
        STATE.profile.score = (STATE.profile.score || 0) + amount;
        saveProfile(STATE.profile);
        updateProfileDisplay();
    }

    // --- Verification status ---
    function isUserVerified() {
        if (STATE.verified) return true;
        try {
            const saved = localStorage.getItem('chillhub_verified');
            if (saved === 'true') {
                STATE.verified = true;
                return true;
            }
        } catch {}
        return false;
    }

    function saveVerificationStatus() {
        try {
            localStorage.setItem('chillhub_verified', 'true');
        } catch {}
    }

    // --- Settings ---
    function loadSettings() {
        const theme = getLocalData('chillhub_theme', 'dark');
        STATE.theme = theme;
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            if (elements.themeToggle) elements.themeToggle.textContent = 'Light';
        } else {
            document.body.classList.remove('light-mode');
            if (elements.themeToggle) elements.themeToggle.textContent = 'Dark';
        }
    }

    function saveTheme(theme) {
        setLocalData('chillhub_theme', theme);
    }

    // --- Navigation ---
    function navigateTo(pageId, addToHistory = true) {
        if (STATE.currentPage === pageId) return;

        if (!isUserVerified() && pageId !== 'verificationPage') {
            showToast('🔒 Please verify first!', 'warning', 3000);
            return;
        }
        if (isUserVerified() && pageId === 'verificationPage') {
            showToast('You are already verified!', 'info', 2000);
            navigateTo('homePage', true);
            return;
        }

        if (isUserVerified() && pageId !== 'profileSetupPage' && pageId !== 'verificationPage') {
            const profile = loadProfile();
            if (!profile) {
                showToast('Please set up your profile first.', 'info', 3000);
                navigateTo('profileSetupPage', true);
                return;
            }
        }

        if (pageId === 'profileSetupPage' && isUserVerified() && loadProfile()) {
            showToast('Profile already exists!', 'info', 2000);
            navigateTo('homePage', true);
            return;
        }

        showLoading(300).then(() => {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                STATE.currentPage = pageId;
                if (addToHistory && window.history) {
                    window.history.pushState({ page: pageId }, '', `#${pageId}`);
                    STATE.pageHistory.push(pageId);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeMobileNav();
                updateActiveNavLink(pageId);
                if (pageId === 'gamesPage') {
                    initGames();
                }
                if (pageId === 'reviewsPage') {
                    loadReviews();
                }
                if (pageId === 'settingsPage') {
                    updateProfileDisplay();
                    renderChangelog();
                }
                if (pageId === 'profileSetupPage') {
                    prefillProfileForm();
                }
                if (pageId === 'homePage') {
                    updateGreeting();
                }
            }
        });
    }

    function updateActiveNavLink(pageId) {
        elements.navLinksAll.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === pageId) {
                link.style.color = '#f4a300';
                link.style.background = 'rgba(244, 163, 0, 0.08)';
                link.style.borderColor = 'rgba(244, 163, 0, 0.15)';
            } else {
                link.style.color = '';
                link.style.background = '';
                link.style.borderColor = '';
            }
        });
    }

    // --- Mobile Nav ---
    function toggleMobileNav() {
        elements.navLinks.classList.toggle('open');
        elements.navToggle.classList.toggle('active');
        elements.navToggle.setAttribute('aria-expanded', elements.navLinks.classList.contains('open'));
    }

    function closeMobileNav() {
        elements.navLinks.classList.remove('open');
        elements.navToggle.classList.remove('active');
        elements.navToggle.setAttribute('aria-expanded', 'false');
    }

    // --- Reset Captcha ---
    function resetCaptcha() {
        STATE.selectedColor = null;
        STATE.verified = false;
        STATE.captchaAttempts = 0;
        if (STATE.captchaLockTimer) {
            clearTimeout(STATE.captchaLockTimer);
            STATE.captchaLockTimer = null;
        }
        STATE.captchaLocked = false;
        elements.colorBtns.forEach(btn => btn.classList.remove('selected'));
        elements.verifyBtn.classList.remove('enabled');
        elements.verifyStatus.textContent = '';
        elements.verifyStatus.className = 'verification-status';
        elements.robotBtn.classList.remove('hidden');
        elements.captchaQuestion.classList.remove('show');
        elements.verifyBtn.textContent = 'Verify';
        elements.verifyBtn.disabled = false;
    }

    // ================================================================
    //  4. CAPTCHA LOGIK
    // ================================================================

    if (elements.robotBtn) {
        elements.robotBtn.addEventListener('click', function() {
            if (isUserVerified()) {
                showToast('You are already verified!', 'info', 2000);
                navigateTo('homePage', true);
                return;
            }
            if (STATE.captchaLocked) {
                showToast('Too many attempts. Please wait 60 seconds.', 'warning', 4000);
                return;
            }
            elements.robotBtn.classList.add('hidden');
            elements.captchaQuestion.classList.add('show');
            STATE.selectedColor = null;
            elements.colorBtns.forEach(btn => btn.classList.remove('selected'));
            elements.verifyBtn.classList.remove('enabled');
            elements.verifyStatus.textContent = '';
            elements.verifyStatus.className = 'verification-status';
            STATE.verified = false;
        });
    }

    elements.colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (STATE.verified) return;
            if (STATE.captchaLocked) {
                showToast('Captcha is locked. Please wait.', 'warning', 3000);
                return;
            }
            elements.colorBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            STATE.selectedColor = this.dataset.color;
            elements.verifyBtn.classList.add('enabled');
            elements.verifyStatus.textContent = '';
            elements.verifyStatus.className = 'verification-status';
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    if (elements.verifyBtn) {
        elements.verifyBtn.addEventListener('click', function() {
            if (!elements.verifyBtn.classList.contains('enabled')) return;
            if (!STATE.selectedColor) return;
            if (STATE.captchaLocked) {
                showToast('Captcha is locked. Please wait.', 'warning', 3000);
                return;
            }
            STATE.captchaAttempts++;
            if (STATE.captchaAttempts > 5) {
                STATE.captchaLocked = true;
                elements.verifyBtn.classList.remove('enabled');
                elements.verifyBtn.textContent = 'Locked (60s)';
                showToast('Too many attempts. Locked for 60 seconds.', 'error', 4000);
                STATE.captchaLockTimer = setTimeout(() => {
                    STATE.captchaLocked = false;
                    STATE.captchaAttempts = 0;
                    elements.verifyBtn.textContent = 'Verify';
                    if (STATE.selectedColor) {
                        elements.verifyBtn.classList.add('enabled');
                    }
                    showToast('Captcha unlocked. Try again.', 'info', 3000);
                }, 60000);
                return;
            }
            if (STATE.selectedColor === 'blue') {
                elements.verifyStatus.textContent = '✅ Verification Successful';
                elements.verifyStatus.className = 'verification-status success';
                STATE.verified = true;
                saveVerificationStatus();
                elements.verifyBtn.classList.remove('enabled');
                elements.verifyBtn.textContent = 'Verified ✓';
                showToast('Verification Successful!', 'success', 2000);
                setTimeout(() => {
                    const profile = loadProfile();
                    if (!profile) {
                        navigateTo('profileSetupPage', true);
                    } else {
                        navigateTo('homePage', true);
                    }
                }, 2000);
            } else {
                elements.verifyStatus.textContent = '❌ Verification Invalid';
                elements.verifyStatus.className = 'verification-status error';
                elements.colorBtns.forEach(btn => btn.classList.remove('selected'));
                STATE.selectedColor = null;
                elements.verifyBtn.classList.remove('enabled');
                showToast('Wrong color selected. Try again!', 'error', 3000);
            }
        });
    }

    // ================================================================
    //  5. NAVIGASI (Semua butang dengan data-page)
    // ================================================================

    elements.dataPageBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                e.preventDefault();
                if (!isUserVerified() && targetPage !== 'verificationPage') {
                    showToast('🔒 Please verify first!', 'warning', 3000);
                    return;
                }
                if (isUserVerified() && targetPage === 'verificationPage') {
                    showToast('You are already verified!', 'info', 2000);
                    navigateTo('homePage', true);
                    return;
                }
                if (targetPage === 'verificationPage') {
                    resetCaptcha();
                }
                navigateTo(targetPage, true);
            }
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ================================================================
    //  6. BACK TO TOP
    // ================================================================

    function handleBackToTop() {
        if (window.scrollY > 300) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    if (elements.backToTop) {
        elements.backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================================================================
    //  7. FAQ ACCORDION
    // ================================================================

    elements.faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            elements.faqQuestions.forEach(q => {
                if (q !== this && q.getAttribute('aria-expanded') === 'true') {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('open');
                    q.nextElementSibling.style.maxHeight = '0';
                }
            });
            this.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.classList.remove('open');
                answer.style.maxHeight = '0';
            }
        });
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ================================================================
    //  8. STICKY NAV SCROLL EFFECT
    // ================================================================

    function handleNavScroll() {
        if (window.scrollY > 10) {
            elements.stickyNav.classList.add('scrolled');
        } else {
            elements.stickyNav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ================================================================
    //  9. MOBILE NAV TOGGLE
    // ================================================================

    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', toggleMobileNav);
    }
    document.addEventListener('click', function(e) {
        if (elements.navLinks.classList.contains('open')) {
            const nav = elements.stickyNav;
            if (!nav.contains(e.target)) {
                closeMobileNav();
            }
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.navLinks.classList.contains('open')) {
            closeMobileNav();
        }
    });

    // ================================================================
    //  10. HISTORY API
    // ================================================================

    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            const pageId = event.state.page;
            if (!isUserVerified() && pageId !== 'verificationPage') {
                showToast('🔒 Please verify first!', 'warning', 3000);
                navigateTo('verificationPage', false);
                return;
            }
            if (isUserVerified() && pageId !== 'profileSetupPage' && pageId !== 'verificationPage') {
                const profile = loadProfile();
                if (!profile) {
                    navigateTo('profileSetupPage', false);
                    return;
                }
            }
            const pageEl = document.getElementById(pageId);
            if (pageEl) {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                pageEl.classList.add('active');
                STATE.currentPage = pageId;
                updateActiveNavLink(pageId);
                if (pageId === 'verificationPage') resetCaptcha();
                if (pageId === 'gamesPage') initGames();
                if (pageId === 'reviewsPage') loadReviews();
                if (pageId === 'settingsPage') { updateProfileDisplay(); renderChangelog(); }
                if (pageId === 'profileSetupPage') prefillProfileForm();
                if (pageId === 'homePage') updateGreeting();
            }
        }
    });

    // ================================================================
    //  11. PROFILE SETUP
    // ================================================================

    function prefillProfileForm() {
        const profile = loadProfile();
        if (!profile) return;
        if (elements.profileName) elements.profileName.value = profile.name || '';
        if (elements.profileUsername) elements.profileUsername.value = profile.username || '';
        if (elements.profileAge) elements.profileAge.value = profile.age || '';
        if (elements.profileGender) elements.profileGender.value = profile.gender || '';
        if (elements.profileRegion) elements.profileRegion.value = profile.region || '';
        if (elements.profileDiscordUser) elements.profileDiscordUser.value = profile.discordUsername || '';
        if (elements.profileDiscordId) elements.profileDiscordId.value = profile.discordId || '';
    }

    function isValidUsername(username) {
        return /^@[A-Za-z0-9]+$/.test(username);
    }

    if (elements.profileForm) {
        elements.profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = elements.profileName.value.trim();
            const username = elements.profileUsername.value.trim();
            const age = elements.profileAge.value;
            const gender = elements.profileGender.value;
            const region = elements.profileRegion.value;
            const discordUser = elements.profileDiscordUser.value.trim();
            const discordId = elements.profileDiscordId.value.trim();

            if (!name || !username || !age || !gender || !region) {
                showToast('Please fill in all required fields.', 'warning', 3000);
                return;
            }

            if (!isValidUsername(username)) {
                showToast('Username must start with @ and contain only letters and numbers (no spaces).', 'warning', 4000);
                return;
            }

            const existingProfile = loadProfile();
            const existingUsername = existingProfile ? existingProfile.username : null;
            const reviews = getLocalData('chillhub_reviews', []);
            const usernameTaken = reviews.some(r => r.username === username && r.username !== existingUsername);

            if (usernameTaken) {
                showToast('This username is already taken. Please choose another.', 'warning', 4000);
                return;
            }

            const profile = {
                name,
                username,
                age,
                gender,
                region,
                discordUsername: discordUser || '',
                discordId: discordId || '',
                score: loadProfile()?.score || 0,
            };

            saveProfile(profile);
            showToast('Profile saved successfully! 🎉', 'success', 3000);
            setTimeout(() => {
                navigateTo('homePage', true);
            }, 500);
        });
    }

    // ================================================================
    //  12. GAMES (Tic-Tac-Toe, RPS, Number Guessing)
    // ================================================================

    // ---- Tic-Tac-Toe AI ----
    let tttBoard = ['', '', '', '', '', '', '', '', ''];
    let tttCurrentPlayer = 'X';
    let tttGameOver = false;
    let tttPlayerScore = 0, tttAIScore = 0, tttDrawScore = 0;

    function loadTTTScores() {
        const scores = getLocalData('chillhub_ttt_scores', { player: 0, ai: 0, draw: 0 });
        tttPlayerScore = scores.player || 0;
        tttAIScore = scores.ai || 0;
        tttDrawScore = scores.draw || 0;
        updateTTTScoreDisplay();
    }

    function saveTTTScores() {
        setLocalData('chillhub_ttt_scores', { player: tttPlayerScore, ai: tttAIScore, draw: tttDrawScore });
    }

    function updateTTTScoreDisplay() {
        if (elements.tttPlayerScore) elements.tttPlayerScore.textContent = tttPlayerScore;
        if (elements.tttAIScore) elements.tttAIScore.textContent = tttAIScore;
        if (elements.tttDrawScore) elements.tttDrawScore.textContent = tttDrawScore;
    }

    function initTicTacToe() {
        tttBoard = ['', '', '', '', '', '', '', '', ''];
        tttCurrentPlayer = 'X';
        tttGameOver = false;
        renderTTT();
        elements.tttStatus.textContent = "Your turn (X)";
        loadTTTScores();
    }

    function renderTTT() {
        const board = elements.tttBoard;
        board.innerHTML = '';
        tttBoard.forEach((cell, index) => {
            const div = document.createElement('div');
            div.className = 'ttt-cell';
            if (cell) div.classList.add('taken');
            div.textContent = cell;
            div.dataset.index = index;
            div.addEventListener('click', () => handleTTTClick(index));
            div.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            div.setAttribute('role', 'button');
            div.setAttribute('tabindex', '0');
            board.appendChild(div);
        });
    }

    function handleTTTClick(index) {
        if (tttGameOver) return;
        if (tttCurrentPlayer !== 'X') return;
        if (tttBoard[index]) return;

        tttBoard[index] = 'X';
        renderTTT();

        const result = checkTTTWin(tttBoard);
        if (result) {
            tttGameOver = true;
            if (result === 'X') {
                tttPlayerScore++;
                addScore(1);
                elements.tttStatus.textContent = '🎉 You win!';
                showToast('You won! +1 score', 'success', 2000);
            } else if (result === 'O') {
                tttAIScore++;
                elements.tttStatus.textContent = '🤖 AI wins!';
            } else {
                tttDrawScore++;
                elements.tttStatus.textContent = "🤝 It's a draw!";
            }
            updateTTTScoreDisplay();
            saveTTTScores();
            highlightWinCells();
            return;
        }

        if (tttBoard.every(c => c !== '')) {
            tttGameOver = true;
            tttDrawScore++;
            elements.tttStatus.textContent = "🤝 It's a draw!";
            updateTTTScoreDisplay();
            saveTTTScores();
            return;
        }

        tttCurrentPlayer = 'O';
        elements.tttStatus.textContent = "AI thinking...";
        setTimeout(() => {
            aiMove();
        }, 300);
    }

    function aiMove() {
        if (tttGameOver) return;
        const move = getAIMove(tttBoard);
        if (move === null) return;
        tttBoard[move] = 'O';
        renderTTT();

        const result = checkTTTWin(tttBoard);
        if (result) {
            tttGameOver = true;
            if (result === 'X') {
                tttPlayerScore++;
                addScore(1);
                elements.tttStatus.textContent = '🎉 You win!';
                showToast('You won! +1 score', 'success', 2000);
            } else if (result === 'O') {
                tttAIScore++;
                elements.tttStatus.textContent = '🤖 AI wins!';
            } else {
                tttDrawScore++;
                elements.tttStatus.textContent = "🤝 It's a draw!";
            }
            updateTTTScoreDisplay();
            saveTTTScores();
            highlightWinCells();
            return;
        }

        if (tttBoard.every(c => c !== '')) {
            tttGameOver = true;
            tttDrawScore++;
            elements.tttStatus.textContent = "🤝 It's a draw!";
            updateTTTScoreDisplay();
            saveTTTScores();
            return;
        }

        tttCurrentPlayer = 'X';
        elements.tttStatus.textContent = "Your turn (X)";
    }

    function getAIMove(board) {
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                if (checkTTTWin(board) === 'O') {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                if (checkTTTWin(board) === 'X') {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        if (!board[4]) return 4;
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => !board[i]);
        if (availableCorners.length) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        const available = board.map((c, i) => c === '' ? i : null).filter(i => i !== null);
        if (!available.length) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    function checkTTTWin(board) {
        const lines = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        for (let line of lines) {
            const [a,b,c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    function highlightWinCells() {
        const lines = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        let winLine = null;
        for (let line of lines) {
            const [a,b,c] = line;
            if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
                winLine = line;
                break;
            }
        }
        if (winLine) {
            const cells = elements.tttBoard.querySelectorAll('.ttt-cell');
            winLine.forEach(i => cells[i].classList.add('win'));
        }
    }

    if (elements.tttReset) {
        elements.tttReset.addEventListener('click', function() {
            initTicTacToe();
            loadTTTScores();
        });
    }

    // ---- Rock Paper Scissors AI ----
    let rpsPlayerScore = 0, rpsComputerScore = 0, rpsDrawScore = 0;

    function loadRPSScores() {
        const scores = getLocalData('chillhub_rps_scores', { player: 0, computer: 0, draw: 0 });
        rpsPlayerScore = scores.player || 0;
        rpsComputerScore = scores.computer || 0;
        rpsDrawScore = scores.draw || 0;
        updateRPSScoreDisplay();
    }

    function saveRPSScores() {
        setLocalData('chillhub_rps_scores', { player: rpsPlayerScore, computer: rpsComputerScore, draw: rpsDrawScore });
    }

    function updateRPSScoreDisplay() {
        if (elements.rpsPlayerScore) elements.rpsPlayerScore.textContent = rpsPlayerScore;
        if (elements.rpsComputerScore) elements.rpsComputerScore.textContent = rpsComputerScore;
        if (elements.rpsDrawScore) elements.rpsDrawScore.textContent = rpsDrawScore;
    }

    function initRPS() {
        loadRPSScores();
        elements.rpsStatus.textContent = 'Choose your move!';
    }

    function playRPS(playerChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

        if (playerChoice === computerChoice) {
            rpsDrawScore++;
            elements.rpsStatus.textContent = `🤝 Draw! Both chose ${emojis[playerChoice]}`;
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            rpsPlayerScore++;
            addScore(1);
            elements.rpsStatus.textContent = `🎉 You win! ${emojis[playerChoice]} beats ${emojis[computerChoice]}`;
            showToast('You won! +1 score', 'success', 2000);
        } else {
            rpsComputerScore++;
            elements.rpsStatus.textContent = `😢 You lose! ${emojis[computerChoice]} beats ${emojis[playerChoice]}`;
        }
        updateRPSScoreDisplay();
        saveRPSScores();
    }

    elements.rpsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const choice = this.dataset.choice;
            playRPS(choice);
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    if (elements.rpsReset) {
        elements.rpsReset.addEventListener('click', function() {
            initRPS();
        });
    }

    // ---- Number Guessing Game ----
    const NG_MODES = {
        normal: { min: 1, max: 50, time: 60, points: 1, label: 'Normal', color: 'green' },
        medium: { min: 1, max: 100, time: 30, points: 2, label: 'Medium', color: 'yellow' },
        hard: { min: 1, max: 500, time: 15, points: 5, label: 'Hard', color: 'red' },
    };

    function initNumberGuessing() {
        setNGMode('normal');
        elements.ngModeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.dataset.mode;
                setNGMode(mode);
                resetNGame();
            });
        });
        elements.ngGuessBtn.addEventListener('click', handleNGGuess);
        elements.ngGuessInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleNGGuess();
            }
        });
        elements.ngResetBtn.addEventListener('click', resetNGame);
        resetNGame();
    }

    function setNGMode(mode) {
        STATE.ngMode = mode;
        const config = NG_MODES[mode];
        STATE.ngRangeMin = config.min;
        STATE.ngRangeMax = config.max;
        STATE.ngTimer = config.time;
        STATE.ngPointValue = config.points;

        elements.ngModeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        elements.ngRangeDisplay.textContent = `${config.min} – ${config.max}`;
        elements.ngGameArea.className = 'ng-game-area';
        elements.ngGameArea.classList.add(`mode-${mode}`);
        STATE.ngPoints = 0;
        elements.ngPointsDisplay.textContent = '0';
        elements.ngTimerDisplay.textContent = config.time;
        if (STATE.ngTimerInterval) {
            clearInterval(STATE.ngTimerInterval);
            STATE.ngTimerInterval = null;
        }
    }

    function resetNGame() {
        if (STATE.ngTimerInterval) {
            clearInterval(STATE.ngTimerInterval);
            STATE.ngTimerInterval = null;
        }
        const config = NG_MODES[STATE.ngMode];
        STATE.ngTarget = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
        STATE.ngAttempts = 0;
        STATE.ngGameActive = true;
        STATE.ngTimer = config.time;
        elements.ngTimerDisplay.textContent = config.time;
        elements.ngGuessInput.value = '';
        elements.ngGuessInput.disabled = false;
        elements.ngGuessBtn.disabled = false;
        elements.ngHintDisplay.textContent = `Guess a number between ${config.min} and ${config.max}`;
        elements.ngMessageDisplay.textContent = '';
        elements.ngMessageDisplay.style.color = '';
        startNGTimer();
    }

    function startNGTimer() {
        if (STATE.ngTimerInterval) clearInterval(STATE.ngTimerInterval);
        STATE.ngTimerInterval = setInterval(() => {
            STATE.ngTimer--;
            elements.ngTimerDisplay.textContent = STATE.ngTimer;
            if (STATE.ngTimer <= 0) {
                clearInterval(STATE.ngTimerInterval);
                STATE.ngTimerInterval = null;
                STATE.ngGameActive = false;
                elements.ngGuessInput.disabled = true;
                elements.ngGuessBtn.disabled = true;
                elements.ngMessageDisplay.textContent = '⏰ Time\'s up! You lose this round.';
                elements.ngMessageDisplay.style.color = '#ef5350';
            }
        }, 1000);
    }

    function handleNGGuess() {
        if (!STATE.ngGameActive) {
            elements.ngMessageDisplay.textContent = 'This round is over. Click "New Round" to play again.';
            elements.ngMessageDisplay.style.color = '#ffc107';
            return;
        }
        const input = elements.ngGuessInput.value.trim();
        if (input === '') {
            elements.ngMessageDisplay.textContent = 'Please enter a number.';
            elements.ngMessageDisplay.style.color = '#ffc107';
            return;
        }
        const guess = Number(input);
        const config = NG_MODES[STATE.ngMode];
        if (isNaN(guess) || guess < config.min || guess > config.max) {
            elements.ngMessageDisplay.textContent = `Please enter a number between ${config.min} and ${config.max}.`;
            elements.ngMessageDisplay.style.color = '#ffc107';
            return;
        }

        STATE.ngAttempts++;
        const target = STATE.ngTarget;

        if (guess === target) {
            STATE.ngGameActive = false;
            clearInterval(STATE.ngTimerInterval);
            STATE.ngTimerInterval = null;
            elements.ngGuessInput.disabled = true;
            elements.ngGuessBtn.disabled = true;
            STATE.ngPoints += STATE.ngPointValue;
            elements.ngPointsDisplay.textContent = STATE.ngPoints;
            const profile = loadProfile();
            if (profile) {
                profile.score = (profile.score || 0) + STATE.ngPointValue;
                saveProfile(profile);
                updateProfileDisplay();
            }
            elements.ngMessageDisplay.textContent = `🎉 Correct! The number was ${target}. You earned ${STATE.ngPointValue} point(s)!`;
            elements.ngMessageDisplay.style.color = '#4caf50';
        } else if (guess < target) {
            elements.ngMessageDisplay.textContent = `📈 Too low! Try higher. (Attempt ${STATE.ngAttempts})`;
            elements.ngMessageDisplay.style.color = '#1e88e5';
        } else {
            elements.ngMessageDisplay.textContent = `📉 Too high! Try lower. (Attempt ${STATE.ngAttempts})`;
            elements.ngMessageDisplay.style.color = '#1e88e5';
        }
        elements.ngGuessInput.value = '';
        elements.ngGuessInput.focus();
    }

    // ---- Game Tabs ----
    function initGames() {
        const activeTab = document.querySelector('.game-tab.active');
        if (activeTab) {
            const game = activeTab.dataset.game;
            Object.keys(elements.gameContents).forEach(key => {
                elements.gameContents[key].classList.toggle('active', key === game);
            });
            if (game === 'tictactoe') initTicTacToe();
            else if (game === 'rps') initRPS();
            else if (game === 'numberguess') { /* already initialized */ }
        } else {
            document.querySelector('.game-tab[data-game="tictactoe"]').classList.add('active');
            elements.gameContents.tictactoe.classList.add('active');
            elements.gameContents.rps.classList.remove('active');
            elements.gameContents.numberguess.classList.remove('active');
            initTicTacToe();
        }
    }

    elements.gameTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const game = this.dataset.game;
            elements.gameTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            Object.keys(elements.gameContents).forEach(key => {
                elements.gameContents[key].classList.toggle('active', key === game);
            });
            if (game === 'tictactoe') {
                initTicTacToe();
            } else if (game === 'rps') {
                initRPS();
            } else if (game === 'numberguess') {
                resetNGame();
            }
        });
    });

    // ================================================================
    //  13. REVIEWS – dengan klik untuk tunjuk Edit/Delete
    // ================================================================

    function loadReviews() {
        const reviews = getLocalData('chillhub_reviews', []);
        const list = elements.reviewsList;
        if (!list) return;

        const profile = loadProfile();
        const username = profile ? profile.username : null;

        const userReview = username ? reviews.find(r => r.username === username) : null;
        STATE.editingReviewId = userReview ? userReview.id : null;

        if (userReview) {
            elements.reviewRating.value = userReview.rating || 5;
            elements.reviewContent.value = userReview.text || '';
            elements.submitReviewBtn.textContent = '✏️ Update Review';
        } else {
            elements.reviewRating.value = 5;
            elements.reviewContent.value = '';
            elements.submitReviewBtn.textContent = '📤 Submit Review';
        }

        if (reviews.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📝</span>
                    <div class="empty-title">No reviews yet</div>
                    <div class="empty-desc">Be the first to share your experience with ChillHub Community!</div>
                </div>
            `;
            return;
        }

        let html = '';
        reviews.forEach(review => {
            const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            const isOwn = username && review.username === username;
            html += `
                <div class="review-item" data-review-id="${review.id}">
                    <div class="review-header">
                        <span class="review-author">${review.name || review.username || 'Anonymous'}</span>
                        <span class="review-stars">${stars}</span>
                    </div>
                    <div class="review-text">${review.text}</div>
                    <div class="review-date">${review.date || ''}</div>
                    ${isOwn ? `
                        <span class="click-hint">Click to show actions</span>
                        <div class="review-actions">
                            <button class="edit-btn" data-id="${review.id}">✏️ Edit</button>
                            <button class="delete-btn" data-id="${review.id}">🗑️ Delete</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        list.innerHTML = html;

        // ---------- TOGGLE REVIEW ACTIONS ON CLICK ----------
        list.querySelectorAll('.review-item').forEach(item => {
            const actions = item.querySelector('.review-actions');
            // Only add click listener if actions exist (own review)
            if (actions) {
                item.addEventListener('click', function(e) {
                    // Don't toggle if clicking on a button inside actions
                    if (e.target.closest('button')) return;
                    
                    // Close other open actions
                    list.querySelectorAll('.review-item .review-actions.show').forEach(el => {
                        if (el !== actions) el.classList.remove('show');
                    });
                    
                    // Toggle this one
                    actions.classList.toggle('show');
                });
            }
        });

        // ---------- EDIT BUTTON ----------
        list.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent toggle
                const id = parseInt(this.dataset.id);
                const review = reviews.find(r => r.id === id);
                if (review) {
                    elements.reviewRating.value = review.rating || 5;
                    elements.reviewContent.value = review.text || '';
                    elements.submitReviewBtn.textContent = '✏️ Update Review';
                    STATE.editingReviewId = id;
                    showToast('Edit your review', 'info', 2000);
                    document.querySelector('.review-form-container').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // ---------- DELETE BUTTON ----------
        list.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent toggle
                const id = parseInt(this.dataset.id);
                if (confirm('Are you sure you want to delete this review?')) {
                    let reviewsData = getLocalData('chillhub_reviews', []);
                    reviewsData = reviewsData.filter(r => r.id !== id);
                    setLocalData('chillhub_reviews', reviewsData);
                    showToast('Review deleted.', 'info', 2000);
                    loadReviews();
                }
            });
        });
    }

    // Submit / Update review
    if (elements.reviewForm) {
        elements.reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const profile = loadProfile();
            if (!profile) {
                showToast('Please set up your profile first.', 'warning', 3000);
                return;
            }

            const rating = parseInt(elements.reviewRating.value);
            const text = elements.reviewContent.value.trim();
            if (!text) {
                showToast('Please write a review.', 'warning', 3000);
                return;
            }

            let reviews = getLocalData('chillhub_reviews', []);
            const username = profile.username;

            if (STATE.editingReviewId) {
                const index = reviews.findIndex(r => r.id === STATE.editingReviewId);
                if (index !== -1) {
                    reviews[index].rating = rating;
                    reviews[index].text = text;
                    reviews[index].date = new Date().toLocaleString();
                    setLocalData('chillhub_reviews', reviews);
                    showToast('Review updated! ✅', 'success', 3000);
                    STATE.editingReviewId = null;
                    elements.submitReviewBtn.textContent = '📤 Submit Review';
                    loadReviews();
                }
            } else {
                if (reviews.some(r => r.username === username)) {
                    showToast('You already have a review. You can edit it instead.', 'warning', 3000);
                    return;
                }
                const newReview = {
                    id: Date.now(),
                    name: profile.name || profile.username,
                    username: username,
                    rating: rating,
                    text: text,
                    date: new Date().toLocaleString(),
                };
                reviews.push(newReview);
                setLocalData('chillhub_reviews', reviews);
                showToast('Review submitted! Thank you! 🎉', 'success', 3000);
                elements.reviewContent.value = '';
                elements.reviewRating.value = 5;
                loadReviews();
            }
        });
    }

    // ================================================================
    //  14. CHANGELOG
    // ================================================================

    const CHANGELOG_DATA = [
        {
            date: 'Jul 2026',
            title: '📢 General Update',
            changes: [
                'New WhatsApp button on Homepage',
                'Updated Discord button text',
                'New description and "What do we offer?" content',
                'Reviews: Click to show Edit/Delete buttons',
            ],
            badge: 'New'
        },
        {
            date: 'Jul 2026',
            title: '🎮 Minigames Update',
            changes: [
                'Added Number Guessing game',
                '3 modes: Normal, Medium, Hard',
                'Color-coded backgrounds for each mode',
                'Higher/Lower hints',
                'Points added to profile score',
            ],
            badge: ''
        },
        {
            date: 'Jul 2026',
            title: '📜 Regulation Update',
            changes: [
                'Added A | Rule Enforcement section',
                'Added B | Policy Enforcement (B1–B4)',
                'Added C | Guidelines Enforcement (C1–C2)',
                'Brand updated to ChillHubWeb',
            ],
            badge: ''
        },
        {
            date: 'Jul 2026',
            title: 'Final Update',
            changes: [
                'Only English language',
                'Rules A1–A10 complete',
                'Username: @ + alphanumeric',
                'Greeting shows full name',
                'Report & Appeal: Coming Soon',
            ],
            badge: ''
        }
    ];

    function renderChangelog() {
        const list = elements.changelogList;
        if (!list) return;
        let html = '';
        CHANGELOG_DATA.forEach(item => {
            html += `
                <div class="changelog-item">
                    <div class="changelog-date">${item.date}</div>
                    <div class="changelog-title">
                        ${item.title}
                        ${item.badge ? `<span class="changelog-badge">${item.badge}</span>` : ''}
                    </div>
                    ${item.changes.map(change => `<div class="changelog-change">${change}</div>`).join('')}
                </div>
            `;
        });
        list.innerHTML = html;
    }

    // ================================================================
    //  15. SETTINGS – Delete Data, Theme, Edit Profile
    // ================================================================

    if (elements.deleteDataBtn) {
        elements.deleteDataBtn.addEventListener('click', function() {
            if (confirm('⚠️ Are you sure you want to delete ALL your data? This cannot be undone!')) {
                const keysToRemove = [
                    'chillhub_profile',
                    'chillhub_verified',
                    'chillhub_ttt_scores',
                    'chillhub_rps_scores',
                    'chillhub_reviews',
                    'chillhub_theme',
                ];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                STATE.verified = false;
                STATE.profile = null;
                showToast('All data has been deleted.', 'info', 3000);
                setTimeout(() => {
                    resetCaptcha();
                    navigateTo('verificationPage', true);
                }, 500);
            }
        });
    }

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', function() {
            if (STATE.theme === 'dark') {
                STATE.theme = 'light';
                document.body.classList.add('light-mode');
                this.textContent = 'Light';
                saveTheme('light');
                showToast('Switched to Light mode', 'info', 2000);
            } else {
                STATE.theme = 'dark';
                document.body.classList.remove('light-mode');
                this.textContent = 'Dark';
                saveTheme('dark');
                showToast('Switched to Dark mode', 'info', 2000);
            }
        });
    }

    if (elements.editProfileBtn) {
        elements.editProfileBtn.addEventListener('click', function() {
            navigateTo('profileSetupPage', true);
        });
    }

    // ================================================================
    //  16. ESC TO CLOSE TOASTS
    // ================================================================

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const toasts = document.querySelectorAll('.toast:not(.hiding)');
            toasts.forEach(toast => {
                const closeBtn = toast.querySelector('.toast-close');
                if (closeBtn) closeBtn.click();
            });
        }
    });

    // ================================================================
    //  17. ERROR BOUNDARY
    // ================================================================

    window.addEventListener('error', function(e) {
        console.error('ChillHub Error:', e.message);
        showToast('Something went wrong. Please refresh the page.', 'error', 5000);
    });

    // ================================================================
    //  18. INITIALIZATION
    // ================================================================

    function init() {
        loadSettings();
        const alreadyVerified = isUserVerified();

        if (alreadyVerified) {
            const profile = loadProfile();
            if (!profile) {
                navigateTo('profileSetupPage', false);
                showToast('Please set up your profile.', 'info', 3000);
            } else {
                STATE.profile = profile;
                navigateTo('homePage', false);
                updateGreeting();
                showToast('Welcome back, ' + (profile.name || 'User') + '! 🎉', 'success', 3000);
            }
        } else {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            if (elements.verificationPage) {
                elements.verificationPage.classList.add('active');
                STATE.currentPage = 'verificationPage';
                resetCaptcha();
            }
        }

        updateActiveNavLink(STATE.currentPage);

        if (window.location.hash) {
            const hash = window.location.hash.replace('#', '');
            const pageEl = document.getElementById(hash);
            if (pageEl && hash !== 'verificationPage') {
                if (isUserVerified()) {
                    navigateTo(hash, false);
                } else {
                    window.location.hash = '';
                }
            }
        }

        handleBackToTop();

        // Initialize Number Guessing
        initNumberGuessing();

        if (document.getElementById('gamesPage').classList.contains('active')) {
            initGames();
        }
        if (document.getElementById('reviewsPage').classList.contains('active')) {
            loadReviews();
        }
        if (document.getElementById('settingsPage').classList.contains('active')) {
            updateProfileDisplay();
            renderChangelog();
        }
        if (document.getElementById('profileSetupPage').classList.contains('active')) {
            prefillProfileForm();
        }
        if (document.getElementById('homePage').classList.contains('active')) {
            updateGreeting();
        }

        console.log('✅ ChillHub Community (General Update) loaded successfully.');
    }

    // ================================================================
    //  19. START
    // ================================================================

    init();

}); // end DOMContentLoaded
