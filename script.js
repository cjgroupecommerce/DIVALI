/* ============================================
   DIVALVI™ — Premium Interaction Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === i18n Logic (Fixed to Spanish) ===
    function applyTranslations() {
        const lang = 'es'; // Force Spanish as requested
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                // Check if it should be innerHTML for some items if needed, but innerText is safer and usually enough
                el.innerText = text;
            }
        });
    }

    applyTranslations();

    // === Shopify Configuration ===
    const MY_SHOPIFY_DOMAIN = 'cueg8x-yb.myshopify.com'; 

    const baseProduct = { 
        id: 'premium',
        name: 'DIVALVI™ Magnetic Pack', 
        price: 22.00, 
        img: 'assets/Sdec8b644819e49c192abb98e4a00d270a.avif', 
        comp: 'Full Kit: Cargador + Soporte + Cable',
        idShopify: '53262729281879' 
    };

    let cart = [];

    // UI Elements
    const stickyPrice = document.getElementById('stickyPrice');
    const cartCount = document.querySelector('.cart-count');
    const sideCart = document.getElementById('sideCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const progressFill = document.getElementById('progressFill');
    const shippingText = document.getElementById('shippingText');

    if(stickyPrice) stickyPrice.textContent = `22,00€`;

    // Cart Navigation
    function toggleCart() {
        sideCart.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = sideCart.classList.contains('active') ? 'hidden' : '';
    }

    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('cartClose').addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Update Cart Contents
    function updateCart() {
        const t = translations['es'];

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
                        <h4 style="font-weight:700;">${item.name}</h4>
                        <p style="font-size:0.85rem; color:#6E6E73;">${item.comp}</p>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
                            <div class="qty-controls" style="display:flex; align-items:center; gap:16px; background:#F5F5F7; padding:6px 14px; border-radius:99px;">
                                <button class="qty-btn minus" data-index="${index}" style="border:none; background:none; cursor:pointer; font-weight:700;">-</button>
                                <span style="font-size:0.9rem; font-weight:700;">${item.qty || 1}</span>
                                <button class="qty-btn plus" data-index="${index}" style="border:none; background:none; cursor:pointer; font-weight:700;">+</button>
                            </div>
                            <span style="font-weight:800; color:#000; font-size:1.1rem;">${(item.price * (item.qty || 1)).toFixed(2)}€</span>
                        </div>
                        <button class="remove-link" data-index="${index}" style="border:none; background:none; color:#FF3B30; font-size:0.75rem; font-weight:600; cursor:pointer; margin-top:16px; padding:0; text-decoration:underline;">Eliminar</button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html || `<p style="text-align:center; padding:60px 20px; color:#6E6E73; font-size:0.95rem;">${t['cart_empty']}</p>`;
        cartTotalAmount.textContent = `${subtotal.toFixed(2)}€`;

        // Shipping Progress Check
        const threshold = 40; 
        const progress = Math.min((subtotal / threshold) * 100, 100);
        if(progressFill) progressFill.style.width = `${progress}%`;
        
        if (subtotal >= threshold) {
            if(shippingText) {
                shippingText.innerText = t['cart_unlocked'];
                shippingText.style.color = '#34C759';
            }
        } else if(shippingText) {
            const remaining = (threshold - subtotal).toFixed(2);
            shippingText.innerHTML = `${t['cart_remaining_pos']} <strong>${remaining}€</strong> ${t['cart_remaining_neg']}`;
            shippingText.style.color = '#000';
        }

        // Re-attach listeners for dynamic content
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

    // Bundle Selection State
    const bundleOptions = document.querySelectorAll('.bundle-option');
    let selectedBundle = {
        name: 'Pack Individual (Essential)',
        price: 22.00,
        desc: '1x DIVALVI™ Elite Pack',
        variant: '53272784208215',
        qty: 1
    };

    bundleOptions.forEach(option => {
        option.addEventListener('click', () => {
            bundleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedBundle = {
                name: option.querySelector('h4').innerText,
                price: parseFloat(option.dataset.price),
                desc: option.querySelector('p').innerText,
                variant: option.dataset.variant,
                qty: parseInt(option.dataset.qty) || 1
            };
            if(stickyPrice) stickyPrice.textContent = `${selectedBundle.price.toFixed(2)}€`;
        });
    });

    // Handle Buy Action
    document.getElementById('buyNowBtn').addEventListener('click', () => { 
        const itemToAdd = {
            name: selectedBundle.name,
            price: selectedBundle.price,
            comp: selectedBundle.desc,
            idShopify: selectedBundle.variant,
            qty: selectedBundle.qty
        };
        // Reset cart for direct purchase focus (one offer at a time)
        cart = [itemToAdd]; 
        updateCart(); 
        toggleCart(); 
    });

    // Shopify Redirect
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) return;
        const item = cart[0];
        window.location.href = `https://${MY_SHOPIFY_DOMAIN}/cart/${item.idShopify}:${item.qty || 1}`;
    });

    // Sticky CTA Visibility
    window.addEventListener('scroll', () => {
        const buySection = document.getElementById('buy');
        const heroSection = document.getElementById('hero');
        if (buySection && window.scrollY > 800 && (window.scrollY + window.innerHeight) < buySection.offsetTop + 300) {
            document.getElementById('stickyCta').classList.add('active');
        } else { 
            document.getElementById('stickyCta').classList.remove('active'); 
        }
    }, { passive: true });

    document.getElementById('stickyBuyBtn').addEventListener('click', () => {
        document.getElementById('buyNowBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    updateCart();
});
