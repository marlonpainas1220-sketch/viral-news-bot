const V5 = {
    news: [],
    lastUpdate: null,
    
    init() {
        this.sync();
        setInterval(() => this.autoHealCheck(), 300000); 
    },

    tab(id, el) {
        document.querySelectorAll('.chip, .tab-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('view-news').style.display = id !== 'station' ? 'block' : 'none';
        document.getElementById('view-station').style.display = id === 'station' ? 'block' : 'none';
        this.sync(id);
    },

    async sync(type = 'news') {
        const f = document.getElementById('view-news');
        f.innerHTML = "<div style='text-align:center; padding:50px; color:#AAA; font-size:12px;'>Sincronizando sinal soberano...</div>";
        
        let query = "celebridades+fofocas+pop+famosos";
        if(type === 'charts') query = "billboard+top+music+charts+global";
        if(type === 'trends') query = "twitter+trending+topics+brasil+celebridades";

        try {
            // Using stable bridge to fix "Falha na rede"
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${query}&hl=pt-BR`);
            const d = await r.json();
            
            if(d.status !== 'ok') throw new Error('OFFLINE');

            this.news = d.items;
            this.lastUpdate = Date.now();
            this.render(f, type);
        } catch (e) {
            f.innerHTML = "<div style='text-align:center; padding:50px; color:#F00; font-weight:700;'>Falha na rede. Tentando reconectar...</div>";
            setTimeout(() => this.sync(type), 10000);
        }
    },

    render(container, type) {
        container.innerHTML = '';
        const cmd = JSON.parse(localStorage.getItem('v5_cmd') || '{}');

        this.news.slice(0, 15).forEach((item, idx) => {
            const cleanTitle = item.title.split(' - ')[0].trim();
            container.innerHTML += `
                <div class="post" onclick="window.open('${item.link}')">
                    <div class="post-img-box">
                        <div class="post-tag">${type.toUpperCase().replace('NEWS', 'RADAR')}</div>
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(item.thumbnail || item.enclosure.link)}&w=800&h=450&fit=cover" class="post-img" onerror="this.src='icon.png.JPG'">
                    </div>
                    <div class="post-content">
                        <h2 class="post-title">${cleanTitle}</h2>
                        <p class="post-source">Via Vitriniii v5 | ${new Date(item.pubDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>`;
        });
    },

    autoHealCheck() {
        if(!this.lastUpdate || (Date.now() - this.lastUpdate > 600000)) this.sync();
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v5_cmd') || '{}');
        const v = window.speechSynthesis;
        const m = new SpeechSynthesisUtterance();
        m.text = `Vitriniii Station no ar. ${cmd.frase || ''}. A notícia do momento: ${this.news[0]?.title}`;
        m.lang = 'pt-BR';
        v.speak(m);
    }
};
