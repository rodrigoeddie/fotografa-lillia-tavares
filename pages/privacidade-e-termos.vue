<script lang="ts" setup>
const title = 'Política de Privacidade e Termos de Uso | Lillia Tavares Fotografia';
const description = 'Conheça nossa Política de Privacidade e Termos de Uso. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.';
const link = 'https://fotografalilliatavares.com.br/privacidade-e-termos';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: link,
});

useHead({
  link: [{ rel: 'canonical', href: link }]
});

definePageMeta({
  layout: 'default'
});
</script>

<template>
  <main class="privacidade container">
      <BlocksBreadcrumb :items="[
        { label: 'Home', to: '/' },
        { label: 'Privacidade e Termos' },
      ]" />
      <h1 class="page-title">Política de Privacidade e Termos de Uso</h1>
      <p class="updated">Última atualização: março de 2026</p>

      <!-- POLÍTICA DE PRIVACIDADE -->
      <section class="section">
        <h2>1. Política de Privacidade</h2>

        <h3>1.1 Quem somos</h3>
        <p>
          Lillia Tavares Fotografia, com contato disponível pelo e-mail
          <a href="mailto:fotografalilliatavares@gmail.com">fotografalilliatavares@gmail.com</a>
          e pelo WhatsApp <a href="https://wa.me/5511911159795" target="_blank" rel="noopener noreferrer">(11) 91115-9795</a>,
          é responsável pelo tratamento dos dados pessoais coletados neste site,
          em conformidade com a Lei Geral de Proteção de Dados - <strong>LGPD (Lei nº 13.709/2018)</strong>.
        </p>

        <h3>1.2 Quais dados coletamos</h3>
        <ul>
          <li><strong>Dados fornecidos voluntariamente:</strong> nome, e-mail, telefone e mensagens enviadas por formulários de contato ou WhatsApp.</li>
          <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e origem do acesso, coletados automaticamente por cookies e ferramentas de análise.</li>
          <li><strong>Dados de redes sociais:</strong> caso você interaja com nossos perfis no Instagram, Facebook ou TikTok, esses dados são regidos pelas políticas de privacidade de cada plataforma.</li>
        </ul>

        <h3>1.3 Para quê usamos seus dados</h3>
        <ul>
          <li>Responder solicitações de orçamento e agendamentos;</li>
          <li>Enviar informações sobre serviços, promoções e novidades (somente com seu consentimento);</li>
          <li>Melhorar a experiência de navegação no site;</li>
          <li>Analisar o desempenho e alcance de campanhas de marketing;</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>

        <h3>1.4 Base legal para o tratamento</h3>
        <p>
          O tratamento dos seus dados é fundamentado nas seguintes bases legais previstas na LGPD:
        </p>
        <ul>
          <li><strong>Consentimento</strong> - para envio de comunicações de marketing e uso de cookies não essenciais;</li>
          <li><strong>Execução de contrato</strong> - para atendimento de orçamentos e agendamentos;</li>
          <li><strong>Legítimo interesse</strong> - para análise de navegação e melhoria do site;</li>
          <li><strong>Cumprimento de obrigação legal</strong> - quando exigido por lei.</li>
        </ul>

        <h3>1.5 Cookies e tecnologias de rastreamento</h3>
        <p>Utilizamos os seguintes tipos de cookies:</p>
        <ul>
          <li><strong>Essenciais:</strong> necessários para o funcionamento básico do site. Não podem ser desativados.</li>
          <li><strong>Analíticos:</strong> Google Analytics (GA4) - para entender o comportamento dos visitantes.</li>
          <li><strong>Marketing:</strong> Meta Pixel (Facebook/Instagram) - para mensurar e otimizar campanhas de anúncios.</li>
          <li><strong>Gravação de sessão:</strong> Smartlook - para identificar problemas de usabilidade.</li>
        </ul>
        <p>Você pode gerenciar suas preferências de cookies a qualquer momento clicando em <strong>"Gerenciar Cookies"</strong> no rodapé do site.</p>

        <h3>1.6 Compartilhamento de dados</h3>
        <p>
          Não vendemos seus dados pessoais. Podemos compartilhá-los com:
        </p>
        <ul>
          <li>Plataformas de análise e marketing (Google, Meta), para fins de análise e publicidade, conforme suas próprias políticas;</li>
          <li>Prestadores de serviço que auxiliam na operação do site, sob obrigação de confidencialidade;</li>
          <li>Autoridades competentes, quando exigido por lei.</li>
        </ul>

        <h3>1.7 Seus direitos como titular</h3>
        <p>Em conformidade com a LGPD, você tem direito a:</p>
        <ul>
          <li>Confirmação da existência de tratamento de seus dados;</li>
          <li>Acesso aos dados que temos sobre você;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
          <li>Eliminação dos dados tratados com base no seu consentimento;</li>
          <li>Revogação do consentimento a qualquer momento;</li>
          <li>Oposição ao tratamento realizado com base em legítimo interesse.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, entre em contato pelo e-mail
          <a href="mailto:fotografalilliatavares@gmail.com">fotografalilliatavares@gmail.com</a>.
          Responderemos em até 15 dias úteis.
        </p>

        <h3>1.8 Retenção e eliminação de dados</h3>
        <p>
          Mantemos seus dados somente pelo tempo necessário para as finalidades descritas ou conforme exigido por lei.
          Dados de clientes são retidos por até 5 anos após o encerramento da relação comercial.
          Dados coletados via cookies são retidos conforme as políticas de cada ferramenta (em geral, até 26 meses).
        </p>

        <h3>1.9 Segurança</h3>
        <p>
          Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado,
          alteração, divulgação ou destruição, incluindo conexão HTTPS e controle de acesso restrito.
        </p>

        <h3>1.10 Alterações nesta política</h3>
        <p>
          Esta política pode ser atualizada periodicamente. Mudanças significativas serão comunicadas por aviso no site.
          A data da última atualização está indicada no topo desta página.
        </p>
      </section>

      <!-- TERMOS DE USO -->
      <section class="section">
        <h2>2. Termos de Uso</h2>

        <h3>2.1 Aceitação</h3>
        <p>
          Ao acessar e utilizar este site, você concorda com os presentes Termos de Uso.
          Caso não concorde, por favor, não utilize o site.
        </p>

        <h3>2.2 Propriedade intelectual</h3>
        <p>
          Todo o conteúdo deste site - incluindo textos, fotografias, logotipos, layout e código-fonte -
          é de propriedade exclusiva de Lillia Tavares Fotografia e está protegido pelas leis de direitos
          autorais (Lei nº 9.610/1998). É expressamente proibido reproduzir, distribuir, modificar ou
          utilizar qualquer conteúdo sem autorização prévia e por escrito.
        </p>

        <h3>2.3 Uso permitido</h3>
        <p>Este site destina-se exclusivamente ao uso pessoal e não comercial para:</p>
        <ul>
          <li>Obter informações sobre os serviços fotográficos oferecidos;</li>
          <li>Entrar em contato para solicitar orçamentos e agendamentos;</li>
          <li>Visualizar o portfólio de trabalhos.</li>
        </ul>

        <h3>2.4 Links externos</h3>
        <p>
          Este site pode conter links para sites de terceiros (Instagram, WhatsApp, Google Maps, etc.).
          Não nos responsabilizamos pelo conteúdo, práticas de privacidade ou disponibilidade desses sites.
        </p>

        <h3>2.5 Limitação de responsabilidade</h3>
        <p>
          O site é fornecido "no estado em que se encontra". Não garantimos que estará sempre disponível,
          livre de erros ou vírus. Não nos responsabilizamos por danos diretos ou indiretos decorrentes
          do uso ou impossibilidade de uso do site.
        </p>

        <h3>2.6 Legislação aplicável</h3>
        <p>
          Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de
          Mogi das Cruzes - SP para dirimir quaisquer controvérsias.
        </p>

        <h3>2.7 Contato</h3>
        <p>
          Para qualquer dúvida sobre esta Política de Privacidade ou Termos de Uso:
        </p>
        <ul>
          <li>E-mail: <a href="mailto:fotografalilliatavares@gmail.com">fotografalilliatavares@gmail.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/5511911159795" target="_blank" rel="noopener noreferrer">(11) 91115-9795</a></li>
        </ul>
      </section>
  </main>
</template>

<style scoped lang="scss">
.privacidade {
    background-color: white;
  padding: 60rem v.$space;
  margin-bottom: 40rem;
  color: v.$green;

  .page-title {
    font-size: 36rem;
    font-weight: 700;
    margin-bottom: 8rem;
  }

  .updated {
    font-size: 14rem;
    color: #888;
    margin-bottom: 48rem;
  }

  .section {
    margin-bottom: 48rem;

    h2 {
      font-size: 26rem;
      font-weight: 700;
      border-bottom: 2px solid v.$green;
      padding-bottom: 8rem;
      margin-bottom: 24rem;
      margin-top: 48rem;
    }

    h3 {
      font-size: 18rem;
      font-weight: 700;
      margin-top: 28rem;
      margin-bottom: 10rem;
    }

    p, li {
      font-size: 16rem;
      line-height: 1.7;
      color: #333;
    }

    ul {
      padding-left: 20rem;
      margin: 8rem 0 16rem;
      list-style: disc;
    }

    a {
      color: v.$green;
      text-decoration: underline;

      &:hover {
        color: v.$dark-green;
      }
    }
  }
}
</style>
