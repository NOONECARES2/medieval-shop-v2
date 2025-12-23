// cart.js - JavaScript файл для страницы корзины (cart.html)

// Корзина из localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Промокоды
const promoCodes = {
    'HISTORY10': 10,   // 10% скидка
    'KNIGHT15': 15,    // 15% скидка
    'CASTLE20': 20,    // 20% скидка
    'FIRSTORDER': 500  // 500 рублей скидка
};

// Текущий примененный промокод
let appliedPromo = null;

// Флаг для предотвращения рекурсии
let isUpdating = false;

// Данные продуктов для отображения (должны совпадать с данными в java.js)
const productsData = [
    {
        id: 1,
        name: "«Лев Англии»",
        description: "Черная футболка с золотым львом — символом отваги и королевской власти.",
        price: 2499,
        category: "coats",
        emoji: "🦁",
        color: "black"
    },
    {
        id: 2,
        name: "«Бог и моё право»",
        description: "Классическая белая футболка с латинским девизом и стилизованным шрифтом.",
        price: 2299,
        category: "mottos",
        emoji: "⚜️",
        color: "white"
    },
    {
        id: 3,
        name: "«Дракон Уэльса»",
        description: "Красный дракон на угольно-сером фоне. Хлопок премиум-качества.",
        price: 2599,
        category: "dragons",
        emoji: "🐉",
        color: "darkgray"
    },
    {
        id: 4,
        name: "«Стражи Замка»",
        description: "Темно-синяя футболка с изображением величественного средневекового замка.",
        price: 2399,
        category: "castles",
        emoji: "🏰",
        color: "navy"
    },
    {
        id: 5,
        name: "«Герб Франции»",
        description: "Королевские лилии на светло-голубом фоне. Символ французской монархии.",
        price: 2499,
        category: "coats",
        emoji: "⚜️",
        color: "lightblue"
    },
    {
        id: 6,
        name: "«Рыцарский девиз»",
        description: "Черная футболка с девизом «За веру и честь!» на старинном щите.",
        price: 2199,
        category: "mottos",
        emoji: "🛡️",
        color: "black"
    },
    {
        id: 7,
        name: "«Дракон гор»",
        description: "Зеленый дракон на черном фоне. Мифический страж горных вершин.",
        price: 2699,
        category: "dragons",
        emoji: "🐲",
        color: "black"
    },
    {
        id: 8,
        name: "«Башня Лондона»",
        description: "Легендарная крепость на темно-сером фоне. История в каждом камне.",
        price: 2499,
        category: "castles",
        emoji: "🏯",
        color: "darkgray"
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    console.log('Cart from localStorage:', cart);
    
    // Загрузить товары в корзину
    loadCartItems();
    
    // Настроить обработчики событий
    setupEventListeners();
});

// Загрузить товары в корзину
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    
    console.log('Loading cart items...');
    console.log('Cart items:', cart);
    
    // Очистить контейнер
    cartItemsContainer.innerHTML = '';
    
    // Проверить, пуста ли корзина
    if (cart.length === 0) {
        console.log('Cart is empty');
        emptyCartMessage.style.display = 'block';
        updateCartSummary();
        return;
    }
    
    // Скрыть сообщение о пустой корзине
    emptyCartMessage.style.display = 'none';
    
    // Добавить каждый товар в корзину
    cart.forEach((item, index) => {
        console.log('Adding item to cart:', item);
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Обновить итоговую сумму
    updateCartSummary();
}

// Создать элемент товара в корзине
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;
    
    // Найти полные данные о продукте
    const productData = productsData.find(p => p.id === item.id) || item;
    
    // Определить цвет фона
    let bgColor;
    switch(productData.color) {
        case 'black': bgColor = '#000000'; break;
        case 'white': bgColor = '#ffffff'; break;
        case 'darkgray': bgColor = '#36454F'; break;
        case 'navy': bgColor = '#1a1a2e'; break;
        case 'lightblue': bgColor = '#add8e6'; break;
        default: bgColor = '#f8f8f8';
    }
    
    // Определить цвет текста для контраста
    const textColor = (productData.color === 'black' || productData.color === 'navy' || productData.color === 'darkgray') ? '#ffffff' : '#000000';
    
    cartItem.innerHTML = `
        <div class="cart-item-image" style="background-color: ${bgColor}; color: ${textColor};">
            <div style="font-size: 40px;">${productData.emoji || '👕'}</div>
        </div>
        <div class="cart-item-info">
            <h4>${productData.name}</h4>
            <p>${productData.description || 'Историческая футболка премиум-качества'}</p>
            <div class="cart-item-price">${productData.price.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div class="cart-item-controls">
            <div class="quantity-controls">
                <button class="quantity-btn minus-btn" data-index="${index}">-</button>
                <input type="text" class="quantity-input" value="${item.quantity}" data-index="${index}" readonly>
                <button class="quantity-btn plus-btn" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}" title="Удалить">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return cartItem;
}

// Обновить итоговую сумму
function updateCartSummary() {
    if (isUpdating) return;
    isUpdating = true;
    
    console.log('Updating cart summary...');
    
    // Рассчитать сумму товаров
    const subtotal = cart.reduce((total, item) => {
        const productData = productsData.find(p => p.id === item.id) || item;
        return total + (productData.price * item.quantity);
    }, 0);
    
    console.log('Subtotal:', subtotal);
    
    // Получить стоимость доставки
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    let shippingCost = 500; // По умолчанию
    
    for (const radio of deliveryRadios) {
        if (radio.checked) {
            if (radio.id === 'delivery2') shippingCost = 300; // Почта России
            if (radio.id === 'delivery3') shippingCost = 0; // Самовывоз
            break;
        }
    }
    
    // Рассчитать скидку по промокоду
    let discount = 0;
    if (appliedPromo) {
        const promoValue = promoCodes[appliedPromo];
        if (promoValue <= 100) {
            // Процентная скидка
            discount = subtotal * (promoValue / 100);
        } else {
            // Фиксированная скидка
            discount = promoValue;
        }
    }
    
    // Общая сумма
    const total = subtotal + shippingCost - discount;
    
    // Обновить элементы на странице
    const totalItemsElement = document.getElementById('totalItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalAmountElement = document.getElementById('totalAmount');
    
    if (totalItemsElement) {
        totalItemsElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
    }
    
    if (shippingElement) {
        shippingElement.textContent = shippingCost === 0 ? 'Бесплатно' : shippingCost.toLocaleString('ru-RU') + ' ₽';
    }
    
    if (discountElement) {
        discountElement.textContent = discount === 0 ? '-0 ₽' : `-${discount.toLocaleString('ru-RU')} ₽`;
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }
    
    // Обновить кнопку оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.innerHTML = cart.length === 0 
            ? '<i class="fas fa-shopping-cart"></i> Корзина пуста'
            : `<i class="fas fa-lock"></i> Оформить заказ (${total.toLocaleString('ru-RU')} ₽)`;
    }
    
    isUpdating = false;
}

// Настроить обработчики событий
function setupEventListeners() {
    // Увеличение/уменьшение количества товара (делегирование событий)
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            
            // Увеличение количества
            if (target.classList.contains('plus-btn')) {
                const index = parseInt(target.dataset.index);
                changeQuantity(index, 1);
            }
            
            // Уменьшение количества
            if (target.classList.contains('minus-btn')) {
                const index = parseInt(target.dataset.index);
                changeQuantity(index, -1);
            }
            
            // Удаление товара
            if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
                const removeBtn = target.classList.contains('remove-item') ? target : target.closest('.remove-item');
                const index = parseInt(removeBtn.dataset.index);
                removeFromCart(index);
            }
        });
        
        // Изменение количества через поле ввода
        cartItemsContainer.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity > 0 && newQuantity <= 99) {
                    cart[index].quantity = newQuantity;
                    saveCart();
                    updateCartSummary();
                } else {
                    // Вернуть предыдущее значение
                    e.target.value = cart[index].quantity;
                }
            }
        });
    }
    
    // Изменение способа доставки
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateCartSummary();
        });
    });
    
    // Применение промокода
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
    
    // Оформление заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

// Изменить количество товара
function changeQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    
    if (newQuantity < 1) {
        // Если количество становится 0, удалить товар
        removeFromCart(index);
    } else if (newQuantity > 99) {
        // Максимальное количество - 99
        showNotification('Максимальное количество одного товара - 99 шт.', 'error');
    } else {
        // Обновить количество
        cart[index].quantity = newQuantity;
        saveCart();
        
        // Обновить отображение
        const quantityInput = document.querySelector(`.quantity-input[data-index="${index}"]`);
        if (quantityInput) {
            quantityInput.value = newQuantity;
        }
        
        updateCartSummary();
    }
}

// Удалить товар из корзины
function removeFromCart(index) {
    if (confirm('Удалить товар из корзины?')) {
        // Удалить товар из массива
        cart.splice(index, 1);
        
        // Сохранить обновленную корзину
        saveCart();
        
        // Перезагрузить товары в корзине
        loadCartItems();
        
        // Обновить счетчик в шапке
        updateCartCount();
        
        // Показать уведомление
        showNotification('Товар удален из корзины', 'info');
    }
}

// Применить промокод
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    if (!promoInput) return;
    
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        showNotification('Введите промокод', 'error');
        return;
    }
    
    if (appliedPromo === promoCode) {
        showNotification('Этот промокод уже применен', 'info');
        return;
    }
    
    if (promoCodes[promoCode]) {
        appliedPromo = promoCode;
        showNotification(`Промокод применен! Скидка ${promoCodes[promoCode]}${promoCodes[promoCode] <= 100 ? '%' : ' ₽'}`, 'success');
        updateCartSummary();
        promoInput.value = '';
    } else {
        showNotification('Неверный промокод', 'error');
        promoInput.value = '';
    }
}

// Оформить заказ
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    // В реальном приложении здесь был бы переход на страницу оформления заказа
    // или открытие модального окна
    
    // Создать модальное окно оформления заказа
    createCheckoutModal();
}

// Создать модальное окно оформления заказа
function createCheckoutModal() {
    // Рассчитать итоговую сумму
    const subtotal = cart.reduce((total, item) => {
        const productData = productsData.find(p => p.id === item.id) || item;
        return total + (productData.price * item.quantity);
    }, 0);
    
    const shippingElement = document.getElementById('shipping');
    const shippingCost = shippingElement && shippingElement.textContent.includes('Бесплатно') ? 0 : 
                         shippingElement ? parseInt(shippingElement.textContent.replace(/\D/g, '')) || 0 : 0;
    
    const discount = appliedPromo ? (() => {
        const promoValue = promoCodes[appliedPromo];
        return promoValue <= 100 ? subtotal * (promoValue / 100) : promoValue;
    })() : 0;
    
    const total = subtotal + shippingCost - discount;
    
    // Создать модальное окно
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-crown"></i> Оформление заказа</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-summary">
                    <h4>Ваш заказ</h4>
                    <div class="order-items">
                        ${cart.map(item => {
                            const productData = productsData.find(p => p.id === item.id) || item;
                            return `
                                <div class="order-item">
                                    <span>${productData.name} × ${item.quantity}</span>
                                    <span>${(productData.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="order-total">
                        <div class="total-row">
                            <span>Итого:</span>
                            <span><strong>${total.toLocaleString('ru-RU')} ₽</strong></span>
                        </div>
                    </div>
                </div>
                
                <form id="checkoutForm">
                    <div class="form-group">
                        <label for="customerName"><i class="fas fa-user"></i> ФИО *</label>
                        <input type="text" id="customerName" required placeholder="Иванов Иван Иванович">
                    </div>
                    
                    <div class="form-group">
                        <label for="customerPhone"><i class="fas fa-phone"></i> Телефон *</label>
                        <input type="tel" id="customerPhone" required placeholder="+7 (999) 123-45-67">
                    </div>
                    
                    <div class="form-group">
                        <label for="customerEmail"><i class="fas fa-envelope"></i> Email *</label>
                        <input type="email" id="customerEmail" required placeholder="ivanov@historystyle.ru">
                    </div>
                    
                    <div class="form-group">
                        <label for="deliveryAddress"><i class="fas fa-map-marker-alt"></i> Адрес доставки</label>
                        <textarea id="deliveryAddress" rows="3" placeholder="Город, улица, дом, квартира"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-credit-card"></i> Способ оплаты</label>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="card" checked>
                                <span>Банковская карта</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="cash">
                                <span>Наличными при получении</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="orderComment"><i class="fas fa-comment"></i> Комментарий к заказу</label>
                        <textarea id="orderComment" rows="2" placeholder="Дополнительные пожелания..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-submit-order">
                            <i class="fas fa-check-circle"></i> Подтвердить заказ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Добавить стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s;
        }
        
        .modal-content {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: #1a1a2e;
            color: white;
            border-radius: 10px 10px 0 0;
        }
        
        .modal-header h3 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            line-height: 1;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .order-summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .order-items {
            margin: 15px 0;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #ddd;
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #1a1a2e;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        
        .payment-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .payment-option {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .payment-option:hover {
            border-color: #d4af37;
        }
        
        .form-actions {
            text-align: center;
            margin-top: 30px;
        }
        
        .btn-submit-order {
            background: #27ae60;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
        }
        
        .btn-submit-order:hover {
            background: #219653;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Обработчики событий для модального окна
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    // Закрытие при клике вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
    
    // Обработка формы заказа
    modal.querySelector('#checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // В реальном приложении здесь была бы отправка данных на сервер
        
        // Показать сообщение об успехе
        showNotification('Заказ успешно оформлен! С вами свяжутся для подтверждения.', 'success');
        
        // Очистить корзину
        cart = [];
        saveCart();
        updateCartCount();
        
        // Закрыть модальное окно
        document.body.removeChild(modal);
        document.head.removeChild(style);
        
        // Обновить страницу корзины
        setTimeout(() => {
            loadCartItems();
        }, 500);
    });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создать элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Добавить на страницу
    document.body.appendChild(notification);
    
    // Удалить через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Добавить анимации, если их еще нет
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Сохранить корзину в localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// Обновить счетчик корзины в шапке
function updateCartCount() {
    try {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = totalItems;
            }
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Удалить вызов updateCartCount() из DOMContentLoaded
// Он уже вызывается в loadCartItems() через updateCartSummary()
