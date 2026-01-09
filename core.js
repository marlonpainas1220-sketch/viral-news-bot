const V3 = {
    news: [],
    init() { this.sync(); setInterval(() => this.sync(), 600000); }, // Sincroniza a cada 10 min

    tab(id, el) {
        document.querySelectorAll('.chip, .tab-icon').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('view-news').style.display = id !== 'station' ? 'block' : 'none';
        document.getElementById('view-station').style.display = id === 'station' ? 'block' : 'none';
        if(id !== 'news' && id !== 'station') this.sync(id);
    },

    async sync(type = 'news') {
        const f = document.getElementById('feed');
        f.innerHTML = "<div style='padding:100px; text-align:center; color:#333; font-size:10px; font-weight:900;'>COLLECTING_INTEL...</div>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        
        // Estratégia de busca multi-direcional
        let query = "celebridades+pop";
        if(type === 'charts') query = "music+charts+top+global";
        if(type === 'trends') query = "trending+topics+twitter+brasil";

        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${query}&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            if(cmd && cmd.marca) {
                f.innerHTML += `<div class="post" style="border:1px solid var(--pink); padding:20px;"><div class="post-tag">PARTNER</div><h2 class="post-title" style="color:var(--pink)">${cmd.marca}</h2><p style="color:#666; font-size:12px;">${cmd.frase}</p></div>`;
            }

            d.items.slice(0, 15).forEach((item, idx) => {
                // Re-escrita dinâmica (simulada via UI)
                const cleanTitle = item.title.split('-')[0].trim();
                f.innerHTML += `
                <div class="post" onclick="window.open('${item.link}')">
                    <div class="post-img-box">
                        <div class="post-tag">${type.toUpperCase()}</div>
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(item.thumbnail || item.enclosure.link)}&w=800&fit=cover" class="post-img" onerror="this.src='icon.png.JPG'">
                        <div class="post-gradient"></div>
                    </div>
                    <div class="post-content">
                        <div style="font-size:9px; color:var(--pink); font-weight:900; margin-bottom:10px;">V3_VERIFIED_SOURCE</div>
                        <h2 class="post-title">${cleanTitle}</h2>
                    </div>
                </div>`;
            });
        } catch (e) { setTimeout(() => this.sync(), 5000); }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        let intro = "Sinal Vitrin Três! Onde a fofoca é lei. ";
        if(cmd && cmd.marca) intro += `Suporte por ${cmd.marca}. `;
        m.text = intro + (this.news[0]?.title || "Sincronizando rede.");
        m.lang = 'pt-BR'; m.rate = 1.1; v.speak(m);
    }
};
