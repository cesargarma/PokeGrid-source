<div align="center">

<img src="tray.png" width="72" alt="PokeGrid">

# PokeGrid

**Quatro contas de Poke Idle World em uma janela só.**

![Plataforma](https://img.shields.io/badge/Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-0078D6)
![Electron](https://img.shields.io/badge/Electron-43-47848F)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)](LICENSE)

[English](README.en.md)

<img src="docs/modo-simples.png" width="880" alt="Modo Simples: painel com os números das quatro contas">

<sub>Modo Simples: esconde o jogo e mostra só os números. Cada seção pode ser movida e redimensionada.</sub>

</div>

> Esta é a versão que roda a partir do código. Não tem executável pronto pra baixar: você pega o código, olha o que ele faz e roda você mesmo. Assim a confiança fica com você, não comigo.

> 🔰 **Nunca mexeu com isso?** Tem um passo a passo pra leigo aqui: **[TUTORIAL.md](TUTORIAL.md)** (ou o arquivo `COMO USAR.txt` dentro da pasta).

> ### 🔒 Seus dados de login ficam só no seu computador
> Login e senha são criptografados no seu próprio PC e nunca saem dele. Nada de servidor, nada de repositório. O código está todo aqui pra você conferir.

## O que é

Quatro contas rodando ao mesmo tempo, cada uma no seu quadrante e com sessão separada. Você salva o login uma vez e o app entra sozinho nas próximas. Se a sessão cair no meio do farm, ele loga de novo sem você precisar estar por perto. Ele não automatiza o jogo nem toca no captcha, só organiza as contas que você já tem.


## 🚀 Novedades y Mejoras Exclusivas

Esta versión personalizada incorpora potentes herramientas analíticas, simuladores avanzados y mejoras de calidad de vida (QoL) desarrolladas para llevar el rendimiento multicuenta al siguiente nivel:

---

### 1. ⚔️ Simulador de Bosses & Optimizador de Equipos
Permite simular batallas completas contra los jefes mundiales del juego (**Giant Cruel**, **Ancient Aero** y futuros bosses) calculando con precisión matemática el desenlace del combate.

<img src="docs/simulador-bosses.jpg" width="880" alt="Simulador de Bosses y Optimizador de Equipos">

- **Simulación precisa de combate**: Modela el daño por golpe, tiempo de ataque (cadencia), aguante individual de cada Pokémon y tiempo total de supervivencia frente al boss.
- **Diseño ergonómico en dos columnas**:
  - **Panel lateral de configuración**: Selección de alcance (modo global "Todas las cuentas" o individual por entrenador), selector dinámico de bonus de Clan (+15% ATK) con afinidades elementales oficiales (Orebound, Seavell, Psycraft, Malefic, Naturia, etc.), e indicadores de Held Items.
  - **Panel principal de resultados**: Banner de resultado (Victoria o Derrota con HP restante del boss), barra de vida segmentada por el daño causado por cada Pokémon, y visualización de un Pokémon por fila con métricas 2x2 (Daño / cadencia, Daño recibido / golpe, Resistencia en golpes/tiempo, Daño aportado) y porcentaje de daño destacado.
- **Held Items oficiales calibrados por Tiers**: Soporte fiel a la tabla oficial de Held Items (Tiers 1 al 8 para X-Attack, X-Defense, X-Vitality, X-Boost, Critical, Block, Experience y Lucky).
- **Optimización y selección automática**: Analiza todos los Pokémon disponibles entre tus cuentas y compone automáticamente el equipo óptimo de 6 para maximizar el DPS y la probabilidad de victoria.

---

### 2. 🔍 Explorador Global de Pokémon Multicuenta
Unifica en una única pantalla de consulta rápida todos los Pokémon que posees repartidos en cualquiera de tus cuentas.

<img src="docs/explorador-pokemon.jpg" width="880" alt="Explorador Global de Pokémon Multicuenta">

- **Presets instantáneos con contadores en tiempo real**:
  - `Nv 300+`: Acceso directo a los Pokémon de alto nivel.
  - `Capturas (Sesión)`: Pokémon capturados en la sesión activa de juego.
  - `En Equipo`: Todos los Pokémon actualmente asignados a equipos de combate.
  - `IV 160+`: Ejemplares con estadísticas genéticas sobresalientes.
  - `Todos`: Censo total de Pokémon entre todas las cuentas.
- **Filtros avanzados combinables**: Búsqueda por nombre o tipo elemental, rangos de IVs mínimos y máximos, rangos de calidad multiplicadora, filtro de Shinies ✨ y selector por entrenador.
- **Cálculo de Poder Total ponderado**: Algoritmo que calcula el poder efectivo combinando nivel, IVs y multiplicador de calidad/rareza (Lendária, Mítica, etc.).
- **Inspección de IVs**: Acceso al desglose de IVs y estadísticas detalladas con un solo clic.

---

### 3. 📊 Columnas de % EXP y Estimación de Lvl Up en la Tabla Simple
Visualiza al instante el progreso exacto y el tiempo restante para que el líder de cada cuenta suba de nivel.

<img src="docs/lvlup-exp-progress.png" width="880" alt="Progreso de EXP y tiempo estimado de Lvl Up">

- **% EXP**: Muestra el porcentaje acumulado en el nivel actual con una barra de progreso gráfica proporcional.
- **Lvl Up**: Proyección temporal inteligente en tiempo real (`2h 41m`, `2d 15h`) calculada a partir del ritmo medido de XP/hora en la hunt en curso.

---

### 4. ⭐ Inventario Global con Favoritos Fijados y Búsqueda en Vivo
Gestión de inventario unificada que suma los recursos de bolsa y depósito de todas las cuentas activas.

<img src="docs/inventario-global-favoritos.png" width="880" alt="Inventario Global con Favoritos Fijados y Búsqueda">

- **Sistema de Favoritos persistente**: Marca cualquier ítem con la estrella `☆` para fijarlo arriba del todo con `★` dorado, manteniéndolo siempre a la vista sin importar la cantidad o el orden alfabético.
- **Separador visual elegante**: Barra divisoria que delimita los favoritos fijados de los demás ítems o resultados de búsqueda.
- **Buscador en tiempo real persistente**: Filtra al instante mientras escribes, con persistencia garantizada que evita parpadeos o reinicios involuntarios durante los ciclos de refresco automático del juego. Los favoritos siempre permanecen fijados arriba.

---

### 5. 🎒 Tarjeta Modular de Consumibles, Divisas y Estado VIP
Panel unificado y compacto para monitorizar los suministros esenciales de cada cuenta sin necesidad de entrar a cada juego.

<img src="docs/consumibles-multicuenta.png" width="880" alt="Tarjeta Modular de Consumibles por Cuenta">

- **Pokéballs**: Recuento por cuenta de Ultra Balls, Idle Balls y otras bolas en uso.
- **Pociones**: Stock de pociones (Ultra Potion, etc.) para prevenir muertes innecesarias en el farm.
- **Divisas**: Dinero acumulado ($) y Diamantes en tiempo real por cuenta.
- **Estado y tiempo VIP**: Indicador visual del estado de membresía VIP con el tiempo restante exacto (`VIP · 35d 22h`).

---

### 6. ⚡ Accesos Rápidos en Barra Superior y Recarga en Caliente
Navegación cómoda y fluida sin interferir con las partidas en ejecución.

<img src="docs/topbar-modulos.png" width="880" alt="Botones en la Barra Superior">

- **Botones dedicados en la Topbar**: Accesos directos para abrir los modales de **Pokémon** y **Bosses ⚔️** con tecla rápida `Escape` para cerrar.
- **Botón "Recargar UI"**: Permite recargar las mejoras visuales y scripts personalizados en caliente sin recargar los `<webview>` ni interrumpir el farmeo de las cuentas.

---

## Como rodar

Você precisa do Node.js instalado uma vez. Depois é rápido.

**1. Instale o Node.js**
Baixe a versão LTS em [nodejs.org](https://nodejs.org) e instale (é next, next, finish).

**2. Baixe este código**
Clique no botão verde **Code** aqui em cima e depois em **Download ZIP**. Extraia a pasta onde quiser. Quem usa Git pode clonar:

```bash
git clone https://github.com/soufoka/PokeGrid-source.git
```

**3. Abra o app**
No Windows, dê dois cliques no arquivo **Abrir PokeGrid** (`.bat`) dentro da pasta. Na primeira vez ele instala o necessário numa janela preta e abre o app; nas próximas a janela só pisca e o app abre na hora. Quer um atalho? Botão direito nele, **Enviar para: Área de trabalho (criar atalho)**.

Também dá pra usar o **iniciar.bat**, mas ele mantém uma janela preta aberta e, se ela for fechada, o app fecha junto.

No macOS ou Linux, abra o terminal na pasta e rode:

```bash
bash iniciar.sh
```

Pronto. Entre ou crie uma conta em cada painel e, em "Treinadores", salve o login. Da próxima vez ele entra sozinho.

## Documentação

| | |
|---|---|
| **[Manual](MANUAL.md)** | O que cada botão e cada seção faz, em linguagem simples |
| **[FAQ](FAQ.md)** | Dúvidas frequentes: atualizar sem perder nada, pokébola sumida, scripts, planilhas |
| **[Tutorial](TUTORIAL.md)** | Passo a passo pra rodar a versão sem instalador |
| **[Mudanças](CHANGELOG.md)** | O que entrou em cada versão |

## O que ele faz

- Rode de 1 a 4 contas, você escolhe quantos painéis abrir.
- Login automático, mesmo quando a sessão expira no meio do farm.
- Modo Eco que segura o uso de CPU sem atrapalhar o progresso.
- Esconde o chat e o menu de ícones do jogo pra sobrar tela.
- Avisa quando aparece shiny, uma conta cai, para de farmar ou fica sem suprimento, no Windows e no Discord.
- Liga e desliga cada painel, zoom, tela cheia e atalhos de teclado.
- Bandeja, iniciar junto com o Windows e idioma português, inglês ou espanhol.

## Segurança

- As senhas são criptografadas pelo `safeStorage` do Electron, que usa a API do sistema (DPAPI no Windows). Nunca saem do PC.
- Os painéis ficam presos ao domínio do jogo. Link externo abre no seu navegador, e a senha só é digitada na tela de login oficial.
- Câmera, microfone, localização e notificações do jogo ficam bloqueados.
- O captcha é sempre você que resolve. O app preenche e aperta Entrar quando você marca a caixinha, mas nunca toca no "Confirme que é humano". Burlar detecção de bot não é a proposta.

## Por dentro

Cada painel é um `<webview>` do Electron com partição própria (`persist:conta1` até `conta4`), e é isso que mantém as contas isoladas e logadas entre aberturas. O que o jogo não oferece, o app injeta em cada painel: o Eco troca o `requestAnimationFrame` por uma versão mais lenta, o login preenche pelo setter nativo do input, e o menu e o chat somem via CSS com um `MutationObserver`. Está tudo em `main.js`, `preload.js` e `index.html`, sem nada escondido.

## Licença

MIT. Projeto independente, sem ligação com o Poke Idle World.
