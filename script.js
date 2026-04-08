/* ============================================
   UYUXIO™ — Magnetic Fast Charger (SHOPIFY READY)
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

    const variants = {
        'single': { 
            id: 'single',
            name: '1x Essential Pack', 
            price: 19.95, 
            img: 'assets/Sdec8b644819e49c192abb98e4a00d270a.avif', 
            comp: '1x Charger + Vent Mount',
            idShopify: '53262729150807'
        },
        'premium': { 
            id: 'premium',
            name: '1x Professional Kit', 
            price: 29.95, 
            img: 'assets/Saf21dc3181ec40458cc31174cd652275o.avif', 
            comp: '1x Charger + 1x Fast Cable',
            idShopify: '53262729281879'
        },
        'double': { 
            id: 'double',
            name: '2x Executive Bundle', 
            price: 39.95, 
            img: 'assets/S6b014cb16bce45058062f0d5aa098a39b.avif', 
            comp: '2x Complete Kits',
            idShopify: '53262729412951'
        }
    };

    let cart = [];
    let activeVariantId = 'premium';

    // Elements
    const bundleBoxes = document.querySelectorAll('.bundle-box');
    const mainHeroImg = document.getElementById('mainHeroImg');
    const btnPrice = document.getElementById('btnPrice');
    const stickyPrice = document.getElementById('stickyPrice');
    const cartCount = document.querySelector('.cart-count');
    const sideCart = document.getElementById('sideCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const progressFill = document.getElementById('progressFill');
    const shippingText = document.getElementById('shippingText');
    const cartUpsell = document.getElementById('cartUpsell');

    // Bundle Selection
    bundleBoxes.forEach(box => {
        box.addEventListener('click', () => {
            bundleBoxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');
            activeVariantId = box.dataset.id;
            const data = variants[activeVariantId];
            btnPrice.textContent = `$${data.price}`;
            stickyPrice.textContent = `$${data.price}`;
            if(mainHeroImg) {
                mainHeroImg.style.opacity = '0.5';
                setTimeout(() => { mainHeroImg.src = data.img; mainHeroImg.style.opacity = '1'; }, 150);
            }
        });
    });

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
        let hasSingle = false;

        cart.forEach((item, index) => {
            subtotal += item.price;
            if (item.id === 'single') hasSingle = true;
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

        const progress = Math.min((subtotal / 50) * 100, 100);
        progressFill.style.width = `${progress}%`;
        if (subtotal >= 50) {
            shippingText.innerHTML = lang === 'es' ? "¡Envío GRATUITO desbloqueado!" : "FREE Shipping Unlocked!";
            shippingText.style.color = '#10B981';
        } else {
            const remaining = (50 - subtotal).toFixed(2);
            shippingText.innerHTML = lang === 'es' ? `Añade <strong>$${remaining}</strong> más para activar Envío Gratis` : `Add <strong>$${remaining}</strong> more for Free Shipping`;
            shippingText.style.color = 'var(--text-main)';
        }

        if (hasSingle && cart.length === 1) {
            cartUpsell.innerHTML = `
                <div class="cart-upsell" style="margin:20px 0; border:1px dashed var(--brand-accent); background:#F0F9FF; display:block;">
                    <div class="upsell-header" style="color:var(--brand-accent)">Limited Time Offer</div>
                    <p style="font-size:0.85rem; margin-bottom:12px; font-weight:500;">${t['upsell_title']}</p>
                    <button class="btn btn-primary" id="applyUpsell" style="padding:10px; font-size:0.85rem; border-radius:8px;">${t['upsell_btn']}</button>
                </div>`;
            document.getElementById('applyUpsell').addEventListener('click', () => {
                cart = cart.map(item => item.id === 'single' ? variants['double'] : item);
                updateCart();
            });
        } else { cartUpsell.innerHTML = ''; }

        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => { cart.splice(e.target.dataset.index, 1); updateCart(); }));
    }

    document.getElementById('buyNowBtn').addEventListener('click', () => { cart.push(variants[activeVariantId]); updateCart(); toggleCart(); });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) return;
        const cartString = cart.map(item => `${item.idShopify}:1`).join(',');
        window.location.href = `https://${MY_SHOPIFY_DOMAIN}/cart/${cartString}?checkout=1`;
    });

    window.addEventListener('scroll', () => {
        const buySection = document.getElementById('buy');
        if (window.scrollY > 600 && (window.scrollY + window.innerHeight) < buySection.offsetTop + 300) {
            document.getElementById('stickyCta').classList.add('active');
        } else { document.getElementById('stickyCta').classList.remove('active'); }
    }, { passive: true });

    document.getElementById('stickyBuyBtn').addEventListener('click', () => document.getElementById('buyNowBtn').click());

    updateCart();
});
