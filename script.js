document.addEventListener('DOMContentLoaded', () => {
  const menuElement = document.querySelector('.menu');
  const linksMenu = document.querySelector('.links-menu');
  const hamburger = document.querySelector('.hamburger');
  const carrinho = document.querySelector('.carrinho');
  const cartPanel = document.querySelector('.cart-panel');
  const cartOverlay = document.querySelector('.cart-overlay');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartContent = document.querySelector('.cart-content');
  const cartTotalEl = document.querySelector('.cart-total');

  const checkoutBtn = document.querySelector('.checkout');
  const checkoutModal = document.querySelector('.checkout-modal');
  const checkoutOverlay = document.querySelector('.checkout-overlay');
  const confirmCheckout = document.querySelector('.confirm-checkout');
  const checkoutTotal = document.querySelector('.checkout-total');
  const cancelCheckoutBtn = document.querySelector('.cancel-checkout');

  let cart = [];

  // FUNÇÕES CARRINHO
  const openCart = () => {
    cartPanel?.classList.add('active');
    cartOverlay?.classList.add('active');
  };

  const closeCart = () => {
    cartPanel?.classList.remove('active');
    cartOverlay?.classList.remove('active');
  };

  const updateCart = () => {
    if (!cartContent) return;
    cartContent.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartContent.innerHTML = '<p style="color:#fff">Seu carrinho está vazio 😿</p>';
      if (cartTotalEl) cartTotalEl.textContent = 'Total: R$ 0,00';
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <span>${item.name}</span>
        <span class="cart-qty">x${item.qty}</span>
        <span>R$ ${(item.price * item.qty).toFixed(2)}</span>
        <button class="remove-item" data-index="${index}">🗑️</button>
      `;
      cartContent.appendChild(div);
    });

    if (cartTotalEl) cartTotalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    if (checkoutTotal && cartTotalEl) checkoutTotal.textContent = cartTotalEl.textContent;
    closeCart();
    checkoutModal?.classList.add('active');
    checkoutOverlay?.classList.add('active');
  };

  const closeCheckout = () => {
    checkoutModal?.classList.remove('active');
    checkoutOverlay?.classList.remove('active');
  };

  // --- EVENTOS MENU ---
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    linksMenu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Fechar menu ao clicar em link hamburguer
  document.querySelectorAll('.links-menu a').forEach(link => {
    link.addEventListener('click', () => {
      linksMenu?.classList.remove('active');
      hamburger?.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // CARRINHO 
  carrinho?.addEventListener('click', (e) => {
    e.stopPropagation();
    cartPanel?.classList.contains('active') ? closeCart() : openCart();
  });

  closeCartBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  cartPanel?.addEventListener('click', e => e.stopPropagation());

  // Fechar carrinho ao clicar fora
  document.addEventListener('click', (e) => {
    if (cartPanel?.classList.contains('active') &&
        !cartPanel.contains(e.target) &&
        !carrinho.contains(e.target)) {
      closeCart();
    }
  });

  // ADICIONAR PRODUTO
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-cart') || e.target.closest('.add-cart')) {
      const button = e.target.classList.contains('add-cart') ? e.target : e.target.closest('.add-cart');
      const product = button.closest('[data-name]');
      if (product) {
        const name = product.dataset.name;
        const price = parseFloat(product.dataset.price);
        const existingItem = cart.find(item => item.name === name);
        existingItem ? existingItem.qty++ : cart.push({ name, price, qty: 1 });
        updateCart();
        openCart();
      }
    }
  });

  // remover item
  cartContent?.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      updateCart();
    }
  });

  // Finalizar
  const checkoutPage = document.querySelector('.checkout-page');
const checkoutForm = document.querySelector('.checkout-form-fields');
const cancelCheckoutPage = document.querySelector('.cancel-checkout-page');

checkoutBtn?.addEventListener('click', () => {
  if (cart.length === 0) return;
  updateCheckoutPage();
  checkoutPage?.classList.add('active');
  closeCartPanel();
});

cancelCheckoutPage?.addEventListener('click', () => {
  checkoutPage?.classList.remove('active');
});

checkoutForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const payment = formData.get('payment');
  const name = formData.get('name');
  const email = formData.get('email');
  const address = formData.get('address');


  const order = { items: cart, total: cartTotalEl.textContent, payment, name, email, address, date: new Date().toLocaleString() };
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Reset
  cart = [];
  updateCart();
  checkoutPage?.classList.remove('active');
  alert('Pedido confirmado! ☕🐾');
});

function updateCheckoutPage() {
  const checkoutItems = document.querySelector('.checkout-items');
  const checkoutSubtotal = document.querySelector('.checkout-subtotal');
  const checkoutTotal = document.querySelector('.checkout-total');

  checkoutItems.innerHTML = '';
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const div = document.createElement('div');
    div.textContent = `${item.name} x${item.qty} - R$ ${(item.price*item.qty).toFixed(2)}`;
    checkoutItems.appendChild(div);
  });

  checkoutSubtotal.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
  checkoutTotal.textContent = `Total: R$ ${subtotal.toFixed(2)}`; 
}


  // MENU LATERAL SCROLL
  window.addEventListener('scroll', () => {
    const isDesktop = window.innerWidth >= 1400;
    const scrollAtivo = window.scrollY > 300;

    if (isDesktop) {
      if (scrollAtivo) {
        menuElement?.classList.add('lateral');
        setTimeout(() => menuElement?.classList.add('visible'), 10);
        carrinho?.classList.add('floating');
      } else {
        menuElement?.classList.remove('lateral', 'visible');
        carrinho?.classList.remove('floating');
      }
    } else {
      menuElement?.classList.remove('lateral', 'visible');
    }
  });
});


////// ADOÇÃO FORMULARIO ////


 const form = document.querySelector('.adoption-form');

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // previne recarregamento da página

    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if(!name || !message){
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Armazena os dados no localStorage
    const adoptionData = JSON.parse(localStorage.getItem('adoptions') || '[]');
    adoptionData.push({ name, message, date: new Date().toISOString() });
    localStorage.setItem('adoptions', JSON.stringify(adoptionData));

    // Cria o email via mailto para a loja
    const emailLoja = 'kennelyukk@gmail.com';
    const subject = encodeURIComponent(`Pedido de adoção de gatinho: ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nMensagem: ${message}`);
    window.location.href = `mailto:${emailLoja}?subject=${subject}&body=${body}`;


    form.reset();

    alert('Formulário enviado! Seus dados foram salvos localmente.');
  });

