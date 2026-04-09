/* ============================================
   FluxoDrive™ — Magnetic Fast Charger (SHOPIFY READY)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === CONFIGURACIÓN i18n ===
    function getLang() {
        const userLang = navigator.language.substring(0, 2); 
        return translations[userLang] ? userLang : 'en';
    }

    function applyTranslations() {
        const lang = getLang();
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
        price: 22.00, 
        img: 'assets/Sdec8b644819e49c192abb98e4a00d270a.avif', 
        comp: 'Full Kit: Charger + Vent Mount + Cable',
        idShopify: '53262729281879' 
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

    if(stickyPrice) stickyPrice.textContent = `${product.price}€`;

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
        const lang = getLang();
        const t = translations[lang];

        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';

        cartItemsContainer.innerHTML = '';
        let html = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * (item.qty || 1);
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.comp}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                            <div class="qty-controls" style="display:flex; align-items:center; gap:12px; background:var(--light); padding:4px 10px; border-radius:99px;">
                                <button class="qty-btn minus" data-index="${index}" style="border:none; background:none; cursor:pointer; font-weight:700; width:20px; color:var(--text-main);">-</button>
                                <span style="font-size:0.9rem; font-weight:600; min-width:15px; text-align:center;">${item.qty || 1}</span>
                                <button class="qty-btn plus" data-index="${index}" style="border:none; background:none; cursor:pointer; font-weight:700; width:20px; color:var(--text-main);">+</button>
                            </div>
                            <span style="font-weight:700; color:var(--text-main); font-size:1.1rem;">${(item.price * (item.qty || 1)).toFixed(2)}€</span>
                        </div>
                        <button class="remove-link" data-index="${index}" style="border:none; background:none; color:var(--error); font-size:0.75rem; font-weight:600; cursor:pointer; margin-top:12px; padding:0; text-decoration:underline;">${lang === 'es' ? 'Eliminar del carrito' : 'Remove item'}</button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html || `<p style="text-align:center; padding:40px; color:#94A3B8; font-size:0.9rem;">${t['cart_empty']}</p>`;
        cartTotalAmount.textContent = `${subtotal.toFixed(2)}€`;

        // Update progress bar
        const progress = Math.min((subtotal / 40) * 100, 100);
        if(progressFill) progressFill.style.width = `${progress}%`;
        
        if (subtotal >= 40) {
            if(shippingText) {
                shippingText.innerHTML = t['cart_unlocked'];
                shippingText.style.color = '#10B981';
            }
        } else if(shippingText) {
            const remaining = (40 - subtotal).toFixed(2);
            shippingText.innerHTML = `${t['cart_remaining_pos']}<strong>${remaining}€</strong>${t['cart_remaining_neg']}`;
            shippingText.style.color = 'var(--text-main)';
        }

        // Add Listeners
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                cart[idx].qty = (cart[idx].qty || 1) + 1;
                updateCart();
            });
        });

        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else {
                    cart.splice(idx, 1);
                }
                updateCart();
            });
        });

        document.querySelectorAll('.remove-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(e.target.dataset.index, 1);
                updateCart();
            });
        });
    }

    // Bundle Selection Logic
    const bundleOptions = document.querySelectorAll('.bundle-option');
    let selectedBundle = {
        name: 'Single Pack',
        price: 22.00,
        desc: '1x FluxoDrive™ Elite Pack',
        variant: '53272784208215',
        qty: 1
    };

    bundleOptions.forEach(option => {
        option.addEventListener('click', () => {
            bundleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedBundle = {
                name: option.dataset.name,
                price: parseFloat(option.dataset.price),
                desc: option.dataset.desc,
                variant: option.dataset.variant,
                qty: parseInt(option.dataset.qty) || 1
            };
        });
    });

    document.getElementById('buyNowBtn').addEventListener('click', () => { 
        const itemToAdd = {
            ...product,
            name: selectedBundle.name,
            price: selectedBundle.price,
            comp: selectedBundle.desc,
            idShopify: selectedBundle.variant,
            qty: selectedBundle.qty
        };
        // Reset cart to only the current selection
        cart = [itemToAdd]; 
        updateCart(); 
        toggleCart(); 
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) return;
        const firstItem = cart[0];
        // Permalinks (ID:QTY) automatically clear previous items and redirect correctly
        window.location.href = `https://${MY_SHOPIFY_DOMAIN}/cart/${firstItem.idShopify}:${firstItem.qty || 1}`;
    });

    window.addEventListener('scroll', () => {
        const buySection = document.getElementById('buy');
        if (buySection && window.scrollY > 600 && (window.scrollY + window.innerHeight) < buySection.offsetTop + 400) {
            document.getElementById('stickyCta').classList.add('active');
        } else { document.getElementById('stickyCta').classList.remove('active'); }
    }, { passive: true });

    document.getElementById('stickyBuyBtn').addEventListener('click', () => document.getElementById('buyNowBtn').click());

    updateCart();
});
