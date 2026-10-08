/* Maquete, encerramento e caverna: camada visual separada da UI base. */
(function(){
 const originalRenderGame=UI.renderGame.bind(UI);
 const esc=UI.escape.bind(UI);
 function visible(flag){return flag?'':'is-hidden'}
 function cityMarkup(){
  const c=gameState.cityStructure;
  return `<section class="city-board" aria-label="Maquete da República em construção">
   <div class="city-board-head"><span>MAQUETE DA CIDADE</span><span>${gameState.completedPhases.length} / 6 etapas</span></div>
   <svg class="city-map" viewBox="0 0 900 260" role="img" aria-label="Cidade em evolução: terreno, casas, produção, guardiões, governo e educação">
    <defs><linearGradient id="earth" x2="0" y2="1"><stop stop-color="#967343"/><stop offset="1" stop-color="#51442d"/></linearGradient><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#253e4a"/><stop offset="1" stop-color="#182b35"/></linearGradient></defs>
    <path d="M0 0h900v260H0z" fill="url(#sea)"/><path d="M0 170Q200 130 420 162T900 151v109H0z" fill="url(#earth)"/>
    <path d="M60 194Q300 175 500 194T850 184" fill="none" stroke="#c1a16c" stroke-width="3" opacity=".5"/>
    <g class="${visible(c.producers)} city-piece production"><path d="M90 168l80-38 54 13-77 43z" fill="#647044"/><path d="M145 171v-38m19 33v-42m19 37v-42" stroke="#d2ba79" stroke-width="3"/><path d="M76 208h94v-37h-94z" fill="#8b6544" stroke="#d8bf89"/><path d="M71 172l52-32 52 32z" fill="#b48750"/><path d="M106 207v-17h18v17" fill="#342a20"/></g>
    <g class="${visible(c.houses)} city-piece houses"><path d="M282 178v-42l39-26 39 26v42z" fill="#c8b58e"/><path d="M273 138l48-34 48 34" fill="none" stroke="#795d3b" stroke-width="8"/><path d="M311 178v-25h19v25" fill="#64503a"/><path d="M367 188v-34l31-21 31 21v34z" fill="#bda77d"/><path d="M361 157l37-29 37 29" fill="none" stroke="#795d3b" stroke-width="7"/></g>
    <g class="${visible(c.population)} city-piece people" fill="#ead7a7"><circle cx="252" cy="170" r="7"/><path d="M248 178h8l6 24h-5l-5-15-5 15h-5z"/><circle cx="443" cy="177" r="7"/><path d="M439 185h8l5 23h-5l-4-14-4 14h-5z"/></g>
    <g class="${visible(c.guardians)} city-piece guardians"><path d="M70 187v-42m-9 13h18m-18 29 9-14 9 14" stroke="#d5bd83" stroke-width="5"/><path d="M800 183v-42m-9 13h18m-18 29 9-14 9 14" stroke="#d5bd83" stroke-width="5"/><path d="M35 204V176l35-24 35 24v28m690 0v-28l35-24 35 24v28" fill="none" stroke="#ad9160" stroke-width="4"/></g>
    <g class="${visible(c.government)} city-piece government"><path d="M501 143l91-48 91 48z" fill="#d4c295" stroke="#e6d9b9" stroke-width="3"/><path d="M515 148h155v7H515z" fill="#aa8c56"/><path d="M527 153v42m28-42v42m28-42v42m28-42v42m28-42v42m28-42v42" stroke="#e4d5b0" stroke-width="10"/><path d="M512 197h134v10H512z" fill="#a88a52"/></g>
    <g class="${visible(c.education)} city-piece education"><path d="M736 163q24-18 48 0v38q-24-18-48 0z" fill="#dfc982" stroke="#6b5634" stroke-width="3"/><path d="M784 163q24-18 48 0v38q-24-18-48 0z" fill="#f1e3b9" stroke="#6b5634" stroke-width="3"/><path d="M784 164v37" stroke="#856c42" stroke-width="2"/></g>
    <g class="${visible(c.crisis)} city-piece crisis"><path d="M456 115l9 18 20 3-15 13 4 20-18-10-18 10 4-20-15-13 20-3z" fill="#a95e48" stroke="#e0b276" stroke-width="2"/></g>
   </svg><div class="city-legend"><span><i class="legend-dot"></i> A cidade muda a cada decisão</span><span>Terreno · moradores · ofícios · proteção · governo · educação</span></div>
  </section>`;
 }
 function resultClass(){
  const a=gameState.attributes, choices=gameState.choices;
  if((a.resources>68&&a.justice<48)||choices.some(c=>c.optionId==='profit'||c.optionId==='wealthy'))return 'República Dominada pelos Interesses';
  if(a.justice>=67&&a.wisdom>=62&&a.temperance>=55&&a.stability>=50)return 'República Harmônica';
  if(a.wisdom>=65)return 'República em Busca de Sabedoria';
  return 'República em Desequilíbrio';
 }
 function resultScreen(){
  const strongest=Object.entries(gameState.attributes).sort((a,b)=>b[1]-a[1])[0][0], weakest=Object.entries(gameState.attributes).sort((a,b)=>a[1]-b[1])[0][0];
  const important=gameState.choices;
  const rating=resultClass();
  this.root.innerHTML=`<header class="topline"><span class="brand">A República · ${GAME_DATA.cityName}</span><button class="icon-btn" id="audio-toggle">◖ Áudio ${AudioController.enabled?'ligado':'desligado'}</button></header><div class="game-layout">${this.renderHud()}<section class="main-panel screen"><div class="phase-meta">Construção encerrada</div><h2>República concluída</h2><p class="intro-copy">A cidade está completa. Suas decisões deixaram marcas nos espaços e no equilíbrio da República.</p>${cityMarkup()}<div class="result-banner"><span class="eyebrow">Classificação da cidade</span><strong>${esc(rating)}</strong></div><div class="result-grid"><section><h3>Estado final</h3><div class="final-stats">${GAME_DATA.attributes.map(x=>`<span><b>${esc(x.label)}</b><strong>${gameState.attributes[x.id]}</strong></span>`).join('')}</div></section><section><h3>Decisões marcantes</h3><ul class="decision-summary">${important.length?important.map(c=>`<li><b>${esc(c.phaseTitle)}:</b> ${esc(c.optionLabel)}</li>`).join(''):'<li>As escolhas iniciais organizaram a cidade em torno de cooperação e proteção.</li>'}</ul><p class="philosophy-note">Seu maior atributo foi ${esc(ATTRIBUTE_LABELS[strongest].toLowerCase())}; o ponto mais frágil foi ${esc(ATTRIBUTE_LABELS[weakest].toLowerCase())}. Para Platão, a justiça da cidade depende da relação entre suas partes, e a formação de quem governa orienta o conjunto. Esta classificação resume o modelo do jogo; não elimina os dilemas das escolhas.</p></section></div><div class="panel-actions"><button class="btn secondary" id="restart">Reiniciar</button><button class="btn" id="continue-cave">Prosseguir à Caverna →</button></div></section></div>`;
  this.root.querySelector('#continue-cave').onclick=()=>{AudioController.play('advance');GameEngine.advance();this.render()};
  this.root.querySelector('#restart').onclick=()=>{GameEngine.start();this.render()};
  this.root.querySelector('#audio-toggle').onclick=()=>{AudioController.toggle();this.render()};
 }
 function caveScreen(){
  this.root.innerHTML=`<header class="topline"><span class="brand">A República · Livro VII</span><button class="icon-btn" id="audio-toggle">◖ Áudio ${AudioController.enabled?'ligado':'desligado'}</button></header><div class="game-layout cave-layout">${this.renderHud()}<section class="main-panel screen cave-screen"><div class="phase-meta">Etapa final · Aparência e conhecimento</div><h2>A Alegoria da Caverna</h2><p class="intro-copy">Na imagem apresentada por Platão no Livro VII de A República, prisioneiros tomam sombras por realidade. A educação é uma virada gradual do olhar — e quem sai da caverna tem a responsabilidade de retornar e dialogar.</p><div class="cave-art" role="img" aria-label="Uma caverna escura, sombras na parede e uma saída iluminada"><div class="cave-wall"></div><div class="shadow-figures"><i></i><i></i><i></i></div><div class="prisoner"></div><div class="cave-path"></div><div class="cave-light"></div><span class="cave-label label-shadows">APARÊNCIA</span><span class="cave-label label-light">CONHECIMENTO</span></div><p class="cave-question">Conhecer mais torna alguém automaticamente capaz de governar com justiça?</p><div class="choice-list cave-options"><button class="choice" data-reflection="sim"><span class="choice-key">1</span><span class="choice-label">Sim — o conhecimento orienta decisões melhores.</span><span class="choice-arrow">›</span></button><button class="choice" data-reflection="nao"><span class="choice-key">2</span><span class="choice-label">Não — saber não garante caráter ou responsabilidade.</span><span class="choice-arrow">›</span></button><button class="choice" data-reflection="depende"><span class="choice-key">3</span><span class="choice-label">Depende — conhecimento precisa de formação ética e diálogo.</span><span class="choice-arrow">›</span></button></div><div id="reflection" aria-live="polite"></div><div class="panel-actions"><button class="btn secondary" id="restart">Reiniciar jornada</button></div></section></div>`;
  this.root.querySelectorAll('[data-reflection]').forEach(btn=>btn.onclick=()=>{const messages={sim:'A saída da caverna sugere que conhecer muda o modo de julgar — mas a cidade também precisa confiar e examinar quem governa.',nao:'Uma pessoa pode conhecer e ainda usar o saber para benefício próprio. A alegoria também aponta para educação e responsabilidade.',depende:'Uma resposta que mantém aberta a tensão entre conhecimento, caráter e vida comum. O que significa voltar à caverna?'};this.root.querySelector('#reflection').innerHTML=`<div class="consequence"><div class="eyebrow">Reflexão da turma</div><p>${messages[btn.dataset.reflection]}</p><p class="discussion">Fim da jornada · ${esc(resultClass())}</p></div>`;this.announce(messages[btn.dataset.reflection])});
  this.root.querySelector('#restart').onclick=()=>{GameEngine.start();this.render()};
  this.root.querySelector('#audio-toggle').onclick=()=>{AudioController.toggle();this.render()};
 }
 UI.renderGame=function(phase){
  if(phase.type==='result'){resultScreen.call(this);return}
  if(phase.type==='cave'){caveScreen.call(this);return}
  originalRenderGame(phase);
  const panel=this.root.querySelector('.main-panel');
  if(panel){panel.querySelector('.phase-meta')?.insertAdjacentHTML('afterend',cityMarkup());if(gameState.pendingOutcome){for(const [key,delta] of Object.entries(gameState.pendingOutcome.changes)){const label=ATTRIBUTE_LABELS[key];const meter=panel.parentElement.querySelector(`[aria-label="${label}"]`);meter?.closest('.stat')?.classList.add(delta>0?'changed-up':'changed-down')}}}
 };
})();
