document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Page Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 800);
    });

    // --- 2. Single Page System (Routing) ---
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('[data-link]');

    function navigateTo(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
            if (view.id === `view-${viewId}`) {
                view.classList.add('active');
            }
        });

        // Update active class in nav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-link') === viewId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('data-link');
            navigateTo(viewId);
        });
    });

    // --- 3. Reveal on Scroll (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 4. Custom Ripple Effect ---
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) ripple.remove();

        button.appendChild(circle);
    }

    const rippleButtons = document.querySelectorAll(".btn-ripple");
    rippleButtons.forEach(btn => btn.addEventListener("click", createRipple));

    // --- 5. Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // --- 6. Scroll Progress Indicator ---
    window.onscroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scrollProgress").style.width = scrolled + "%";
    };

    // --- 7. Chatbot Logic ---
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('chat-close');

    chatToggle.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    chatClose.addEventListener('click', () => chatWindow.style.display = 'none');

    // --- 8. Dashboard Stats Counter ---
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const inc = target / 100;
            const updateCount = () => {
                if (count < target) {
                    count += inc;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Trigger counters only when dashboard view is active
    const dashboardLink = document.querySelector('[data-link="dashboard"]');
    dashboardLink.addEventListener('click', () => {
        setTimeout(animateCounters, 500);
    });

    // --- 9. Form Submission Handling (Auth Ready) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('login-btn');
            const spinner = btn.querySelector('.spinner');
            const btnText = btn.querySelector('.btn-text');

            // UI feedback
            spinner.classList.remove('hidden');
            btnText.style.opacity = '0';
            btn.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                console.log("Authentication call to Firebase...");
                navigateTo('dashboard');
                spinner.classList.add('hidden');
                btnText.style.opacity = '1';
                btn.disabled = false;
            }, 1500);
        });
    }
});