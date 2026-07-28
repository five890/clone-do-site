# Direção de Design — Painel de IP

## Referência como especificação visual

Este projeto é uma reconstrução funcional inspirada na página de referência indicada pelo usuário. A referência define a composição: experiência de tela única, fundo muito escuro com halos violeta-azulados, marca centralizada no terço superior, cartão compacto de ativação e leitura rápida dos dados de IP. Não serão reutilizados os arquivos, o código ou o logotipo da página de origem; a interface terá identidade própria e manterá o objetivo visual solicitado.

### Elementos observados a preservar

| Área | Diretriz de implementação |
| --- | --- |
| Painel de IP | Exibir o rótulo **Seu IP atual** e um campo de IP com visual técnico e indicador de status. |
| Ativação | Manter o campo para chave de acesso e um botão primário de ativação de grande contraste. |
| Certificado | Manter um atalho de certificado como ação secundária. |
| Área de WhatsApp | Substituir o atalho de canal por uma ação/área nova, configurável após o usuário informar o que deseja colocar no lugar. |
| Servidores | Apresentar uma área de servidores disponíveis de forma organizada, sem alegar disponibilidade real nem executar qualquer conexão. |

## Abordagem escolhida — Console Orbital

### Movimento de design

**Futurismo editorial de interface**, com inspiração em painéis de controle noturnos: poucas superfícies, hierarquia luminosa e detalhes técnicos discretos, sem exagero de brilho neon.

### Princípios centrais

1. **Foco de tarefa**: o IP, a chave e a ação de ativação são sempre os pontos de maior prioridade visual.
2. **Profundidade silenciosa**: luz difusa, ruído sutil e transparências criam atmosfera sem competir com os controles.
3. **Precisão legível**: rótulos compactos e dados monoespaçados reforçam o caráter técnico e facilitam a leitura.
4. **Ação evidente**: apenas uma ação primária domina o cartão; as demais são auxiliares e claramente separadas.

### Filosofia de cor

O fundo usa preto com azul-marinho profundo para reduzir fadiga visual. A assinatura da marca será **violeta elétrico `#7568FF`**, aplicado em halos, bordas ativas e na ação principal. Cinzas azulados organizam informações secundárias e verde suave sinaliza estado ativo; a cor é usada como informação, não como decoração.

### Paradigma de layout

Uma composição vertical de **eixo orbital**: a marca flutua acima de um painel deslocado por halos de luz, enquanto a lista de servidores se abre abaixo em uma faixa ampla. Em desktop, a leitura é vertical e concentrada; em mobile, o cartão ocupa quase toda a largura sem perder a sensação de profundidade.

### Elementos de assinatura

1. Um símbolo de escudo orbital próprio, sem texto e sem relação com a marca de referência.
2. Halos assimétricos violeta-azulados difusos nas bordas do fundo.
3. Uma linha de telemetria com ponto de status verde para os dados de IP.

### Filosofia de interação

Os campos respondem com borda luminosa suave ao foco. A ativação recebe feedback local e explícito, sem fingir realizar uma ativação externa. A nova área substituta do WhatsApp será um botão/atalho independente, com rótulo e destino definidos pelo usuário.

### Animação

Entradas curtas e escalonadas (opacidade e deslocamento vertical de até 12 px), com duração entre 180 e 280 ms e `prefers-reduced-motion` respeitado. Halos de fundo têm movimento quase imperceptível; botões respondem com escala de 0,97 no clique.

### Sistema tipográfico

**Space Grotesk** para títulos e CTAs, conferindo estrutura geométrica; **IBM Plex Mono** para IPs, chaves, portas e estados técnicos. Títulos usam peso 700, rótulos em caixa alta e espaçamento de letras amplo, e dados usam números tabulares quando possível.

### Essência da marca

**Um painel de acesso claro e técnico para quem precisa consultar um IP e organizar seus dados de conexão em uma única tela.**

Personalidade: **precisa, noturna, confiável**.

### Voz da marca

Os textos devem ser diretos, técnicos e calmos. Evitar promessas vagas ou linguagem de urgência artificial.

> "Seu ponto de acesso está pronto para conferência."

> "Insira a chave para validar o próximo passo."

### Logotipo e ícone

O símbolo será um escudo prismático composto por duas lâminas curvas e um núcleo em violeta, sem letras. A palavra do produto será composta no site com tipografia própria; não será usada como arte gerada.

