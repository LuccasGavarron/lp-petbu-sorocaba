# PetBu — Direção de landing (prospecção, 2 versões)

Cliente real prospectado em Sorocaba/SP. Sem site (o "site" no Google Maps é o Instagram).
Objetivo: 2 versões de landing fiéis à identidade real, para apresentar à dona.

## Dados reais (fonte: Google Maps + Instagram @petbu.shop.vet — NÃO inventar nada além)

- Nome: **PetBu — Pet shop e Clínica Veterinária**
- Endereço: **R. Atanázio Soares, 3282 — Vila Formosa, Sorocaba/SP, 18074-385**
- WhatsApp: **(15) 99166-8744** → `https://wa.me/5515991668744` (mensagens pré-preenchidas por serviço)
- Instagram: **@petbu.shop.vet** (https://www.instagram.com/petbu.shop.vet/)
- Horário: **Seg a Sáb 09:00–18:00 · Dom fechado**
- Google: **5,0 ★ · 46 avaliações**
- Bio: "🐶 Petshop e Clínica Veterinária · ✂️ Banho & Tosa · 💉 Vacinas · 🩺 Consultas · 📍 Sorocaba – SP · Agende pelo WhatsApp"
- Compras na loja · Retirada na porta · Entrega (Maps)
- Perfil público no Maps: **empresa de empreendedoras** e **acolhe a comunidade LGBTQ+** (usar com orgulho e sobriedade, ex. selo/linha "Negócio liderado por mulheres · Todos os pets e famílias são bem-vindos")
- **7 diferenciais do banho e tosa** (post oficial do cliente): 1. equipamentos silenciosos; 2. ambiente climatizado; 3. produtos profissionais de alta qualidade; 4. profissional com mais de 20 anos de experiência; 5. veterinária no local; 6. cromoterapia; 7. você escolhe o adereço e o perfume.
- Quotes reais de avaliações Google (usar como "o que dizem no Google", sem nome): "Ótimo serviço de banho e tosa e veterinário!" · "Os preços são ótimos, fora o programa de fidelidade que dá mais descontos" · "Lugar super agradável, atendentes super simpáticos e prestativos!"
- Programa de fidelidade com descontos (citado em avaliação) — mencionar como "pergunte pelo programa de fidelidade".
- PROIBIDO: preços, promessas médicas, depoimentos com nomes, números inventados.

## Identidade visual real (extraída do feed)

- Logo: `assets/img/logo.jpg` (150px — usar pequena no header/footer; wordmark bubble colorida)
- Paleta: **teal escuro #2F7E7B** (dominante; variação #1F5F63), **rosa pink #EE5A9E**, **amarelo suave #F2C230** (pontual), **off-white #FAF9F6**, texto **#22303A**. Branco puro só dentro de cartões.
- Tipografia (Google Fonts): display **"Baloo 2"** (700/800 — eco das letras bubble da logo) + corpo **"Nunito"** (400/600/700/800).
- Linguagem dos posts (reproduzir): **blobs orgânicos** teal+rosa sobrepostos com **foto em círculo** dentro (anel duplo teal/rosa), **linhas tracejadas de pontinhos** com bolinha na ponta (SVG), estrelinhas de 4 pontas discretas, títulos teal com trecho de destaque em rosa.
- Fotos disponíveis em `assets/img/`: `post-01.jpg` (card "7 diferenciais banho e tosa", teal), `post-04.jpg` (card labrador "deficiência visual"), `post-05.jpg` (card "cachorro não quer comer", blob verde), `post-09.jpg` (card cão triste em círculo teal/rosa), `post-10.jpg` (card jack russell "comportamentos"). São cards do feed — usar como grade **"PetBu Educa · direto do nosso Instagram"** (cada um linka o perfil). NÃO usar como fotografia de hero.
- Hero sem fotografia crua: composição gráfica com blobs + círculos + logo + tipografia (fiel aos posts).

## Estrutura (as duas versões; single page + termos/ e privacidade/ simples)

1. Header: logo + nav (Serviços · Banho & Tosa · PetBu Educa · Avaliações · Onde estamos) + botão WhatsApp verde (#1FA855, exclusivo de WhatsApp).
2. Hero: H1 tipo "Pet shop e clínica veterinária **de bairro, do jeitinho que seu pet merece**" (ajustar copy livremente sem inventar fatos); sub com bio; CTA WhatsApp; linha 5,0 ★ · 46 avaliações no Google (estrelas amarelas); linha horário+bairro.
3. Serviços (4): Banho & Tosa · Consultas · Vacinas · Loja & Produtos — com CTA wa por serviço.
4. **Banho & Tosa em destaque**: os 7 diferenciais reais (lista estilizada com pontinhos/patinha) + CTA agendar.
5. Sobre/acolhimento: empreendedoras + todos bem-vindos + retirada/entrega + fidelidade.
6. PetBu Educa: grade com os cards do feed + "seguir @petbu.shop.vet".
7. Avaliações: 5,0·46 + as 3 quotes + link Google Maps (https://www.google.com/maps/search/PetBu+Sorocaba).
8. Onde estamos: mapa embed (q=PetBu R. Atanázio Soares 3282 Sorocaba) + endereço + horários + contatos.
9. Footer com logo, links, Instagram, Termos/Privacidade.
10. Botão WhatsApp flutuante; seletor de versões fixo no canto superior esquerdo (pílula "Versão 1/2" com links index.html ↔ v2.html, estilo discreto).

## As duas versões

- **index.html (Versão 1 — "Bubble Clean")**: fundo off-white, seções alternando off-white e teal-claro suave (#EAF4F3); cards brancos arredondados (radius 18-24px, sombras suaves coloridas rgba(47,126,123,.15)); blobs decorativos nas bordas; heading teal com palavras-chave em rosa; vibe do feed.
- **v2.html (Versão 2 — "Teal Imersivo")**: fundo teal escuro #1F5F63 dominante (texto off-white), cards off-white, rosa como acento forte, hero tipográfico grande centrado com blobs escuros tom-sobre-tom, seção Educa com cards flutuando; mais moderna/bold, mesma informação. CSS próprio (v2.css) podendo importar tokens comuns.

## Qualidade (obrigatório)

Responsivo 375/768/1440 sem overflow horizontal; headings semânticos; alt text descritivo em todas as imagens; foco visível; contraste AA (rosa nunca como cor de texto pequeno sobre teal); `prefers-reduced-motion`; reveals suaves via IntersectionObserver apenas (sem biblioteca); sem console errors; checklist anti-vibecoded (nada de emoji como ícone na UI, ícones SVG próprios de traço arredondado, sem gradientes berrantes — gradiente só tom-sobre-tom do teal se precisar).
