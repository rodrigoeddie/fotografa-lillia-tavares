<script lang="ts" setup>
const title = 'Protótipo - Homepage Lillia Tavares Fotografia';
const description = 'Protótipo da nova homepage para a fotógrafa Lillia Tavares';

useSeoMeta({
  title: title,
  description: description,
});

// Mock data para o protótipo
const testimonials = [
  {
    id: 1,
    name: 'Vanessa Silva',
    category: 'Ensaio Dia das Mães',
    text: 'Nunca imaginei que um ensaio fotográfico pudesse me fazer sentir tão poderosa. A Lillia tem um dom para nos deixar à vontade e capturar nossa melhor versão. Saí do estúdio com a autoestima renovada!'
  },
  {
    id: 2,
    name: 'Bruna Freire',
    category: 'Ensaio Corporativo',
    text: 'As fotos para meu perfil profissional superaram todas as expectativas. A Lillia entendeu exatamente o que eu precisava e conseguiu transmitir minha personalidade e profissionalismo nas imagens.'
  }
];

const pacotes = [
  {
    id: 1,
    name: 'Pacote Essencial',
    price: 'A partir de R$ 350',
    features: [
      'Sessão de 1 hora',
      '1 cenário',
      '10 fotos digitais',
      'Orientação de poses',
      'Entrega em até 7 dias'
    ]
  },
  {
    id: 2,
    name: 'Pacote Premium',
    price: 'A partir de R$ 650',
    features: [
      'Sessão de 2 horas',
      '2 cenários',
      '20 fotos digitais',
      'Orientação de poses',
      '1 troca de roupa',
      'Entrega em até 5 dias'
    ]
  },
  {
    id: 3,
    name: 'Pacote Realeza',
    price: 'A partir de R$ 950',
    features: [
      'Sessão de 3 horas',
      '3 cenários',
      '30 fotos digitais',
      'Orientação de poses',
      '2 trocas de roupa',
      'Maquiagem profissional',
      'Álbum impresso 20x30cm',
      'Entrega em até 3 dias'
    ]
  }
];

const categories = [
  { id: 1, name: 'Dia das Mães', slug: 'dia-das-maes' },
  { id: 2, name: 'Corporativo', slug: 'corporativo' },
  { id: 3, name: 'Sensual Intimista', slug: 'sensual-intimista' }
];

// Reactive data
const showLeadPopup = ref(true);
const leadForm = reactive({
  name: '',
  email: ''
});

const closePopup = () => {
  showLeadPopup.value = false;
};

const submitLeadForm = () => {
  console.log('Lead form submitted:', leadForm);
  closePopup();
};
</script>

<template>
  <div class="prototype-page">
    <!-- Header -->
    <header class="header">
      <div class="container header-content">
        <div class="logo">Logo Lillia Tavares</div>
        <nav>
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/ensaio-fotografico">Ensaios</NuxtLink></li>
            <li><NuxtLink to="/estudio">Estúdio</NuxtLink></li>
            <li><NuxtLink to="/preco-ensaio-fotografico">Investimento</NuxtLink></li>
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
            <li><NuxtLink to="/sobre">Contato</NuxtLink></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Somos Rainhas</h1>
        <p>Ensaios fotográficos que celebram a beleza e singularidade de cada mulher</p>
        <div class="hero-actions">
          <NuxtLink to="/sobre" class="btn">Agende seu ensaio</NuxtLink>
          <NuxtLink to="/ensaio-fotografico" class="btn btn-secondary">Conheça meu trabalho</NuxtLink>
        </div>
        
        <div class="wireframe-label" style="top: 10px; right: 10px;">
          NOVO: Slogan destacado como proposta de valor única
        </div>
      </div>
    </section>

    <!-- Value Proposition Section -->
    <section class="value-prop">
      <div class="container">
        <div class="value-prop-content">
          <h3>Transforme sua autoestima através da fotografia</h3>
          <p>Mais do que fotos, ofereço uma experiência completa de autoconhecimento e valorização. Com mais de 100 mulheres fotografadas, minha missão é capturar a essência única de cada cliente e transformar a maneira como ela se vê.</p>
          <NuxtLink to="/sobre" class="btn">Descubra como funciona</NuxtLink>
        </div>
        
        <div class="wireframe-label" style="top: 20px; left: 20px;">
          NOVO: Seção de proposta de valor com benefícios emocionais
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <div class="container">
        <div class="section-title">
          <h2>Ensaios Fotográficos</h2>
        </div>
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category.id" 
            class="category-card"
          >
            <div class="category-content">
              <h3>{{ category.name }}</h3>
              <NuxtLink :to="`/ensaio-fotografico/${category.slug}`" class="btn btn-secondary">
                Ver ensaios
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <div class="section-title">
          <h2>Depoimentos</h2>
        </div>
        <div class="testimonial-grid">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id" 
            class="testimonial-card"
          >
            <div class="testimonial-header">
              <div class="testimonial-img"></div>
              <div class="testimonial-author">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.category }}</p>
              </div>
            </div>
            <div class="testimonial-text">
              <p>"{{ testimonial.text }}"</p>
            </div>
          </div>
        </div>
        
        <div class="wireframe-label" style="top: 20px; right: 20px;">
          NOVO: Seção de depoimentos para prova social
        </div>
      </div>
    </section>

    <!-- pacotes Section -->
    <section class="pacotes">
      <div class="container">
        <div class="section-title">
          <h2>Investimento</h2>
        </div>
        <div class="pacote-grid">
          <div 
            v-for="pkg in pacotes" 
            :key="pkg.id" 
            class="pacote-card"
          >
            <div class="pacote-header">
              <h3>{{ pkg.name }}</h3>
            </div>
            <div class="pacote-content">
              <div class="pacote-price">
                <p>{{ pkg.price }}</p>
              </div>
              <ul class="pacote-features">
                <li v-for="feature in pkg.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
              <NuxtLink to="/sobre" class="pacote-btn">Agendar agora</NuxtLink>
            </div>
          </div>
        </div>
        
        <div class="wireframe-label" style="top: 20px; left: 20px;">
          NOVO: Seção de pacotes com preços transparentes
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Pronta para se sentir uma rainha?</h2>
          <p>Agende seu ensaio fotográfico hoje mesmo e descubra como é se ver através das minhas lentes.</p>
          <NuxtLink to="/sobre" class="btn cta-btn">Quero ser fotografada</NuxtLink>
        </div>
        
        <div class="wireframe-label" style="top: 20px; right: 20px;">
          NOVO: CTA com texto persuasivo
        </div>
      </div>
    </section>

    <!-- Instagram Feed -->
    <section class="instagram-feed">
      <div class="container">
        <div class="section-title">
          <h2>Instagram</h2>
        </div>
        <div class="instagram-grid">
          <div v-for="i in 4" :key="i" class="instagram-item"></div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-column">
            <h3>Sobre</h3>
            <p>Fotógrafa especialista em retratos femininos e posicionamento de imagem corporativo, com estúdio localizado em Mogi das Cruzes.</p>
            <div class="social-links">
              <a href="#" class="social-link">FB</a>
              <a href="#" class="social-link">IG</a>
              <a href="#" class="social-link">WA</a>
            </div>
          </div>
          <div class="footer-column">
            <h3>Ensaios</h3>
            <ul>
              <li><NuxtLink to="/ensaio-fotografico/dia-das-maes">Dia das Mães</NuxtLink></li>
              <li><NuxtLink to="/ensaio-fotografico/corporativo">Corporativo</NuxtLink></li>
              <li><NuxtLink to="/ensaio-fotografico/sensual-intimista">Sensual Intimista</NuxtLink></li>
              <li><NuxtLink to="/ensaio-fotografico">Outros ensaios</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Links Úteis</h3>
            <ul>
              <li><NuxtLink to="/blog">Blog</NuxtLink></li>
              <li><a href="#">Perguntas Frequentes</a></li>
              <li><a href="#">Como se Preparar</a></li>
              <li><a href="#">Política de Privacidade</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Contato</h3>
            <ul>
              <li>Estúdio em Mogi das Cruzes, SP</li>
              <li>fotografalilliatavares@gmail.com</li>
              <li>(11) 91115-9795</li>
            </ul>
          </div>
        </div>
        <div class="copyright">
          <p>&copy; 2025 Fotógrafa Lillia Tavares. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- Lead Capture Popup -->
    <div v-if="showLeadPopup" class="popup-container">
      <div class="popup-header">
        <h3>Guia Gratuito</h3>
        <button @click="closePopup" class="popup-close">&times;</button>
      </div>
      <div class="popup-content">
        <p>Receba nosso guia exclusivo "5 dicas para se preparar para seu ensaio fotográfico" e garanta fotos incríveis!</p>
        <form @submit.prevent="submitLeadForm" class="popup-form">
          <input 
            v-model="leadForm.name" 
            type="text" 
            placeholder="Seu nome"
            required
          >
          <input 
            v-model="leadForm.email" 
            type="email" 
            placeholder="Seu e-mail"
            required
          >
          <button type="submit" class="popup-btn">Quero receber o guia</button>
        </form>
      </div>
      
      <div class="wireframe-label" style="top: -30px; left: 0;">
        NOVO: Pop-up de captura de leads
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.prototype-page {
  font-family: 'Arial', sans-serif;
  background-color: #f5f2ed;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// Header
.header {
  background-color: #f5f2ed;
  padding: 20px 0;
  border-bottom: 1px solid #e0d9d0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  width: 200px;
  height: 80px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  li {
    margin-left: 30px;
    
    a {
      text-decoration: none;
      color: #333;
      font-weight: 600;
      transition: color 0.3s;
      
      &:hover {
        color: #a67c52;
      }
    }
  }
}

// Hero Section
.hero {
  height: 600px;
  background-color: #ddd;
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
}

.hero-content {
  position: relative;
  text-align: center;
  width: 80%;
  color: #fff;
  z-index: 2;
  
  h1 {
    font-size: 23px;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: 16px;
    margin-bottom: 30px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

// Buttons
.btn {
  display: inline-block;
  padding: 15px 30px;
  background-color: #a67c52;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #8a6642;
  }
  
  &.btn-secondary {
    background-color: transparent;
    border: 2px solid #fff;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

// Section Titles
.section-title {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  
  h2 {
    font-size: 20px;
    display: inline-block;
    padding-bottom: 10px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 3px;
      background-color: #a67c52;
    }
  }
}

// Value Proposition
.value-prop {
  padding: 80px 0;
  text-align: center;
}

.value-prop-content {
  max-width: 800px;
  margin: 0 auto;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #a67c52;
  }
  
  p {
    font-size: 14px;
    margin-bottom: 30px;
  }
}

// Categories
.categories {
  padding: 60px 0;
  background-color: #fff;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.category-card {
  position: relative;
  height: 400px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s;
  display: flex;
  align-items: flex-end;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  }
}

.category-content {
  position: relative;
  padding: 30px;
  color: #fff;
  z-index: 2;
  
  h3 {
    font-size: 15px;
    margin-bottom: 10px;
  }
}

// Testimonials
.testimonials {
  padding: 80px 0;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.testimonial-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.testimonial-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 20px;
  flex-shrink: 0;
}

.testimonial-author {
  h4 {
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  p {
    color: #777;
    margin: 0;
  }
}

.testimonial-text {
  font-style: italic;
  color: #555;
  
  p {
    margin: 0;
  }
}

// pacotes
.pacotes {
  padding: 80px 0;
  background-color: #f9f7f4;
}

.pacote-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.pacote-card {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-10px);
  }
}

.pacote-header {
  padding: 20px;
  background-color: #a67c52;
  color: #fff;
  text-align: center;
  
  h3 {
    font-size: 16px;
    margin: 0;
  }
}

.pacote-content {
  padding: 30px;
}

.pacote-price {
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: #a67c52;
  
  p {
    margin: 0;
  }
}

.pacote-features {
  margin-bottom: 30px;
  list-style: none;
  padding: 0;
  
  li {
    margin-bottom: 10px;
    padding-left: 25px;
    position: relative;
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #a67c52;
    }
  }
}

.pacote-btn {
  display: block;
  text-align: center;
  background-color: #a67c52;
  color: #fff;
  padding: 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #8a6642;
  }
}

// CTA Section
.cta-section {
  padding: 80px 0;
  background-color: #a67c52;
  color: #fff;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
  
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 30px;
  }
}

.cta-btn {
  background-color: #fff;
  color: #a67c52;
  font-size: 14px;
  padding: 15px 40px;
  
  &:hover {
    background-color: #f5f5f5;
  }
}

// Instagram Feed
.instagram-feed {
  padding: 80px 0;
}

.instagram-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.instagram-item {
  height: 300px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(166, 124, 82, 0);
    transition: background-color 0.3s;
  }
  
  &:hover::after {
    background-color: rgba(166, 124, 82, 0.3);
  }
}

// Footer
.footer {
  background-color: #333;
  color: #fff;
  padding: 60px 0 30px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column {
  h3 {
    font-size: 14px;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: #a67c52;
    }
  }
  
  p, li {
    margin-bottom: 10px;
    color: #aaa;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  a {
    color: #aaa;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #fff;
    }
  }
}

.social-links {
  display: flex;
  margin-top: 20px;
}

.social-link {
  width: 40px;
  height: 40px;
  background-color: #444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #a67c52;
  }
}

.copyright {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #444;
  color: #aaa;
  
  p {
    margin: 0;
  }
}

// Popup
.popup-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    font-size: 16px;
    color: #a67c52;
    margin: 0;
  }
}

.popup-close {
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #333;
  }
}

.popup-content {
  p {
    margin-bottom: 15px;
    font-size: 12px;
  }
}

.popup-form {
  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
  }
}

.popup-btn {
  width: 100%;
  padding: 10px;
  background-color: #a67c52;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #8a6642;
  }
}

// Wireframe labels
.wireframe-label {
  position: absolute;
  background-color: rgba(255, 0, 0, 0.1);
  border: 2px dashed red;
  padding: 5px;
  font-size: 12px;
  color: red;
  z-index: 100;
}

// Responsive Design
@media (max-width: 992px) {
  .category-grid, .testimonial-grid, .pacote-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .instagram-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }
  
  nav ul {
    margin-top: 20px;
    
    li {
      margin: 0 10px;
    }
  }
  
  .hero {
    h1 {
      font-size: 20px;
    }
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .category-grid, .testimonial-grid, .pacote-grid, .instagram-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .popup-container {
    right: 10px;
    left: 10px;
    width: auto;
  }
}
</style>
