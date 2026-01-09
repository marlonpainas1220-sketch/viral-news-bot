const Soberano = {
    news: [],
    init() { this.sync(); this.redigir(); },

    tab(name, el) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('view-news').style.display = name === 'news' ? 'block' : 'none';
        document.getElementById('view-radio').style.display = name === 'radio' ? 'block' : 'none';
        document.getElementById('view-opinion').style.display = name === 'opinion' ? 'block' : 'none';
    },

    async sync() {
        const f = document.getElementById('feed');
        f.innerHTML = "<p style='color:var(--yellow); text-align:center;'>Sincronizando sinal...</p>";
        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';
            d.items.slice(0, 10).forEach(i => {
                f.innerHTML += `
                    <div class="card" onclick="window.open('${i.link}')">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=600&fit=cover">
                        <div style="padding:15px;"><h3 style="margin:0; font-size:18px;">${i.title}</h3></div>
                    </div>`;
            });
        } catch (e) { f.innerHTML = "Erro de conexão."; }
    },

    play() {
        if (!this.news.length) return;
        const v = window.speechSynthesis;
        v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 LOCUTOR AO VIVO";
        m.text = `Você está ouvindo a Rádio Vitrin Três, o sinal soberano da fofoca. A manchete de agora é: ${this.news[0].title}. Fique no sinal, porque aqui a gente não dorme!`;
        m.lang = 'pt-BR';
        m.pitch = 1; m.rate = 1.1;
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        const temas = ["o vício em validação digital", "a fragilidade das carreiras baseadas em hype", "o fim da privacidade nas redes"];
        const t = temas[Math.floor(Math.random() * temas.length)];
        c.innerHTML = `
            <div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid var(--yellow);">
                <h2 style="color:var(--yellow); font-size:20px; text-transform:uppercase;">Coluna Sovereign</h2>
                <p style="color:#ccc; line-height:1.6; font-style:italic;">"Observando os dados de hoje, fica claro que ${t} atingiu um ponto sem volta. O jovem moderno está trocando a paz pela timeline, e a Vitrin III está aqui para avisar: o sinal está ficando ruidoso. Sensatez é o novo luxo."</p>
                <div style="margin-top:20px; color:var(--yellow); font-weight:900;">— Editor-Chefe Vitrin III</div>
            </div>`;
    }
};

// Blindagem Anti-DevTools básica
setInterval(() => { debugger; }, 1000);
