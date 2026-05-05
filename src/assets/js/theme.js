/**
 * Luxe Store - Salla Theme JavaScript
 * Full Vanilla JS Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initAnnouncementDismiss();
    initCartDrawer();
    initMobileMenu();
    initMegaMenu();
    initFlashSaleTimer();
    initTestimonials();
    initNewsletterPopup();
    initBackToTop();
    initQuickView();
    initStickyATC();
    initRecentlyViewed();
    initProductTabs();
    initLuxeFaqAccordion();
    initLuxeCampaignTimers();
});

// --- Utility: Debounce ---
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
}

// --- ① Header Scroll Effect ---
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', debounce(() => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    }, 10));
}

// --- ② Announcement Topbar Dismiss ---
function initAnnouncementDismiss() {
    const bar = document.getElementById('announcementBar');
    if (!bar) return;

    if (sessionStorage.getItem('luxe_announcement_dismissed')) {
        bar.style.display = 'none';
    }

    const closeBtn = bar.querySelector('.announcement-bar__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            bar.style.display = 'none';
            sessionStorage.setItem('luxe_announcement_dismissed', 'true');
        });
    }
}

// --- ③ Cart Drawer Open/Close ---
function initCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const toggles = document.querySelectorAll('#cartToggleBtn');
    const closeBtn = document.getElementById('cartDrawerClose');

    if (!drawer) return;

    const openDrawer = () => {
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    };

    toggles.forEach(btn => btn.addEventListener('click', openDrawer));
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
}

// --- ④ Mobile Menu Open/Close ---
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileSidebarOverlay');
    const closeBtn = document.getElementById('closeMobileMenu');

    if (!btn || !sidebar) return;

    const openMenu = () => {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        document.body.classList.add('mobile-menu-open');
    };

    const closeMenu = () => {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        document.body.classList.remove('mobile-menu-open');
    };

    btn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
}

// --- ⑤ Mega Menu Hover ---
function initMegaMenu() {
    const items = document.querySelectorAll('.has-mega-menu');
    items.forEach(item => {
        let timeout;
        item.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            item.classList.add('mega-visible');
        });
        item.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                item.classList.remove('mega-visible');
            }, 150);
        });
    });
}

// --- ⑥ Flash Sale Countdown ---
function initLuxeCampaignTimers() {
    const roots = document.querySelectorAll('[data-luxe-campaign-end]');
    if (!roots.length) return;

    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
        const now = Date.now();
        roots.forEach((root) => {
            const end = new Date(root.getAttribute('data-luxe-campaign-end')).getTime();
            const distance = end - now;
            if (!Number.isFinite(end) || !Number.isFinite(distance) || distance < 0) {
                root.setAttribute('hidden', '');
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const d = root.querySelector('[data-part="d"]');
            const h = root.querySelector('[data-part="h"]');
            const m = root.querySelector('[data-part="m"]');
            const s = root.querySelector('[data-part="s"]');
            if (d) d.textContent = pad(days);
            if (h) h.textContent = pad(hours);
            if (m) m.textContent = pad(minutes);
            if (s) s.textContent = pad(seconds);
        });
    };

    setInterval(tick, 1000);
    tick();
}

function initFlashSaleTimer() {
    const countdownEl = document.getElementById('flashCountdown');
    if (!countdownEl) return;

    const endTime = new Date(countdownEl.dataset.end).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            countdownEl.closest('.flash-sale').remove();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const d = document.getElementById('days');
        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const s = document.getElementById('seconds');

        if (d) d.innerText = String(days).padStart(2, '0');
        if (h) h.innerText = String(hours).padStart(2, '0');
        if (m) m.innerText = String(minutes).padStart(2, '0');
        if (s) s.innerText = String(seconds).padStart(2, '0');
    };

    setInterval(updateTimer, 1000);
    updateTimer();
}

// --- ⑧ Testimonials Slider (Simplified Auto) ---
function initTestimonials() {
    // This could be more complex, but here's a basic auto-advance
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    // Implementation details for a real slider would go here
}

// --- ⑨ Newsletter Popup ---
function initNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (!popup) return;

    const showPopup = () => {
        if (!localStorage.getItem('luxe_newsletter_dismissed')) {
            popup.style.display = 'flex';
            popup.classList.add('fade-in');
        }
    };

    // Show after 5s
    setTimeout(showPopup, 5000);

    // Show on exit intent
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0) showPopup();
    });

    const closeBtn = document.getElementById('newsletterClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
            localStorage.setItem('luxe_newsletter_dismissed', 'true');
        });
    }
}

// --- ⑩ Back to Top ---
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', debounce(() => {
        btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, 100));

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- ⑫ Quick-View Modal ---
function initQuickView() {
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    const closeBtn = document.getElementById('quickViewClose');

    if (!modal) return;

    document.querySelectorAll('.btn-quick-view').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productId = btn.dataset.productId;
            modal.style.display = 'flex';
            content.innerHTML = '<div class="loading">جاري التحميل...</div>';

            try {
                if (typeof salla === 'undefined' || !salla.product || typeof salla.product.getDetails !== 'function') {
                    content.innerHTML = '<p class="loading">معاينة محلية: تفاصيل المنتج تظهر على المتجر المفعّل.</p>';
                    return;
                }
                const response = await salla.product.getDetails(productId);
                content.innerHTML = `
                    <div class="qv-product">
                        <img src="${response.data.image.url}" alt="${response.data.name}">
                        <div class="qv-info">
                            <h2>${response.data.name}</h2>
                            <p class="price">${response.data.price.formatted}</p>
                            <div class="qv-desc">${response.data.description}</div>
                            <salla-add-to-cart product-id="${productId}"></salla-add-to-cart>
                        </div>
                    </div>
                `;
            } catch (err) {
                content.innerHTML = 'حدث خطأ أثناء تحميل البيانات.';
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

// --- ⑬ Sticky Mobile ATC ---
function initStickyATC() {
    const sticky = document.getElementById('stickyATC');
    const mainATC = document.querySelector('.btn-atc-main');
    
    if (!sticky || !mainATC) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If main ATC is NOT visible, show sticky (on mobile)
            if (window.innerWidth < 768) {
                sticky.classList.toggle('visible', !entry.isIntersecting);
            }
        });
    }, { threshold: 0 });

    observer.observe(mainATC);
}

// --- ⑭ Recently Viewed ---
function initRecentlyViewed() {
    const STORAGE_KEY = 'luxe_recently_viewed';
    const container = document.getElementById('recentlyViewedContainer');
    const section = document.getElementById('recentlyViewedSection');

    // If on a single product page, add to list
    const productData = document.querySelector('article.product-card'); // Or body data attributes
    if (productData && window.location.pathname.includes('/p/')) {
        const id = productData.dataset.id;
        const name = document.querySelector('.product-main-title')?.innerText;
        const img = document.querySelector('.product-card__img')?.src;
        const url = window.location.href;

        let viewed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        viewed = viewed.filter(p => p.id !== id); // Remove duplicate
        viewed.unshift({ id, name, img, url });
        if (viewed.length > 10) viewed.pop();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    }

    // If on home page, render
    if (container) {
        const viewed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (viewed.length > 0) {
            section.style.display = 'block';
            container.innerHTML = viewed.map(p => `
                <article class="product-card">
                    <div class="product-card__image-wrap">
                        <a href="${p.url}">
                            <img class="product-card__img" src="${p.img}" alt="${p.name}">
                        </a>
                    </div>
                    <div class="product-card__info">
                        <h3 class="product-card__name"><a href="${p.url}">${p.name}</a></h3>
                    </div>
                </article>
            `).join('');
        }
    }
}

function initLuxeFaqAccordion() {
    document.querySelectorAll('.luxe-faq__q').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.luxe-faq__item');
            if (!item) return;
            const ans = item.querySelector('.luxe-faq__a');
            const open = !item.classList.contains('is-open');
            item.parentElement.querySelectorAll('.luxe-faq__item.is-open').forEach((o) => {
                if (o !== item) {
                    o.classList.remove('is-open');
                    const b = o.querySelector('.luxe-faq__q');
                    const a = o.querySelector('.luxe-faq__a');
                    if (b) b.setAttribute('aria-expanded', 'false');
                    if (a) a.hidden = true;
                }
            });
            item.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (ans) ans.hidden = !open;
        });
    });
}

// --- ⑯ Product Tabs ---
function initProductTabs() {
    const links = document.querySelectorAll('.tab-link');
    const panels = document.querySelectorAll('.tab-panel');

    links.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.dataset.tab;
            
            links.forEach(l => l.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(`tab-${target}`)?.classList.add('active');
        });
    });
}

// --- Toast Notification Utility ---
window.showToast = function(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type} glass-card`;
    toast.innerText = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, duration);
};
