// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

const VIDEOS = [
    {
        title: "How to Build a Net Logo",
        id: "zJMSBrNArzg",
        url: "https://youtu.be/zJMSBrNArzg?si=SV2LqvwAKKDQo5e-",
        thumbnail: "https://img.youtube.com/vi/zJMSBrNArzg/maxresdefault.jpg"
    },
    {
        title: "AI & Tech Explained",
        id: "dmBHvMUfDL8",
        url: "https://youtu.be/dmBHvMUfDL8?si=p6WuVLxVw3pEgtaV",
        thumbnail: "https://img.youtube.com/vi/dmBHvMUfDL8/maxresdefault.jpg"
    },
    {
        title: "Future of Kanishka Net",
        id: "femu3mA-NAw",
        url: "https://youtu.be/femu3mA-NAw?si=gRwb2jJaPJlYjsNa",
        thumbnail: "https://img.youtube.com/vi/femu3mA-NAw/maxresdefault.jpg"
    },
    {
        title: "Professional UI Design Hub",
        id: "u-G33yWO1X0",
        url: "https://youtu.be/u-G33yWO1X0?si=Jemcl_mHrJgiYSzG",
        thumbnail: "https://img.youtube.com/vi/u-G33yWO1X0/maxresdefault.jpg"
    }
];

// Helper to generate Unique ID
function generateUniqueId(email) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const absHash = Math.abs(hash);
    const nineDigit = (absHash % 900000000) + 100000000;
    return nineDigit.toString();
}

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Wait 2.5s matching the progress bar animation
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }, 2500);
    }

    // 2. Background Canvas Animation
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(0, 207, 255, ${Math.random() * 0.3})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animateCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            gradient.addColorStop(0, '#0a0a0a');
            gradient.addColorStop(1, '#050505');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        };

        initCanvas();
        animateCanvas();
        window.addEventListener('resize', initCanvas);
    }

    // 3. Render Videos
    const videoGrid = document.getElementById('video-grid');
    if (videoGrid) {
        VIDEOS.forEach((video, idx) => {
            const delay = idx * 100;
            const delayStyle = `transition-delay: ${delay}ms`;
            
            const a = document.createElement('a');
            a.href = video.url;
            a.target = "_blank";
            a.className = "group relative block aspect-video overflow-hidden rounded-[1.5rem] glass border border-white/10 scroll-fade";
            a.style.cssText = delayStyle;
            
            a.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p class="text-sm font-semibold text-white/90 group-hover:text-primary transition-colors line-clamp-1">${video.title}</p>
                </div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
                    <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform text-secondary">
                        <i data-lucide="video" class="w-6 h-6 z-20"></i>
                    </div>
                </div>
            `;
            videoGrid.appendChild(a);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 4. Authentication logic
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const authBox = document.getElementById('auth-box');
    const closeAuthBtn = document.getElementById('close-auth-bg');
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    function openAuthModal() {
        authModal.classList.remove('hidden');
        // brief timeout to allow display:block to apply before opacity transition
        setTimeout(() => {
            authBox.classList.remove('scale-90', 'opacity-0');
            authBox.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    function closeAuthModal() {
        authBox.classList.remove('scale-100', 'opacity-100');
        authBox.classList.add('scale-90', 'opacity-0');
        setTimeout(() => {
            authModal.classList.add('hidden');
        }, 300);
    }

    if (authBtn) authBtn.addEventListener('click', openAuthModal);
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);

    // Mock Login
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const mockEmail = "nadeeshancloud@gmail.com";
            currentUser = {
                uid: "google_" + Date.now(),
                email: mockEmail,
                displayName: "Amila Kanishka",
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kanishka",
                uniqueId: generateUniqueId(mockEmail)
            };
            localStorage.setItem('kanishka_user', JSON.stringify(currentUser));
            updateAuthUI();
            closeAuthModal();
        });
    }

    // Check Local Storage
    const savedUser = localStorage.getItem('kanishka_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }

    function updateAuthUI() {
        const authContainer = document.getElementById('auth-container');
        if (!authContainer) return;

        if (currentUser) {
            authContainer.innerHTML = `
                <div class="relative">
                    <button id="profile-btn" class="w-10 h-10 rounded-full border border-[#00cfff]/50 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                        <img src="${currentUser.photoURL}" alt="${currentUser.displayName}">
                    </button>
                    <div id="profile-dropdown" class="absolute right-0 mt-4 w-64 glass p-4 rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 opacity-0 scale-95 pointer-events-none">
                        <div class="flex flex-col items-center gap-2 mb-4">
                            <div class="w-16 h-16 rounded-full border-2 border-[#00cfff]/30 overflow-hidden mb-2">
                                <img src="${currentUser.photoURL}" alt="${currentUser.displayName}">
                            </div>
                            <span class="font-semibold">${currentUser.displayName}</span>
                            <span class="text-xs text-white/50">${currentUser.email}</span>
                            <div class="mt-2 px-3 py-1 bg-[#00cfff]/10 rounded-full border border-[#00cfff]/20">
                                <span class="text-[10px] text-[#00cfff] font-mono tracking-widest">ID: ${currentUser.uniqueId}</span>
                            </div>
                        </div>
                        <div class="grid gap-1">
                            <button class="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-sm w-full text-left">
                                <i data-lucide="user" class="w-4 h-4"></i> Profile
                            </button>
                            <button class="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-sm w-full text-left">
                                <i data-lucide="settings" class="w-4 h-4"></i> Account Settings
                            </button>
                            <hr class="my-2 border-white/5">
                            <button id="logout-btn" class="flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm w-full text-left">
                                <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            const profileBtn = document.getElementById('profile-btn');
            const profileDropdown = document.getElementById('profile-dropdown');
            
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = profileDropdown.classList.contains('opacity-0');
                if (isHidden) {
                    profileDropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                    profileDropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                } else {
                    profileDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                    profileDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                }
            });

            // Close dropdown if clicked outside
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                    profileDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                    profileDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                }
            });

            document.getElementById('logout-btn').addEventListener('click', () => {
                currentUser = null;
                localStorage.removeItem('kanishka_user');
                updateAuthUI();
            });

        } else {
            authContainer.innerHTML = `
                <button id="auth-btn-reactivated" class="flex items-center gap-2 px-6 py-2 bg-[#00cfff]/10 border border-[#00cfff]/30 text-[#00cfff] rounded-full font-medium hover:bg-[#00cfff] hover:text-[#0a0a0a] transition-all duration-300">
                    <i data-lucide="log-in" class="w-4 h-4"></i>
                    <span>Log In</span>
                </button>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            document.getElementById('auth-btn-reactivated').addEventListener('click', openAuthModal);
        }
    }

    // 5. Mobile Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const megaMenu = document.getElementById('mega-menu');
    const closeMenu = document.getElementById('close-menu');
    if (menuBtn && megaMenu && closeMenu) {
        menuBtn.addEventListener('click', () => {
            megaMenu.classList.remove('translate-x-full');
        });
        closeMenu.addEventListener('click', () => {
            megaMenu.classList.add('translate-x-full');
        });
        megaMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => megaMenu.classList.add('translate-x-full'));
        });
    }

    // 6. Scroll Animations (Intersection Observer for fade-in views)
    const fadeElements = document.querySelectorAll('.scroll-fade, .scroll-fade-right, .scroll-fade-left');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // animate only once like framer-motion `once:true`
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => observer.observe(el));

    // Back to top
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.remove('opacity-0', 'translate-y-10');
            } else {
                backToTop.classList.add('opacity-0', 'translate-y-10');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
