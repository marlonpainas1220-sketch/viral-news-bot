const Vitrin = {
    news: [],
    init() { this.sync(); },

    tab(id, el) {
        document.querySelectorAll('.chip, .tab-btn').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('view-news').style.display = id === 'news' ? 'block' : 'none';
        document.getElementById('view-station').style.display = id === 'station' ? 'block' : 'none';
    },

    async sync() {
        const f = document.getElementById('feed');
        f.innerHTML = "<p style='text-align:center; padding:50px; color:#444;'>SINCRONIZANDO ALGORITMO...</p>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));

        try {
            // Busca autônoma global
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=famosos+pop+trends&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            // Propaganda Dinâmica
            if(cmd && cmd.marca) {
                f.innerHTML += `<div class="post" style="border: 2px solid var(--pink); padding:20px;"><div class="post-tag">OFERECIMENTO</div><h2 class="post-title" style="color:var(--pink)">${cmd.marca}</h2><p style="color:#888; font-size:12px;">${cmd.frase}</p></div>`;
            }

            d.items.slice(0, 15).forEach(i => {
                f.innerHTML += `
                <div class="post" onclick="window.open('${i.link}')">
                    <div class="post-tag">TRENDING NOW</div>
                    <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover" class="post-img" onerror="this.src='icon.png.JPG'">
                    <div class="post-info">
                        <h2 class="post-title">${i.title}</h2>
                        <div style="margin-top:10px; color:#444; font-size:10px;">${i.pubDate}</div>
                    </div>
                </div>`;
            });
        } catch (e) { setTimeout(() => this.sync(), 5000); }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        let intro = "Sinal Vitrin Três! A fofoca que você não vive sem. ";
        if(cmd && cmd.marca) intro += `Patrocínio: ${cmd.marca}. `;
        m.text = intro + (this.news[0]?.title || "Sintonizando radar.");
        m.lang = 'pt-BR'; m.rate = 1.1; v.speak(m);
    }
};
