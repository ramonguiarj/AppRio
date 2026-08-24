import React, { useState, useMemo } from "react";
import { MapPin, Navigation, Star, ShieldCheck, Compass, Loader2, X, Sunrise, Sunset, Info, Map as MapIcon, List, Ticket } from "lucide-react";
// ADICIONADO: Ticket agora está importado do lucide-react

const LOGO_WORDMARK = "data:image/jpeg;base64,PLACEHOLDER_MANTENHA_O_SEU_BASE64_AQUI";
const LOGO_STAMP = "data:image/jpeg;base64,PLACEHOLDER_MANTENHA_O_SEU_BASE64_AQUI";
const LOGO_MONOGRAM = "data:image/jpeg;base64,PLACEHOLDER_MANTENHA_O_SEU_BASE64_AQUI";

const TOPICS = [
  { id: "hospedagem", label: "Hospedagem", icon: "\u{1F3E8}", blurb: "Onde ficar com conforto e segurança, no Centro histórico ou perto da praia na Zona Sul." },
  { id: "alimentacao", label: "Alimentação", icon: "\u{1F37D}\uFE0F", blurb: "Do café da manhã ao jantar — os melhores endereços pra comer bem em cada horário." },
  { id: "diversao", label: "Diversão", icon: "\u{1F3B6}", blurb: "Pagode, samba e shows ao vivo pra sentir a energia carioca à noite." },
  { id: "turismo", label: "Pontos Turísticos", icon: "\u26F0\uFE0F", blurb: "Os clássicos do Rio — e os melhores horários pra ver a cidade brilhar." },
  { id: "praias", label: "Praias", icon: "\u{1F3D6}\uFE0F", blurb: "As praias mais bonitas e movimentadas da Zona Sul e da Barra." },
  { id: "servicos", label: "Serviços", icon: "\u{1F3E5}", blurb: "Aeroportos, rodoviária e hospitais — informação essencial pra quem está de passagem." },
  { id: "sobre", label: "Sobre / Serviços", icon: "\u{1F310}", blurb: "Conheça o trabalho do Ramon como guia e fotógrafo, e feche seu passeio direto pelo site." },
];

const SUBTABS = {
  alimentacao: [
    { id: "todos", label: "Todos" },
    { id: "cafe", label: "Café da manhã" },
    { id: "almoco", label: "Almoço" },
    { id: "jantar", label: "Jantar" },
  ],
  turismo: [
    { id: "todos", label: "Todos" },
    { id: "nascer", label: "Nascer do sol" },
    { id: "por-do-sol", label: "Pôr do sol" },
    { id: "cultura", label: "Cultura e história" },
  ],
  servicos: [
    { id: "todos", label: "Todos" },
    { id: "aeroportos", label: "Aeroportos" },
    { id: "rodoviarias", label: "Rodoviária" },
    { id: "hospitais", label: "Hospitais" },
  ],
};

const PLACES = [
  // ---------- HOSPEDAGEM ----------
  { id: 1, name: "Windsor Guanabara Hotel", cat: "hospedagem", bairro: "Centro", lat: -22.9010092, lng: -43.1794854, rating: 4.5, tip: "Perto do Sambódromo, fácil de explorar a pé" },
  { id: 2, name: "Hotel Vila Galé Rio de Janeiro", cat: "hospedagem", bairro: "Centro", lat: -22.9144444, lng: -43.1847222, rating: 4.6, tip: "Piscina, academia e bom café da manhã" },
  { id: 3, name: "Prodigy Hotel Santos Dumont", cat: "hospedagem", bairro: "Centro", lat: -22.9146766, lng: -43.16631, rating: 4.6, tip: "Vista para Pão de Açúcar e Cristo, perto do aeroporto Santos Dumont" },
  { id: 4, name: "Miramar Hotel by Windsor", cat: "hospedagem", bairro: "Copacabana", lat: -22.9809171, lng: -43.1903045, rating: 4.6, tip: "Em cima da praia de Copacabana" },
  { id: 5, name: "Hilton Rio de Janeiro Copacabana", cat: "hospedagem", bairro: "Copacabana", lat: -22.9644008, lng: -43.1732645, rating: 4.6, tip: "Rooftop com piscina e vista panorâmica" },
  { id: 6, name: "Fairmont Rio de Janeiro Copacabana", cat: "hospedagem", bairro: "Copacabana", lat: -22.9860445, lng: -43.1895056, rating: 4.7, tip: "Praia privativa e piscina de borda infinita" },
  { id: 7, name: "Emiliano Rio", cat: "hospedagem", bairro: "Copacabana", lat: -22.9822203, lng: -43.1903566, rating: 4.7, tip: "No coração de Copacabana, perto de Ipanema" },
  { id: 8, name: "Orla Copacabana Hotel", cat: "hospedagem", bairro: "Copacabana", lat: -22.9850364, lng: -43.1897314, rating: 4.4, tip: "Ótimo custo-benefício, entre Copacabana e Ipanema" },

  // ---------- ALIMENTAÇÃO ----------
  { id: 20, name: "Nusa Café", cat: "alimentacao", meals: ["cafe"], bairro: "Ipanema", lat: -22.983419, lng: -43.2029145, rating: 4.7, tip: "Café da manhã queridinho de Ipanema, com opções fit e açaí bowl" },
  { id: 21, name: "Pendê Café", cat: "alimentacao", meals: ["cafe"], bairro: "Copacabana", lat: -22.9743236, lng: -43.1908833, rating: 4.6, tip: "Sucos frescos e pão de queijo, ótimo pra começar o dia" },
  { id: 22, name: "Florir Café Bistrô", cat: "alimentacao", meals: ["cafe"], bairro: "Copacabana", lat: -22.9682338, lng: -43.1828986, rating: 4.7, tip: "Uma quadra da praia, café bonito e cappuccino impecável" },
  { id: 23, name: "Nooma Copacabana", cat: "alimentacao", meals: ["cafe"], bairro: "Copacabana", lat: -22.9742604, lng: -43.1908571, rating: 4.8, tip: "Pão de queijo é destaque, atendimento atencioso" },
  { id: 24, name: "Orla 21 Rooftop", cat: "alimentacao", meals: ["cafe"], bairro: "Centro", lat: -22.9144427, lng: -43.1667703, rating: 4.0, tip: "Buffet de café da manhã com vista pro Pão de Açúcar" },
  { id: 25, name: "Dainer", cat: "alimentacao", meals: ["cafe", "almoco"], bairro: "Botafogo", lat: -22.9552844, lng: -43.1922899, rating: 4.7, tip: "Estilo diner americano, ótimo pra panquecas e brunch" },
  { id: 26, name: "Zazá Bistrô Tropical", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Ipanema", lat: -22.9854508, lng: -43.2049036, rating: 4.6, tip: "Moqueca e ceviche a uma quadra da praia de Ipanema" },
  { id: 27, name: "Joaquina Bar & Restaurant", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Botafogo", lat: -22.9553932, lng: -43.1965953, rating: 4.6, tip: "Terraço com vista para o Cristo Redentor" },
  { id: 28, name: "Marius Degustare", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Copacabana", lat: -22.9619514, lng: -43.1663495, rating: 4.8, tip: "Rodízio de frutos do mar em frente à praia" },
  { id: 29, name: "Marine Restô", cat: "alimentacao", meals: ["cafe", "jantar"], bairro: "Copacabana", lat: -22.986097, lng: -43.1892756, rating: 4.5, tip: "Estrelado, vista pra baía, ótimo café da manhã do Fairmont" },
  { id: 30, name: "Quintal Restaurante", cat: "alimentacao", meals: ["almoco"], bairro: "Botafogo", lat: -22.9561344, lng: -43.1924741, rating: 5.0, tip: "Comida caseira brasileira, só almoço, ambiente aconchegante" },
  { id: 31, name: "Fogo de Chão", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Botafogo", lat: -22.9487718, lng: -43.1803052, rating: 4.8, tip: "Rodízio clássico, uma das churrascarias mais tradicionais do Rio" },
  { id: 32, name: "Churrascaria Palace", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Copacabana", lat: -22.9666586, lng: -43.1783911, rating: 4.7, tip: "Buffet frio impecável e carnes na brasa" },
  { id: 33, name: "Assador", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Flamengo", lat: -22.9368064, lng: -43.1694597, rating: 4.6, tip: "Vista para a Baía de Guanabara, tem tomahawk" },
  { id: 34, name: "Churrascaria Rio Brasa", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Barra da Tijuca", lat: -22.9876967, lng: -43.3665004, rating: 4.6, tip: "Ampla variedade de carnes e sobremesas" },
  { id: 35, name: "Cantón Copacabana", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Copacabana", lat: -22.9664216, lng: -43.1785378, rating: 4.6, tip: "Cozinha chinesa e peruana, ótimos drinks" },
  { id: 36, name: "Joia Comida", cat: "alimentacao", meals: ["almoco"], bairro: "Centro (Lapa)", lat: -22.9106157, lng: -43.1829268, rating: 4.7, tip: "Comida chinesa autêntica e em conta, só até 16h" },
  { id: 37, name: "Restaurante ChinaTown", cat: "alimentacao", meals: ["almoco", "jantar"], bairro: "Tijuca", lat: -22.920444, lng: -43.217662, rating: 4.6, tip: "Um dos chineses mais autênticos da cidade" },

  // ---------- DIVERSÃO ----------
  { id: 50, name: "Rio Scenarium", cat: "diversao", bairro: "Lapa", lat: -22.9082902, lng: -43.1841372, rating: 4.6, tip: "Casa de samba icônica, décor de museu vintage, música ao vivo", agendaDias: ["quinta", "sexta", "sabado"] },
  { id: 51, name: "Beco do Rato", cat: "diversao", bairro: "Lapa", lat: -22.9160517, lng: -43.1770979, rating: 4.6, tip: "Roda de samba ao vivo, ambiente descontraído", agendaDias: ["terca", "quinta", "sabado"] },
  { id: 52, name: "Armazém Senado", cat: "diversao", bairro: "Centro", lat: -22.9092133, lng: -43.1846256, rating: 4.8, tip: "Point tradicional pertinho da Lapa", agendaDias: ["sexta", "sabado"] },
  { id: 53, name: "Bar Encontro do Samba", cat: "diversao", bairro: "Riachuelo", lat: -22.9025222, lng: -43.2582093, rating: 4.5, tip: "Samba raiz com banda ao vivo", agendaDias: ["domingo"] },
  { id: 54, name: "Pedra do Sal", cat: "diversao", bairro: "Saúde", lat: -22.8979788, lng: -43.185326, rating: 4.6, tip: "Roda de samba de rua histórica — mais tranquila às segundas", agendaDias: ["segunda", "sexta"] },

  // ---------- TURISMO ----------
  { id: 60, name: "Cristo Redentor", cat: "turismo", sub: "cultura", bairro: "Corcovado", lat: -22.951916, lng: -43.2104872, rating: 4.8, tip: "Vá cedo pela manhã para fugir das multidões", preco: "R$ 105 (ingresso + van/trem)" },
  { id: 61, name: "Pão de Açúcar", cat: "turismo", sub: "por-do-sol", bairro: "Urca", lat: -22.9537972, lng: -43.1633404, rating: 4.9, tip: "Bondinho com vista 360°, imperdível no fim de tarde", preco: "R$ 150 (bondinho ida e volta)" },
  { id: 62, name: "Escadaria Selarón", cat: "turismo", sub: "cultura", bairro: "Lapa/Santa Teresa", lat: -22.9152923, lng: -43.1792036, rating: 4.6, tip: "Suba até o topo para fotos sem multidão", preco: "Gratuito" },
  { id: 63, name: "Mirante Dona Marta", cat: "turismo", sub: "nascer", bairro: "Cosme Velho", lat: -22.9449982, lng: -43.1963955, rating: 4.8, tip: "Gratuito, com vista do Cristo e Pão de Açúcar — chegue cedo", preco: "Gratuito" },
  { id: 64, name: "Mirante do Leblon", cat: "turismo", sub: "por-do-sol", bairro: "Vidigal", lat: -22.9901197, lng: -43.2275078, rating: 4.8, tip: "Vista de Ipanema e Leblon, ótimo pro pôr do sol", preco: "Gratuito" },
  { id: 65, name: "Pedra do Arpoador", cat: "turismo", sub: "por-do-sol", bairro: "Ipanema", lat: -22.9903829, lng: -43.1909875, rating: 4.8, tip: "O point mais famoso do Rio pra ver o sol se pôr — chegue 45min antes", preco: "Gratuito" },
  { id: 66, name: "Jardim Botânico", cat: "turismo", sub: "cultura", bairro: "Jardim Botânico", lat: -22.9706778, lng: -43.2234752, rating: 4.7, tip: "Passeio tranquilo, com direito a macaquinhos", preco: "R$ 30" },
  { id: 67, name: "AquaRio", cat: "turismo", sub: "cultura", bairro: "Gamboa", lat: -22.89332, lng: -43.1921598, rating: 4.6, tip: "Maior aquário da América do Sul, ótimo em dia de chuva", preco: "R$ 120" },
  { id: 68, name: "Praia Vermelha (trilha Pão de Açúcar)", cat: "turismo", sub: "nascer", bairro: "Urca", lat: -22.9556075, lng: -43.1650168, rating: 4.7, tip: "Chegue às 5h pra ver o nascer do sol quase sozinho", preco: "Gratuito" },
  { id: 69, name: "Museu do Amanhã", cat: "turismo", sub: "cultura", bairro: "Centro", lat: -22.8940177, lng: -43.1794418, rating: 4.7, tip: "Arquitetura futurista na orla da Praça Mauá", preco: "R$ 30" },
  { id: 70, name: "Museu de Arte do Rio (MAR)", cat: "turismo", sub: "cultura", bairro: "Centro", lat: -22.8966558, lng: -43.1819565, rating: 4.7, tip: "Arte brasileira contemporânea", preco: "R$ 20" },
  { id: 71, name: "Museu Nacional de Belas Artes", cat: "turismo", sub: "cultura", bairro: "Centro", lat: -22.9088, lng: -43.1756856, rating: 4.7, tip: "Acervo clássico de artistas brasileiros", preco: "R$ 8" },
  { id: 72, name: "Centro Cultural Banco do Brasil", cat: "turismo", sub: "cultura", bairro: "Centro", lat: -22.9010588, lng: -43.1765213, rating: 4.8, tip: "Exposições rotativas, prédio histórico impressionante", preco: "Gratuito" },
  { id: 73, name: "Catedral Metropolitana", cat: "turismo", sub: "cultura", bairro: "Centro", lat: -22.9106919, lng: -43.1806828, rating: 4.7, tip: "Vitrais impressionantes, arquitetura em forma de cone", preco: "Gratuito" },
  { id: 74, name: "Igreja N. Sra. da Candelária", cat: "turismo", sub: "cultura", bairro: "Centro", lat: -22.9007958, lng: -43.1775439, rating: 4.7, tip: "Uma das igrejas mais bonitas e históricas do Centro", preco: "Gratuito" },

  // ---------- PRAIAS ----------
  { id: 90, name: "Praia de Copacabana", cat: "praias", bairro: "Copacabana", lat: -22.9738729, lng: -43.18531, rating: 4.7, tip: "A mais icônica — animada, cheia de quiosques e sempre segura de dia" },
  { id: 91, name: "Praia de Ipanema", cat: "praias", bairro: "Ipanema", lat: -22.9871302, lng: -43.1993762, rating: 4.8, tip: "Melhor pôr do sol e ambiente mais social" },
  { id: 92, name: "Praia do Leblon", cat: "praias", bairro: "Leblon", lat: -22.987277, lng: -43.221161, rating: 4.8, tip: "Mais tranquila e família, vista pros Dois Irmãos" },
  { id: 93, name: "Praia Vermelha", cat: "praias", bairro: "Urca", lat: -22.955163, lng: -43.164698, rating: 4.7, tip: "Pequena, cercada de natureza, vista do Pão de Açúcar" },
  { id: 94, name: "Praia da Barra da Tijuca", cat: "praias", bairro: "Barra da Tijuca", lat: -23.013023, lng: -43.3200848, rating: 4.8, tip: "Bem mais ampla e menos cheia, ótima pra família" },

  // ---------- SERVIÇOS ----------
  { id: 100, name: "Aeroporto Internacional Tom Jobim (Galeão)", cat: "servicos", sub: "aeroportos", bairro: "Ilha do Governador", lat: -22.8052698, lng: -43.2566277, rating: 4.3, tip: "Voos internacionais — cerca de 40min do Centro, mais no trânsito" },
  { id: 101, name: "Aeroporto Santos Dumont", cat: "servicos", sub: "aeroportos", bairro: "Centro", lat: -22.9097959, lng: -43.1638162, rating: 4.5, tip: "Voos domésticos, bem no Centro — ótimo pra quem sai de Copacabana" },
  { id: 102, name: "Rodoviária Novo Rio", cat: "servicos", sub: "rodoviarias", bairro: "Santo Cristo", lat: -22.8991915, lng: -43.2090622, rating: 3.7, tip: "Ônibus pra outras cidades — use Uber pra chegar e sair, a área é movimentada" },
  { id: 103, name: "CopaStar", cat: "servicos", sub: "hospitais", bairro: "Copacabana", lat: -22.9668776, lng: -43.188637, rating: 4.8, tip: "Hospital particular, atendimento rápido e equipe que fala inglês" },
  { id: 104, name: "Hospital Copa D'Or", cat: "servicos", sub: "hospitais", bairro: "Copacabana", lat: -22.9652784, lng: -43.1904952, rating: 4.5, tip: "Pronto-socorro particular bem avaliado, no coração de Copacabana" },
  { id: 105, name: "Hospital Quali Ipanema", cat: "servicos", sub: "hospitais", bairro: "Ipanema", lat: -22.9835489, lng: -43.2005546, rating: 4.3, tip: "Bom custo-benefício pra turista, atendimento rápido" },
  { id: 106, name: "Hospital Municipal Souza Aguiar", cat: "servicos", sub: "hospitais", bairro: "Centro", lat: -22.9083189, lng: -43.1897412, rating: 3.4, tip: "Hospital público de referência em trauma e emergência no Centro" },
];

// ADICIONADO: textos de história por ponto turístico (usado no modal de detalhes)
const HISTORIAS = {
  60: "Inaugurado em 1931, o Cristo Redentor foi construído em concreto armado e pedra-sabão, com projeto do engenheiro Heitor da Silva Costa. É uma das Sete Maravilhas do Mundo Moderno.",
  61: "O bondinho do Pão de Açúcar começou a operar em 1912, sendo um dos primeiros teleféricos do mundo. O nome vem do formato do morro, que lembra os pães de açúcar usados no século XVI.",
  62: "Criada pelo artista chileno Jorge Selarón a partir de 1990, a escadaria tem mais de 2.000 azulejos vindos de mais de 60 países. Selarón viveu na casa ao lado até sua morte em 2013.",
  66: "Fundado em 1808 por Dom João VI, o Jardim Botânico do Rio é um dos mais importantes do mundo, com mais de 6.500 espécies de plantas.",
  69: "Aberto em 2015 na revitalizada Praça Mauá, o Museu do Amanhã tem projeto do arquiteto espanhol Santiago Calatrava e explora o futuro da humanidade e do planeta.",
  70: "Inaugurado em 2013, o MAR reúne dois prédios históricos conectados por uma cobertura ondulada, reunindo arte brasileira do século XIX até hoje.",
  71: "Fundado em 1937, o Museu Nacional de Belas Artes guarda o maior acervo de pintura e escultura do país, incluindo obras de mestres brasileiros do século XIX.",
  73: "Construída entre 1964 e 1979, a Catedral Metropolitana tem formato cônico inspirado nas pirâmides maias, com 96 metros de altura e vitrais que vão do chão ao teto.",
  74: "Erguida entre 1775 e 1898, a Igreja da Candelária é uma das mais antigas do Rio e ficou marcada na história recente pela Chacina da Candelária, em 1993.",
};

// ADICIONADO: retorna a história de um ponto turístico (ou texto padrão se não houver)
function getHistoria(item) {
  return HISTORIAS[item.id] || "Um dos pontos mais visitados do Rio de Janeiro, parte essencial da identidade da cidade.";
}

// ADICIONADO: retorna o rótulo de preço/ingresso pra exibir nos cards e no modal
function getPriceLabel(item) {
  if (item.cat === "turismo" && item.preco) return item.preco;
  return null;
}

// ADICIONADO: mapa de dias da semana pra agenda de Diversão
const DIAS_SEMANA = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

// ADICIONADO: componente de agenda semanal pra aba Diversão
function AgendaView({ onSelect }) {
  const eventos = PLACES.filter((p) => p.cat === "diversao");
  return (
    <div>
      {DIAS_SEMANA.map((dia) => {
        const doDia = eventos.filter((e) => e.agendaDias && e.agendaDias.includes(dia.id));
        if (doDia.length === 0) return null;
        return (
          <div key={dia.id} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#76C339" }}>
              {dia.label}
            </div>
            {doDia.map((e) => (
              <div
                key={e.id}
                onClick={() => onSelect(e)}
                style={{ background: "#0C3A3E", borderRadius: 12, padding: 12, marginBottom: 8, cursor: "pointer", border: "1px solid rgba(225,220,198,0.08)" }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: "rgba(225,220,198,0.6)", marginTop: 2 }}>{e.bairro}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Bounding box fixo (todo o Rio coberto pelo guia) — mantém o mapa consistente entre categorias
const BOUNDS = { minLat: -23.03, maxLat: -22.79, minLng: -43.38, maxLng: -43.15 };

function project(lat, lng) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.min(97, Math.max(3, x)), y: Math.min(96, Math.max(4, y)) };
}

const CAT_ICON = {
  hospedagem: "\u{1F3E8}", alimentacao: "\u{1F374}", diversao: "\u{1F3B6}", turismo: "\u{1F5FB}",
  praias: "\u{1F3D6}\uFE0F", servicos: "\u{1F3E5}",
};

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km) {
  if (km < 1) return Math.round(km * 1000) + " m";
  return km.toFixed(1) + " km";
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 240 16" preserveAspectRatio="none" style={{ width: "100%", height: 12, display: "block" }}>
      <path d="M0 8 Q 15 0, 30 8 T 60 8 T 90 8 T 120 8 T 150 8 T 180 8 T 210 8 T 240 8" fill="none" stroke="#76C339" strokeWidth="2.2" opacity="0.6" />
    </svg>
  );
}

const ESSENTIALS = [
  { icon: "\u{1F695}", title: "Locomoção", text: "Use apps de transporte (Uber/99) pra ir e voltar, principalmente à noite. É o jeito mais seguro e prático de andar pela cidade." },
  { icon: "\u{1F4B3}", title: "Câmbio e pagamento", text: "Cartão é aceito na maioria dos lugares. Leve algum dinheiro vivo pra praia e feirinhas." },
  { icon: "\u{1F31E}", title: "Sol e praia", text: "Use protetor solar, leve água e evite deixar pertences à vista na areia." },
  { icon: "\u{1F46E}", title: "Segurança", text: "As áreas deste guia são as mais turísticas e movimentadas do Rio. Ainda assim, evite exibir celular e joias caras na rua." },
];

function MapView({ items, coords, onSelect }) {
  return (
    <div style={{
      position: "relative", width: "100%", height: 360, borderRadius: 16, overflow: "hidden",
      background: "radial-gradient(circle at 30% 20%, #123F44 0%, #0A2A2F 55%, #071F23 100%)",
      border: "1px solid rgba(118,195,57,0.2)",
    }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
        {[...Array(6)].map((_, i) => (
          <line key={"h"+i} x1="0" y1={(i+1)*(100/7)+"%"} x2="100%" y2={(i+1)*(100/7)+"%"} stroke="#E1DCC6" strokeWidth="1" />
        ))}
        {[...Array(6)].map((_, i) => (
          <line key={"v"+i} x1={(i+1)*(100/7)+"%"} y1="0" x2={(i+1)*(100/7)+"%"} y2="100%" stroke="#E1DCC6" strokeWidth="1" />
        ))}
      </svg>

      <div style={{ position: "absolute", top: 10, left: 12, fontSize: 10, letterSpacing: 1.5, color: "rgba(225,220,198,0.5)", fontWeight: 600 }}>
        N \u2191 &nbsp; MAPA ESQUEMÁTICO DO RIO
      </div>

      {coords && (() => {
        const p = project(coords.lat, coords.lng);
        return (
          <div style={{ position: "absolute", left: p.x + "%", top: p.y + "%", transform: "translate(-50%,-50%)", zIndex: 5 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#4EA5FF", border: "3px solid rgba(78,165,255,0.35)" }} />
          </div>
        );
      })()}

      {items.map((p) => {
        const pos = project(p.lat, p.lng);
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            style={{
              position: "absolute", left: pos.x + "%", top: pos.y + "%", transform: "translate(-50%,-100%)",
              background: "none", border: "none", cursor: "pointer", padding: 0, zIndex: 4,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: "50% 50% 50% 0", background: "#76C339",
              transform: "rotate(-45deg)", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}>
              <span style={{ transform: "rotate(45deg)", fontSize: 13 }}>{CAT_ICON[p.cat]}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function RioGuideApp() {
  const [activeTopic, setActiveTopic] = useState("turismo");
  const [activeSub, setActiveSub] = useState("todos");
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState("idle");
  const [selected, setSelected] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState("lista");

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocStatus("error"); return; }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocStatus("ok"); },
      () => setLocStatus("error"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const changeTopic = (id) => { setActiveTopic(id); setActiveSub("todos"); setView("lista"); };

  const list = useMemo(() => {
    let items = PLACES.filter((p) => p.cat === activeTopic);
    if (activeTopic === "alimentacao" && activeSub !== "todos") {
      items = items.filter((p) => p.meals && p.meals.includes(activeSub));
    }
    if ((activeTopic === "turismo" || activeTopic === "servicos") && activeSub !== "todos") {
      items = items.filter((p) => p.sub === activeSub);
    }
    if (coords) {
      return items.map((p) => ({ ...p, dist: haversine(coords.lat, coords.lng, p.lat, p.lng) })).sort((a, b) => a.dist - b.dist);
    }
    return items.sort((a, b) => b.rating - a.rating);
  }, [activeTopic, activeSub, coords]);

  const currentTopic = TOPICS.find((t) => t.id === activeTopic);
  const subtabs = SUBTABS[activeTopic];

  const openFromMap = (p) => {
    if (coords) {
      setSelected({ ...p, dist: haversine(coords.lat, coords.lng, p.lat, p.lng) });
    } else {
      setSelected(p);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#042F35", fontFamily: "'Work Sans', sans-serif", color: "#E1DCC6", paddingBottom: 40 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .chip { border: 1px solid rgba(225,220,198,0.25); background: transparent; color: #E1DCC6; padding: 8px 14px; border-radius: 999px; font-family: 'Work Sans', sans-serif; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0; }
        .chip.active { background: #76C339; border-color: #76C339; color: #042F35; font-weight: 700; }
        .subchip { border: 1px solid rgba(225,220,198,0.18); background: rgba(225,220,198,0.05); color: #E1DCC6; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer; flex-shrink: 0; }
        .subchip.active { background: #E1DCC6; color: #042F35; font-weight: 700; border-color: #E1DCC6; }
        .card { background: #0C3A3E; border-radius: 14px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(225,220,198,0.08); cursor: pointer; }
        .card:active { transform: scale(0.99); }
        .locBtn { background: #76C339; color: #042F35; border: none; border-radius: 12px; padding: 12px 16px; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; width: 100%; justify-content: center; font-family: 'Work Sans', sans-serif; }
        .viewToggle { display: flex; background: rgba(225,220,198,0.06); border-radius: 10px; padding: 3px; gap: 3px; }
        .viewBtn { border: none; background: transparent; color: rgba(225,220,198,0.6); padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 5px; cursor: pointer; }
        .viewBtn.active { background: #76C339; color: #042F35; }
        .scrollRow::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
        <img src={LOGO_MONOGRAM} alt="RV" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
        <img src={LOGO_WORDMARK} alt="RamonGuia" style={{ height: 34, objectFit: "contain" }} />
      </div>

      {showIntro && (
        <div style={{ margin: "18px 20px 0", background: "#0C3A3E", borderRadius: 16, padding: 20, position: "relative", border: "1px solid rgba(118,195,57,0.25)" }}>
          <button onClick={() => setShowIntro(false)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(225,220,198,0.1)", border: "none", borderRadius: "50%", width: 26, height: 26, color: "#E1DCC6", cursor: "pointer" }}>
            <X size={14} />
          </button>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <img src={LOGO_STAMP} alt="Bem vindo ao Rio" style={{ width: 64, borderRadius: 8, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Primeira vez no Rio?</div>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(225,220,198,0.75)", margin: 0 }}>
                Esse é o seu roteiro com o que há de melhor e mais seguro pra descobrir a cidade como um carioca. Escolha um tópico abaixo pra começar.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 22 }}><WaveDivider /></div>

      <div style={{ padding: "16px 20px 4px" }}>
        {locStatus !== "ok" ? (
          <button className="locBtn" onClick={requestLocation}>
            {locStatus === "loading" ? (<><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Localizando...</>) : (<><Navigation size={16} /> Usar minha localização para ver distâncias</>)}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#76C339", fontSize: 13, fontWeight: 600, padding: "8px 4px" }}>
            <MapPin size={15} /> Mostrando distâncias a partir da sua localização
          </div>
        )}
        {locStatus === "error" && <p style={{ color: "#E27D60", fontSize: 12, marginTop: 8 }}>Não consegui acessar sua localização. Ative a permissão de GPS e tente de novo.</p>}
      </div>

      <div className="scrollRow" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 20px" }}>
        {TOPICS.map((t) => (
          <button key={t.id} className={"chip " + (activeTopic === t.id ? "active" : "")} onClick={() => changeTopic(t.id)}>{t.icon} {t.label}</button>
        ))}
      </div>

      {currentTopic && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "0 20px", margin: "4px 0 4px" }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(225,220,198,0.6)", flex: 1 }}>{currentTopic.blurb}</p>
          {activeTopic !== "sobre" && (
            <div className="viewToggle">
              <button className={"viewBtn " + (view === "lista" ? "active" : "")} onClick={() => setView("lista")}><List size={13} /> Lista</button>
              <button className={"viewBtn " + (view === "mapa" ? "active" : "")} onClick={() => setView("mapa")}><MapIcon size={13} /> Mapa</button>
              {activeTopic === "diversao" && (
                <button className={"viewBtn " + (view === "agenda" ? "active" : "")} onClick={() => setView("agenda")}>Agenda</button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTopic === "sobre" && (
        <div style={{ padding: "10px 20px" }}>
          <div style={{ background: "#0C3A3E", borderRadius: 16, padding: 20, border: "1px solid rgba(118,195,57,0.25)", marginBottom: 16 }}>
            <img src={LOGO_MONOGRAM} alt="Ramon Viana" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }} />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, marginBottom: 6 }}>Ramon Viana — Guia e Fotógrafo</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(225,220,198,0.75)", margin: "0 0 16px" }}>
              Passeios guiados e ensaios fotográficos pelos pontos mais bonitos do Rio. Veja pacotes, fotos e feche seu passeio direto no site.
            </p>
            <a
              href="https://ramonguiarj.com"
              target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#76C339", color: "#042F35", padding: "13px 16px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              <Navigation size={15} /> Abrir ramonguiarj.com
            </a>
          </div>

          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(225,220,198,0.12)", height: 480, background: "#0C3A3E" }}>
            <iframe
              src="https://ramonguiarj.com"
              title="RamonGuia"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <p style={{ fontSize: 11, color: "rgba(225,220,198,0.4)", marginTop: 8 }}>
            Se a prévia acima não carregar, use o botão "Abrir ramonguiarj.com" para ver o site completo.
          </p>
        </div>
      )}

      {activeTopic !== "sobre" && subtabs && view !== "agenda" && (
        <div className="scrollRow" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "6px 20px 4px" }}>
          {subtabs.map((s) => (
            <button key={s.id} className={"subchip " + (activeSub === s.id ? "active" : "")} onClick={() => setActiveSub(s.id)}>
              {s.id === "nascer" && <Sunrise size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
              {s.id === "por-do-sol" && <Sunset size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
              {s.label}
            </button>
          ))}
        </div>
      )}

      {activeTopic === "sobre" ? null : view === "agenda" && activeTopic === "diversao" ? (
        <div style={{ padding: "10px 20px" }}><AgendaView onSelect={setSelected} /></div>
      ) : view === "mapa" ? (
        <div style={{ padding: "10px 20px" }}>
          <MapView items={list} coords={coords} onSelect={openFromMap} />
          <p style={{ fontSize: 11, color: "rgba(225,220,198,0.4)", marginTop: 8 }}>Toque em um pino pra ver detalhes. {coords ? "O ponto azul é você." : ""}</p>
        </div>
      ) : (
        <div style={{ padding: "10px 20px" }}>
          {list.map((p) => (
            <div className="card" key={p.id} onClick={() => setSelected(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, color: "rgba(225,220,198,0.6)", fontSize: 12.5 }}>
                    <MapPin size={12} /> {p.bairro}
                  </div>
                </div>
                <div style={{ textAlign: "right", marginLeft: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#76C339", fontSize: 13, fontWeight: 700 }}>
                    <Star size={12} fill="#76C339" /> {p.rating}
                  </div>
                  {p.dist !== undefined && <div style={{ color: "#E1DCC6", fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>{formatDist(p.dist)}</div>}
                </div>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={13} color="#76C339" />
                <span style={{ fontSize: 12, color: "rgba(225,220,198,0.55)" }}>Área turística e movimentada</span>
              </div>
              {getPriceLabel(p) && (
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#F2C230", fontWeight: 600 }}>
                  <Ticket size={12} /> {getPriceLabel(p)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Info size={16} color="#76C339" />
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600 }}>Dicas essenciais pra quem chega agora</span>
        </div>
        {ESSENTIALS.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, background: "#0C3A3E", borderRadius: 12, padding: 14 }}>
            <span style={{ fontSize: 20 }}>{e.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{e.title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(225,220,198,0.65)", lineHeight: 1.4 }}>{e.text}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(4,47,53,0.88)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => setSelected(null)}>
          <div style={{ background: "#0C3A3E", width: "100%", borderRadius: "20px 20px 0 0", padding: 24, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(225,220,198,0.1)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#E1DCC6", cursor: "pointer" }}>
              <X size={16} />
            </button>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{selected.name}</div>
            <div style={{ color: "rgba(225,220,198,0.6)", fontSize: 13, marginBottom: 14 }}>{selected.bairro}</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#76C339", fontWeight: 700 }}>
                <Star size={14} fill="#76C339" /> {selected.rating}
              </div>
              {selected.dist !== undefined && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#E1DCC6", fontWeight: 700 }}>
                  <Compass size={14} /> {formatDist(selected.dist)} de você
                </div>
              )}
            </div>
            {getPriceLabel(selected) && (
              <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#F2C230", fontWeight: 700 }}>
                <Ticket size={14} /> {getPriceLabel(selected)}
              </div>
            )}
            <p style={{ fontSize: 14, lineHeight: 1.5, color: "#E1DCC6" }}>{selected.tip}</p>
            {selected.cat === "turismo" && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(225,220,198,0.1)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(225,220,198,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>História</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(225,220,198,0.85)", margin: 0 }}>{getHistoria(selected)}</p>
              </div>
            )}
            <a
              href={"https://www.google.com/maps/search/?api=1&query=" + selected.lat + "," + selected.lng}
              target="_blank" rel="noreferrer"
              style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#76C339", color: "#042F35", padding: "12px 16px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              <Navigation size={15} /> Ver rota no Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
