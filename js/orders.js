const orders = JSON.parse(localStorage.getItem('teaOrders')) || [];
const ordersList = document.getElementById('orders-list');

if (orders.length === 0) {
    ordersList.innerHTML = '<div style="text-align: center; padding: 50px; color: rgba(255,255,255,0.5);">У вас пока нет заказов. <br><a href="index.html" style="color:#889679;">Перейти в каталог</a></div>';
} else {
    orders.forEach((order, index) => {
        const orderEl = document.createElement('details');
        orderEl.className = 'order-item';
        
        // Сводная строка
        orderEl.innerHTML = `
            <summary>
                <div class="order-summary-info">
                    <span>Заказ №${order.id.toString().slice(-4)}</span>
                    <span>${order.date.split(',')[0]}</span>
                    <span>${order.total}</span>
                </div>
            </summary>
            <div class="order-details-content">
                <p><span>Дата и время:</span> <span>${order.date}</span></p>
                <p><span>Адрес:</span> <span>${order.address}</span></p>
                <p><span>Оплата:</span> <span>${order.payment}</span></p>
                
                <table class="order-items-table">
                    <thead>
                        <tr><th>Товар</th><th>Кол-во</th><th>Вес</th><th>Сумма</th></tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.qty} шт.</td>
                                <td>${item.weight * item.qty} г</td>
                                <td>${item.total} ₽</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="order-total">Итого: ${order.total}</div>
            </div>
        `;
        ordersList.appendChild(orderEl);
    });
}