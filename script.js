/* ============================================
   AeroSpace™ — Travel Pro Interactions (SHOPIFY + i18n READY)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === CONFIGURACIÓN i18n (AUTO-DETECCIÓN) ===
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

    // === CONFIGURACIÓN SHOPIFY (100% FUNCIONAL) ===
    const MY_SHOPIFY_DOMAIN = 'cueg8x-yb.myshopify.com'; 

    const variants = {
        'weekender': { 
            id: 'weekender',
            name: 'The Weekender', 
            price: 24.95, 
            img: 'assets/aerospace-hero.png', 
            comp: '(8 Pack: 3S 3M 2L)',
            idShopify: '53262729150807'
        },
        'globetrotter': { 
            id: 'globetrotter',
            name: 'The Globetrotter', 
            price: 34.95, 
            img: 'assets/aerospace-hero.png', 
            comp: '(10 Pack: 3S 3M 4L)',
            idShopify: '53262729281879'
        },
        'family': { 
            id: 'family',
            name: 'The Family Explorer', 
            price: 49.95, 
            img: 'assets/aerospace-family.png', 
            comp: '(16 Pack: 6S 5M 5L)',
            idShopify: '53262729412951'
        }
    };

    let cart = [];
    let activeVariantId = 'globetrotter';

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
                mainHeroImg.style.opacity = '0';
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
        let hasWeekender = false;

        cart.forEach((item, index) => {
            subtotal += item.price;
            if (item.id === 'weekender') hasWeekender = true;
            html += `
                <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div>
                        <h4 style="font-size:0.9rem">${item.name}</h4>
                        <p style="font-size:0.75rem; color:#666">${item.comp}</p>
                        <p style="font-weight:700">$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-btn" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer">Remove</button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html || `<p style="text-align:center; padding:30px; color:#999">${lang === 'es' ? 'Tu carrito está vacío.' : 'Your cart is empty.'}</p>`;
        cartTotalAmount.textContent = `$${subtotal.toFixed(2)}`;

        const progress = Math.min((subtotal / 30) * 100, 100);
        progressFill.style.width = `${progress}%`;
        if (subtotal >= 30) {
            shippingText.innerHTML = lang === 'es' ? "🎉 ¡Envío GRATIS desbloqueado!" : "🎉 Free Shipping Unlocked!";
            shippingText.style.color = '#38A169';
        } else {
            shippingText.innerHTML = lang === 'es' ? `Te faltan <strong>$${(30 - subtotal).toFixed(2)}</strong> para el Envío Gratis` : `You're <strong>$${(30 - subtotal).toFixed(2)}</strong> away from Free Shipping`;
        }

        if (hasWeekender && cart.length === 1) {
            cartUpsell.innerHTML = `
                <div class="upsell-container">
                    <div class="upsell-header">${t['upsell_title']}</div>
                    <button class="btn-upsell" id="applyUpsell">${t['upsell_btn']}</button>
                </div>`;
            document.getElementById('applyUpsell').addEventListener('click', () => {
                cart = cart.map(item => item.id === 'weekender' ? variants['globetrotter'] : item);
                updateCart();
            });
        } else { cartUpsell.innerHTML = ''; }

        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => { cart.splice(e.target.dataset.index, 1); updateCart(); }));
    }

    document.getElementById('buyNowBtn').addEventListener('click', () => { cart.push(variants[activeVariantId]); updateCart(); toggleCart(); });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) return alert('El carrito está vacío');
        const cartString = cart.map(item => `${item.idShopify}:1`).join(',');
        window.location.href = `https://${MY_SHOPIFY_DOMAIN}/cart/${cartString}`;
    });

    window.addEventListener('scroll', () => {
        const buySection = document.getElementById('buy');
        if (window.scrollY > 500 && (window.scrollY + window.innerHeight) < buySection.offsetTop + 200) {
            document.getElementById('stickyCta').classList.add('active');
        } else { document.getElementById('stickyCta').classList.remove('active'); }
    }, { passive: true });

    document.getElementById('stickyBuyBtn').addEventListener('click', () => document.getElementById('buyNowBtn').click());

    updateCart();
});
