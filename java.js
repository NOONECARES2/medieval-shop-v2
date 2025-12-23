// java.js - Главный JavaScript файл для index.html

// Данные продуктов

const products = [
    {
        id: 1,
        name: "«Лев Англии»",
        description: "Черная футболка с золотым львом — символом отваги и королевской власти.",
        price: 2499,
        category: "coats",
        categoryName: "С гербами",
        badge: "Хит продаж",
        color: "black",
        emoji: "🦁"
    },
    {
        id: 2,
        name: "«Бог и моё право»",
        description: "Классическая белая футболка с латинским девизом и стилизованным шрифтом.",
        price: 2299,
        category: "mottos",
        categoryName: "С девизами",
        badge: "",
        color: "white",
        emoji: "⚜️"
    },
    {
        id: 3,
        name: "«Дракон Уэльса»",
        description: "Красный дракон на угольно-сером фоне. Хлопок премиум-качества.",
        price: 2599,
        category: "dragons",
        categoryName: "Драконы",
        badge: "Новинка",
        color: "darkgray",
        emoji: "🐉"
    },
    {
        id: 4,
        name: "«Стражи Замка»",
        description: "Темно-синяя футболка с изображением величественного средневекового замка.",
        price: 2399,
        category: "castles",
        categoryName: "Замки",
        badge: "",
        color: "navy",
        emoji: "🏰"
    },
    {
        id: 5,
        name: "«Герб Франции»",
        description: "Королевские лилии на светло-голубом фоне. Символ французской монархии.",
        price: 2499,
        category: "coats",
        categoryName: "С гербами",
        badge: "Хит продаж",
        color: "lightblue",
        emoji: "⚜️"
    },
    {
        id: 6,
        name: "«Рыцарский девиз»",
        description: "Черная футболка с девизом «За веру и честь!» на старинном щите.",
        price: 2199,
        category: "mottos",
        categoryName: "С девизами",
        badge: "",
        color: "black",
        emoji: "🛡️"
    },
    {
        id: 7,
        name: "«Дракон гор»",
        description: "Зеленый дракон на черном фоне. Мифический страж горных вершин.",
        price: 2699,
        category: "dragons",
        categoryName: "Драконы",
        badge: "Новинка",
        color: "black",
        emoji: "🐲"
    },
    {
        id: 8,
        name: "«Башня Лондона»",
        description: "Легендарная крепость на темно-сером фоне. История в каждом камне.",
        price: 2499,
        category: "castles",
        categoryName: "Замки",
        badge: "",
        color: "darkgray",
        emoji: "🏯"
    }
];

// Корзина в localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
   // Обновить счетчик корзины только если мы на главной странице
if (document.querySelector('.products-grid')) {
    updateCartCount();
}
    // Загрузить таблицу продуктов
    loadProductsTable();
    
    // Загрузить продукты в сетку
    loadProducts();
    
    // Настроить фильтры категорий
    setupCategoryFilters();
    
    // Настроить форму подписки
    setupNewsletterForm();
    
    // Настроить год в футере
    setupCurrentYear();
    
    // Настроить навигацию по категориям в футере
    setupFooterCategoryLinks();
});

// Загрузить таблицу продуктов
function loadProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    // Очистить таблицу
    tableBody.innerHTML = '';
    
    // Добавить первые 4 продукта в таблицу (хиты продаж)
    const featuredProducts = products.slice(0, 4);
    
    featuredProducts.forEach(product => {
        const row = createTableRow(product);
        tableBody.appendChild(row);
    });
}

// Создать строку таблицы
function createTableRow(product) {
    const row = document.createElement('tr');
    
    // Определить цвет фона для эмодзи
    let bgColor;
    switch(product.color) {
        case 'black': bgColor = '#000000'; break;
        case 'white': bgColor = '#ffffff'; break;
        case 'darkgray': bgColor = '#36454F'; break;
        case 'navy': bgColor = '#1a1a2e'; break;
        case 'lightblue': bgColor = '#add8e6'; break;
        default: bgColor = '#f8f8f8';
    }
    
    // Определить цвет текста для контраста
    const textColor = (product.color === 'black' || product.color === 'navy' || product.color === 'darkgray') ? '#ffffff' : '#000000';
    
    // Класс категории для стилизации
    const categoryClass = `category-${product.category}`;
    
    row.innerHTML = `
        <td>
            <div class="product-cell">
                <div class="product-emoji" style="background-color: ${bgColor}; color: ${textColor}">
                    ${product.emoji}
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
            </div>
        </td>
        <td>${product.description}</td>
        <td><span class="category-cell ${categoryClass}">${product.categoryName}</span></td>
        <td class="price-cell">${product.price.toLocaleString('ru-RU')} ₽</td>
        <td class="action-cell">
            <button class="btn-table" data-id="${product.id}">В корзину</button>
        </td>
    `;
    
    // Добавить обработчик события для кнопки добавления в корзину
    const addToCartBtn = row.querySelector('.btn-table');
    addToCartBtn.addEventListener('click', function() {
        addToCart(product);
    });
    
    return row;
}

// Загрузить продукты в сетку
function loadProducts(filterCategory = 'all') {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Очистить сетку
    productsGrid.innerHTML = '';
    
    // Отфильтровать продукты
    let filteredProducts = products;
    if (filterCategory !== 'all') {
        filteredProducts = products.filter(product => product.category === filterCategory);
    }
    
    // Добавить продукты в сетку
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Создать карточку продукта
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    // Определить цвет фона
    let bgColor;
    switch(product.color) {
        case 'black': bgColor = '#000000'; break;
        case 'white': bgColor = '#ffffff'; break;
        case 'darkgray': bgColor = '#36454F'; break;
        case 'navy': bgColor = '#1a1a2e'; break;
        case 'lightblue': bgColor = '#add8e6'; break;
        default: bgColor = '#f8f8f8';
    }
    
    // Определить цвет текста для контраста
    const textColor = (product.color === 'black' || product.color === 'navy' || product.color === 'darkgray') ? '#ffffff' : '#000000';
    
    card.innerHTML = `
        <div class="product-image" style="background-color: ${bgColor}">
            <div style="font-size: 80px; color: ${textColor}">${product.emoji}</div>
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
            <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
        </div>
    `;
    
    // Добавить обработчик события для кнопки добавления в корзину
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCart(product);
    });
    
    return card;
}

// Настроить фильтры категорий
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const footerCategoryLinks = document.querySelectorAll('.footer-column a[data-category]');
    
    // Обработчики для кнопок фильтров
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Удалить активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Добавить активный класс к нажатой кнопке
            this.classList.add('active');
            
            // Загрузить отфильтрованные продукты
            const category = this.dataset.category;
            loadProducts(category);
            
            // Прокрутить к каталогу
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Обработчики для ссылок в футере
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Обновить активную кнопку фильтра
            categoryBtns.forEach(b => b.classList.remove('active'));
            const correspondingBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (correspondingBtn) {
                correspondingBtn.classList.add('active');
            } else {
                document.querySelector('.category-btn[data-category="all"]').classList.add('active');
            }
            
            // Загрузить отфильтрованные продукты
            loadProducts(category);
            
            // Прокрутить к каталогу
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Настроить форму подписки
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // В реальном приложении здесь был бы AJAX запрос к серверу
        alert(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
        this.reset();
        
        // Анимация успеха
        const submitBtn = this.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Успешно!';
        submitBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
        }, 2000);
    });
}

// Настроить год в футере
function setupCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Настроить навигацию по категориям в футере
function setupFooterCategoryLinks() {
    const footerCategoryLinks = document.querySelectorAll('.footer-column a[data-category]');
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            const categoryBtns = document.querySelectorAll('.category-btn');
            
            // Обновить активную кнопку
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            const targetBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
                loadProducts(category);
            }
            
            // Прокрутить к каталогу
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'index.html#catalog';
            }
        });
    });
}

// Добавить товар в корзину
function addToCart(product) {
    // Проверить, есть ли товар уже в корзине
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Увеличить количество
        existingItem.quantity += 1;
    } else {
        // Добавить новый товар
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            emoji: product.emoji,
            color: product.color
        });
    }
    
    // Сохранить корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновить счетчик корзины
    updateCartCount();
    
    // Показать уведомление
    showAddToCartNotification(product.name);
    
    // Обновить кнопку (визуальная обратная связь)
    const addBtn = event.target;
    const originalText = addBtn.textContent;
    addBtn.textContent = 'Добавлено!';
    addBtn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.backgroundColor = '';
    }, 1500);
}

// Показать уведомление о добавлении в корзину
function showAddToCartNotification(productName) {
    // Создать уведомление
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 30px;">✅</div>
            <div>
                <strong>Товар добавлен!</strong>
                <p>${productName} добавлен в корзину</p>
            </div>
        </div>
        <a href="cart.html" style="background: #d4af37; color: #1a1a2e; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Перейти в корзину
        </a>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        border-left: 5px solid #27ae60;
    `;
    
    // Добавить уведомление на страницу
    document.body.appendChild(notification);
    
    // Удалить уведомление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Добавить анимации в CSS, если их еще нет
    if (!document.querySelector('#cart-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Обновить счетчик корзины
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Глобально доступные функции
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
