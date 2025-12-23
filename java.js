// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav ul');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCounter = document.querySelector('.cart-counter');
const cartLink = document.querySelector('.cart-link');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// Обновление счетчика корзины
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Показать/скрыть корзину
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderCart();
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Добавление в корзину
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.closest('.add-to-cart').getAttribute('data-id');
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseInt(productCard.querySelector('.product-price').textContent.replace(/,/g, ''));
        const productImage = productCard.querySelector('img').src;
        
        addToCart(productId, productName, productPrice, productImage);
        
        // Анимация кнопки
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        button.style.backgroundColor = '#006400';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 2000);
        
        showNotification(`"${productName}" добавлен в корзину!`);
    });
});

// Функция добавления товара
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartCounter();
}

// Функция отображения корзины
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    
    let cartHTML = '';
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} <i class="fas fa-coins"></i> × ${item.quantity}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Удалить</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalPriceElement.textContent = totalPrice.toLocaleString();
    
    // Добавляем обработчики для кнопок в корзине
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            renderCart();
            updateCartCounter();
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity++;
            renderCart();
            updateCartCounter();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            renderCart();
            updateCartCounter();
            showNotification('Товар удален из корзины');
        });
    });
}

// Оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Корзина пуста!', 'error');
        return;
    }
    
    showNotification('Заказ оформлен! Спасибо за покупку!', 'success');
    cart = [];
    updateCartCounter();
    renderCart();
    cartModal.style.display = 'none';
    
    // В реальном проекте здесь был бы AJAX-запрос на сервер
    console.log('Заказ оформлен:', cart);
});

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Фильтрация товаров
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Удаляем активный класс у всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс нажатой кнопке
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    
    // Закрытие меню при клике на пункт на мобильных
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                nav.classList.remove('active');
            }
        });
    });
});