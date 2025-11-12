// ==================== PARTICLE BACKGROUND ====================
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== NEURAL NETWORK VISUALIZATION ====================
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-network');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes = [];
    const layers = 4;
    const nodesPerLayer = 6;

    // Create nodes
    for (let layer = 0; layer < layers; layer++) {
        for (let node = 0; node < nodesPerLayer; node++) {
            nodes.push({
                x: (canvas.width / (layers + 1)) * (layer + 1),
                y: (canvas.height / (nodesPerLayer + 1)) * (node + 1),
                layer: layer,
                activated: Math.random() > 0.5
            });
        }
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (otherNode.layer === node.layer + 1) {
                    const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
                    gradient.addColorStop(0, 'rgba(0, 245, 255, 0.1)');
                    gradient.addColorStop(1, 'rgba(123, 47, 247, 0.1)');
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = node.activated && otherNode.activated ? 2 : 0.5;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.stroke();
                }
            });
        });

        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.activated ? 8 : 5, 0, Math.PI * 2);
            
            if (node.activated) {
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
                gradient.addColorStop(0, 'rgba(0, 245, 255, 1)');
                gradient.addColorStop(1, 'rgba(0, 245, 255, 0.3)');
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
            }
            
            ctx.fill();
        });

        // Randomly activate nodes
        if (Math.random() > 0.95) {
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            randomNode.activated = !randomNode.activated;
        }
    }

    setInterval(drawNetwork, 100);
}

// ==================== LOCOMOTIVE SCROLL ====================
let scroll;

function initLocomotiveScroll() {
    if (scroll) {
        scroll.destroy();
    }

    const isMobile = window.innerWidth <= 768;

    // Only use smooth scroll on desktop
    if (!isMobile) {
        scroll = new LocomotiveScroll({
            el: document.querySelector('#main'),
            smooth: true,
            lerp: 0.08,
            multiplier: 1,
            smoothMobile: false,
            smartphone: { smooth: false },
            tablet: { smooth: false }
        });

        scroll.on('scroll', () => {});

        window.addEventListener('load', () => {
            if (scroll) scroll.update();
        });
    }
}

// ==================== LOADER ANIMATION ====================
function loaderAnimation() {
    const loader = document.querySelector("#loader");
    const progress = document.querySelector(".loading-progress");
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = "0";
                loader.style.transform = "translateY(-100%)";
                setTimeout(() => {
                    loader.style.display = "none";
                }, 800);
            }, 500);
        }
        progress.style.width = width + "%";
    }, 200);
}

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + (target === 98 ? '%' : '+');
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ==================== NAVBAR SCROLL EFFECT ====================
function navbarScrollEffect() {
    const nav = document.querySelector('nav');

    function handleScroll() {
        const scrollY = scroll ? scroll.scroll.instance.scroll.y : window.scrollY;
        if (scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    if (scroll) {
        scroll.on('scroll', handleScroll);
    } else {
        window.addEventListener('scroll', handleScroll);
    }
}

// ==================== MOBILE MENU ====================
function menuAnimation() {
    const menuToggle = document.querySelector("#menu-toggle");
    const mobileOverlay = document.querySelector("#mobile-menu-overlay");
    const mobileClose = document.querySelector("#mobile-close");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    const navLogo = document.querySelector(".nav-logo-container");

    let isMenuOpen = false;

    menuToggle.addEventListener("click", function () {
        if (!isMenuOpen) {
            mobileOverlay.classList.add("active");
            if (navLogo) navLogo.style.opacity = "0";
            isMenuOpen = true;
            document.body.style.overflow = "hidden";
        }
    });

    mobileClose.addEventListener("click", function () {
        mobileOverlay.classList.remove("active");
        if (navLogo) navLogo.style.opacity = "1";
        isMenuOpen = false;
        document.body.style.overflow = "auto";
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", function () {
            mobileOverlay.classList.remove("active");
            if (navLogo) navLogo.style.opacity = "1";
            isMenuOpen = false;
            document.body.style.overflow = "auto";
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isMenuOpen) {
            mobileOverlay.classList.remove("active");
            if (navLogo) navLogo.style.opacity = "1";
            isMenuOpen = false;
            document.body.style.overflow = "auto";
        }
    });
}

// ==================== SERVICE CARDS HOVER ====================
function serviceCardsAnimation() {
    const serviceCards = document.querySelectorAll('.service-card');
    const fixedImage = document.querySelector('#fixed-image');

    if (!fixedImage) return;

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const image = this.getAttribute('data-image');
            if (image) {
                fixedImage.style.backgroundImage = `url(${image})`;
                fixedImage.style.display = 'block';
            }
        });

        card.addEventListener('mousemove', function(e) {
            fixedImage.style.left = e.clientX + 20 + 'px';
            fixedImage.style.top = e.clientY + 20 + 'px';
        });

        card.addEventListener('mouseleave', function() {
            fixedImage.style.display = 'none';
        });
    });
}

// ==================== SWIPER SLIDER ====================
function swiperAnimation() {
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 80,
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: { spaceBetween: 20 },
            768: { spaceBetween: 50 },
            1024: { spaceBetween: 80 }
        }
    });
}

// ==================== SMOOTH SCROLL FOR LINKS ====================
function smoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                if (scroll) {
                    scroll.scrollTo(targetElement);
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ==================== PARALLAX EFFECT ====================
function parallaxEffect() {
    const floatingElements = document.querySelectorAll('.float-cube, .float-sphere, .float-pyramid');
    
    function handleParallax() {
        const scrollY = scroll ? scroll.scroll.instance.scroll.y : window.scrollY;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.03;
            element.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.05}deg)`;
        });
    }

    if (scroll) {
        scroll.on('scroll', handleParallax);
    } else {
        window.addEventListener('scroll', handleParallax);
    }
}

// ==================== ANIMATE ON SCROLL ====================
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .swiper-slide, .footer-col, .stat-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ==================== CURSOR EFFECT ====================
function customCursor() {
    if (window.innerWidth <= 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-inner"></div>';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();

    const hoverElements = document.querySelectorAll('a, button, .service-card, .swiper-slide, .stat-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Add cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(0, 245, 255, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.2s ease, border-color 0.2s ease;
        mix-blend-mode: difference;
    }
    .custom-cursor.hover {
        transform: scale(1.8);
        border-color: rgba(0, 245, 255, 1);
    }
    .cursor-inner {
        width: 6px;
        height: 6px;
        background: rgba(0, 245, 255, 1);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;
document.head.appendChild(cursorStyle);

// ==================== GLITCH EFFECT ON HOVER ====================
function glitchEffects() {
    const glitchTitles = document.querySelectorAll('.glitch-title');
    
    glitchTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.setAttribute('data-text', this.textContent);
            this.classList.add('glitch-active');
        });
        
        title.addEventListener('mouseleave', function() {
            this.classList.remove('glitch-active');
        });
    });
}

// ==================== AI CHAT WIDGET ====================
function initAIChatWidget() {
    const chatInput = document.querySelector('.chat-footer input');
    const chatButton = document.querySelector('.chat-footer button');
    const chatBody = document.querySelector('.chat-body');
    const aiChatBtn = document.querySelector('.ai-chat-btn');

    if (!chatInput || !chatButton) return;

    function addMessage(text, isBot = false) {
        const message = document.createElement('div');
        message.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        message.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(message);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, false);
            chatInput.value = '';
            
            setTimeout(() => {
                addMessage('Thank you for your message! Our AI team will analyze your request and get back to you shortly. 🚀', true);
            }, 1000);
        }
    }

    chatButton.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', () => {
            document.querySelector('#page5').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ==================== INITIALIZE ALL FUNCTIONS ====================
function init() {
    initParticles();
    initNeuralNetwork();
    initLocomotiveScroll();
    loaderAnimation();
    animateCounters();
    navbarScrollEffect();
    menuAnimation();
    serviceCardsAnimation();
    swiperAnimation();
    smoothScrollLinks();
    parallaxEffect();
    animateOnScroll();
    customCursor();
    glitchEffects();
    initAIChatWidget();
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Reinitialize on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const wasMobile = window.wasMobile || false;
        const isMobile = currentWidth <= 768;
        
        // Reinitialize scroll if switching between mobile/desktop
        if (isMobile !== wasMobile) {
            window.wasMobile = isMobile;
            initLocomotiveScroll();
        } else if (scroll) {
            scroll.update();
        }
    }, 250);
});

window.wasMobile = window.innerWidth <= 768;