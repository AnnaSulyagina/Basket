const products = [
    { id: 1, name: 'Те Гуань Инь', category: 'Зелёный чай', price: 850, weight: 100, img: 'img/товар (1).png', desc: 'Классический улун с цветочным ароматом и мягким сливочным послевкусием. Обладает освежающим эффектом.' },
    { id: 2, name: 'Да Хун Пао', category: 'Чёрный чай', price: 1200, weight: 100, img: 'img/товар (2).png', desc: 'Легендарный темный улун с глубоким минеральным вкусом и нотами печеной груши. Согревающий и бодрящий.' },
    { id: 3, name: 'Шу Пуэр', category: 'Чёрный чай', price: 950, weight: 100, img: 'img/товар (3).png', desc: 'Плотный и землистый вкус с нотками влажного дерева и чернослива. Отлично тонизирует и согревает.' },
    { id: 4, name: 'Лунцзин', category: 'Зелёный чай', price: 700, weight: 100, img: 'img/товар (4).png', desc: 'Знаменитый зеленый чай с плоскими листьями. Обладает свежим травянистым вкусом и ароматом жареных каштанов.' },
    { id: 5, name: 'Белый Пион', category: 'Белый чай', price: 1100, weight: 100, img: 'img/товар (5).jpg', desc: 'Нежный белый чай с цветочными и медовыми нотами. Мягкий, сладковатый и очень ароматный напиток.' },
    { id: 6, name: 'Дянь Хун', category: 'Чёрный чай', price: 650, weight: 100, img: 'img/пиала (2).png', desc: 'Красный чай из провинции Юньнань. Характеризуется солодовым вкусом с оттенками шоколада и сухофруктов.' }
];

let cart = JSON.parse(localStorage.getItem('teaCart')) || [];
let selectedItems = JSON.parse(localStorage.getItem('teaSelected')) || cart.map(i => i.id);

const cartGrid = document.getElementById('cart-grid');
const totalItemsEl = document.getElementById('total-items');
const totalWeightEl = document.getElementById('total-weight');
const totalPriceEl = document.getElementById('total-price');

function renderCart() {
    cartGrid.innerHTML = '';
    
    if (cart.length === 0) {
        cartGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: rgba(255,255,255,0.5);">Корзина пуста. <br><a href="index.html" style="color:#889679;">Перейти в каталог</a></div>';
        updateSummary();
        return;
    }

    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        const isChecked = selectedItems.includes(item.id);
        
        // Используем разметку из вашего файла
        const card = document.createElement('div');
        card.className = 'tea-card';
        card.dataset.name = p.name;
        card.dataset.weight = p.weight;
        card.innerHTML = `
            <input type="checkbox" class="tea-checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''}>
            <img src="${p.img}" alt="${p.name}" class="tea-image" onerror="this.style.display='none'">
            <div class="tea-header">
                <span class="tea-title">${p.name}</span>
                <span class="tea-weight">${p.weight} г</span>
            </div>
            <details class="tea-details">
                <summary>
                    <span class="summary-text">${p.category}</span>
                    <span class="toggle-icon">+</span>
                </summary>
                <div class="tea-desc-text">${p.desc}</div>
            </details>
            <div class="tea-footer">
                <div class="tea-price-bottom" data-price="${p.price}">${p.price * item.qty} ₽</div>
                <div class="quantity-control">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <input type="text" class="qty-input" value="${item.qty}" readonly>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        cartGrid.appendChild(card);
    });

    attachEvents();
    updateSummary();
}

function updateSummary() {
    let totalQty = 0, totalWeight = 0, totalPrice = 0;
    
    cart.forEach(item => {
        if (selectedItems.includes(item.id)) {
            const p = products.find(prod => prod.id === item.id);
            totalQty += item.qty;
            totalWeight += p.weight * item.qty;
            totalPrice += p.price * item.qty;
        }
    });

    totalItemsEl.textContent = totalQty + ' шт.';
    totalWeightEl.textContent = totalWeight + ' г';
    totalPriceEl.textContent = totalPrice + ' ₽';
    
    localStorage.setItem('teaSelected', JSON.stringify(selectedItems));
}

function attachEvents() {
    // Чекбоксы
    document.querySelectorAll('.tea-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            if (e.target.checked) {
                if (!selectedItems.includes(id)) selectedItems.push(id);
            } else {
                selectedItems = selectedItems.filter(i => i !== id);
            }
            updateSummary();
        });
    });

    // Кнопки +/-
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            const card = btn.closest('.tea-card');
            const input = card.querySelector('.qty-input');
            const priceEl = card.querySelector('.tea-price-bottom');
            const basePrice = parseInt(priceEl.dataset.price);
            let qty = parseInt(input.value);

            if (btn.classList.contains('plus')) {
                qty++;
            } else {
                qty--;
            }

            if (qty === 0) {
                if (confirm(`Удалить "${products.find(p=>p.id===id).name}" из корзины?`)) {
                    cart = cart.filter(i => i.id !== id);
                    selectedItems = selectedItems.filter(i => i !== id);
                    localStorage.setItem('teaCart', JSON.stringify(cart));
                    renderCart();
                }
            } else {
                item.qty = qty;
                input.value = qty;
                priceEl.textContent = (basePrice * qty) + ' ₽';
                localStorage.setItem('teaCart', JSON.stringify(cart));
                updateSummary();
            }
        });
    });
}

// Модальное окно
const modal = document.getElementById('address-modal');
document.getElementById('open-address-modal').addEventListener('click', () => modal.classList.add('active'));
document.getElementById('close-modal').addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

let selectedAddress = '';
document.querySelectorAll('.address-item').forEach(item => {
    item.addEventListener('click', () => {
        selectedAddress = item.dataset.address;
        document.getElementById('selected-address').textContent = selectedAddress;
        modal.classList.remove('active');
    });
});

// Оформление заказа
document.getElementById('checkout-btn').addEventListener('click', () => {
    const itemsToOrder = cart.filter(i => selectedItems.includes(i.id));
    
    if (itemsToOrder.length === 0) return alert('Выберите хотя бы один товар');
    if (!selectedAddress) return alert('Выберите адрес магазина');

    const payment = document.querySelector('input[name="payment"]:checked').value;
    const totalPrice = document.getElementById('total-price').textContent;

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        items: itemsToOrder.map(item => {
            const p = products.find(prod => prod.id === item.id);
            return { name: p.name, qty: item.qty, price: p.price, weight: p.weight, total: p.price * item.qty };
        }),
        total: totalPrice,
        address: selectedAddress,
        payment: payment
    };

    const orders = JSON.parse(localStorage.getItem('teaOrders')) || [];
    orders.unshift(order);
    localStorage.setItem('teaOrders', JSON.stringify(orders));

    // Удаляем только оформленные товары
    cart = cart.filter(i => !selectedItems.includes(i.id));
    selectedItems = [];
    
    localStorage.setItem('teaCart', JSON.stringify(cart));
    localStorage.setItem('teaSelected', JSON.stringify(selectedItems));
    
    alert('Заказ успешно оформлен!');
    window.location.href = 'orders.html';
});

renderCart();