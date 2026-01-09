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
        f.innerHTML = "<p style='color:yellow; text-align:center; padding:50px;'>CAPTURANDO SINAL...</p>";
        try {
            // Bridge RSS estável
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';
            d.items.slice(0, 15).forEach(i => {
                f.innerHTML += `
                    <div class="card" onclick="window.open('${i.link}')">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover" onerror="this.src='icon.png.JPG'">
                        <div style="padding:20px; position:relative;">
                            <div class="persona-badge" style="background-image: url('icon.png.JPG')"></div>
                            <h3 style="margin:0; font-size:19px; line-height:1.2; font-weight:900;">${i.title}</h3>
                        </div>
                    </div>`;
            });
        } catch (e) { f.innerHTML = "<p style='text-align:center; color:red;'>SINAL INSTÁVEL. RECARREGUE.</p>"; }
    },

    play() {
        if (!this.news.length) return;
        const v = window.speechSynthesis;
        v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO: LOCUTOR VITRIN";
        m.text = `Sinal Vitrin Três no ar! A bomba agora é: ${this.news[0].title}. Fique no sinal soberano!`;
        m.lang = 'pt-BR';
        m.rate = 1.1;
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        const temas = ["o vício em likes", "a ostentação vazia", "o fim da privacidade"];
        const t = temas[Math.floor(Math.random() * temas.length)];
        c.innerHTML = `
            <div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
                <h2 style="color:yellow; font-size:18px; font-weight:900;">COLUNA SOVEREIGN</h2>
                <p style="color:#ccc; line-height:1.6; font-style:italic;">"O sinal de hoje mostra que ${t} atingiu o limite. Na Vitrin III, a gente não apenas posta, a gente analisa. Menos hype, mais verdade."</p>
                <div style="margin-top:20px; color:yellow; font-weight:900;">— Editor-Chefe Vitrin III</div>
            </div>`;
    }
};
