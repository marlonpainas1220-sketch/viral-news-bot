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
        f.innerHTML = "<p style='color:yellow; text-align:center; padding:50px;'>BUSCANDO SINAL...</p>";
        try {
            // Usando RSS2JSON para evitar erros de conexão (CORS)
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';
            d.items.slice(0, 15).forEach(i => {
                f.innerHTML += `
                    <div class="card" onclick="window.open('${i.link}')">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover">
                        <div style="padding:20px; position:relative;">
                            <div class="persona-badge"></div>
                            <h3 style="margin:0; font-size:18px; line-height:1.2; font-weight:900;">${i.title}</h3>
                        </div>
                    </div>`;
            });
        } catch (e) { f.innerHTML = "Sinal instável. Tente novamente."; }
    },

    play() {
        if (!this.news.length) return;
        const v = window.speechSynthesis;
        v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO: RÁDIO VITRIN";
        m.text = `Sinal Vitrin Três no ar! A fofoca do momento é: ${this.news[0].title}. Fique no sinal!`;
        m.lang = 'pt-BR';
        m.rate = 1.1;
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        c.innerHTML = `
            <div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
                <h2 style="color:yellow; font-size:20px;">COLUNA SOBERANA</h2>
                <p style="color:#ccc; line-height:1.6; font-style:italic;">"O sinal de hoje não mente: o hype vazio está cobrando seu preço. Na Vitrin III, a gente filtra o ruído para entregar a real. Sensatez é o novo luxo digital."</p>
                <div style="margin-top:20px; color:yellow; font-weight:900;">— Editor Vitrin III</div>
            </div>`;
    }
};
