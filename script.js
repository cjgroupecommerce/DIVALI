/* ============================================
   FluxoDrive™ — Magnetic Fast Charger (SHOPIFY READY)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === CONFIGURACIÓN i18n ===
    function applyTranslations() {
        const userLang = navigator.language.substring(0, 2); 
        const lang = translations[userLang] ? userLang : 'en'; 
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }

    applyTranslations();

    // === CONFIGURACIÓN SHOPIFY ===
    const MY_SHOPIFY_DOMAIN = 'cueg8x-yb.myshopify.com'; 

    const product = { 
        id: 'premium',
        name: 'FluxoDrive™ Elite Magnetic Pack', 
        price: 29.95, 
        img: 'assets/Sdec8b644819e49c192abb98e4a00d270a.avif', 
        comp: 'Full Kit: Charger + Vent Mount + Cable',
        idShopify: '53262729281879' // Professional Kit ID
    };

    let cart = [];

    // Elements
    const stickyPrice = document.getElementById('stickyPrice');
    const cartCount = document.querySelector('.cart-count');
    const sideCart = document.getElementById('sideCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const progressFill = document.getElementById('progressFill');
    const shippingText = document.getElementById('shippingText');
    const cartUpsell = document.getElementById('cartUpsell');

    if(stickyPrice) stickyPrice.textContent = `$${product.price}`;

    // Cart Logic
    function toggleCart() {
        sideCart.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = sideCart.classList.contains('active') ? 'hidden' : '';
    }

    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('cartClose').addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function updateCart() {
        const userLang = navigator.language.substring(0, 2);
        const lang = translations[userLang] ? userLang : 'en';
        const t = translations[lang];

        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';

        let subtotal = 0;
        let html = '';

        cart.forEach((item, index) => {
            subtotal += item.price;
            html += `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.comp}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                            <span style="font-weight:700">$${item.price.toFixed(2)}</span>
                            <button class="remove-btn" data-index="${index}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html || `<p style="text-align:center; padding:40px; color:#94A3B8; font-size:0.9rem;">${lang === 'es' ? 'Tu carrito está vacío.' : 'Your cart is currently empty.'}</p>`;
        cartTotalAmount.textContent = `$${subtotal.toFixed(2)}`;

        // Progress bar (Threshold $50 for Free Shipping)
        const progress = Math.min((subtotal / 50) * 100, 100);
        if(progressFill) progressFill.style.width = `${progress}%`;
        
        if (subtotal >= 50) {
            if(shippingText) {
                shippingText.innerHTML = lang === 'es' ? "¡Envío GRATUITO desbloqueado!" : "FREE Shipping Unlocked!";
                shippingText.style.color = '#10B981';
            }
        } else if(shippingText) {
            const remaining = (50 - subtotal).toFixed(2);
            shippingText.innerHTML = lang === 'es' ? `Añade <strong>$${remaining}</strong> más para activar Envío Gratis` : `Add <strong>$${remaining}</strong> more for Free Shipping`;
            shippingText.style.color = 'var(--text-main)';
        }

        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => { cart.splice(e.target.dataset.index, 1); updateCart(); }));
    }

    document.getElementById('buyNowBtn').addEventListener('click', () => { cart.push(product); updateCart(); toggleCart(); });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) return;
        const cartString = cart.map(item => `${item.idShopify}:1`).join(',');
        window.location.href = `https://${MY_SHOPIFY_DOMAIN}/cart/${cartString}?checkout=1`;
    });

    window.addEventListener('scroll', () => {
        const buySection = document.getElementById('buy');
        if (window.scrollY > 600 && (window.scrollY + window.innerHeight) < buySection.offsetTop + 400) {
            document.getElementById('stickyCta').classList.add('active');
        } else { document.getElementById('stickyCta').classList.remove('active'); }
    }, { passive: true });

    document.getElementById('stickyBuyBtn').addEventListener('click', () => document.getElementById('buyNowBtn').click());

    updateCart();
});
