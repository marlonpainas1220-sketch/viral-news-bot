const V5 = {
    news: [],
    lastUpdate: null,
    
    init() {
        this.sync();
        setInterval(() => this.autoHealCheck(), 300000); // Verifica o sinal a cada 5 minutos
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
        f.innerHTML = "<div class='loader' style='text-align:center; padding:50px; color:#AAA; font-size:12px;'>Loading fresh intel...</div>";
        
        let query = "celebridades+fofocas+noticias+pop+famosos";
        if(type === 'charts') query = "billboard+top+music+charts+global";
        if(type === 'trends') query = "twitter+trending+topics+brasil+celebridades";

        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${query}&hl=pt-BR`);
            const d = await r.json();
            
            if(d.status !== 'ok' || !d.items || d.items.length === 0) throw new Error('OFFLINE_OR_EMPTY');

            this.news = d.items;
            this.lastUpdate = Date.now();
            this.render(f, type);

        } catch (e) {
            console.error("Vitriniii Sync Error:", e);
            this.notifyAdminError(); // Alerta sonoro apenas para o admin
            f.innerHTML = "<div style='text-align:center; padding:50px; color:#F00; font-weight:700;'>Falha na rede. Tentando reconectar...</div>";
            setTimeout(() => this.sync(type), 10000); // Tenta novamente em 10 segundos
        }
    },

    render(container, type) {
        container.innerHTML = '';
        const cmd = JSON.parse(localStorage.getItem('v5_cmd') || '{}');

        this.news.slice(0, 15).forEach((item, idx) => { // Limita a 15 posts para manter a performance
            const cleanTitle = item.title.split(' - ')[0].trim(); // Remove a fonte do título para evitar plágio visual
            
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
                </div>
            `;
            
            // Injeção de Anunciante (desejo inconsciente de um produto/serviço)
            if(idx === 3 && cmd.marca) { // Anúncio após o 4º post
                container.innerHTML += `
                    <div class="post" style="background: var(--primary-gradient); color:#fff; text-align:center; padding:30px;">
                        <div class="post-tag" style="background:#fff; color:var(--text-dark);">EXCLUSIVE PARTNER</div>
                        <h2 class="post-title" style="color:#fff; margin-top:15px;">${cmd.marca}</h2>
                        <p style="color:rgba(255,255,255,0.8); font-size:14px; margin-top:10px;">"${cmd.frase}"</p>
                    </div>
                `;
            }
        });
    },

    autoHealCheck() {
        if(!this.lastUpdate || (Date.now() - this.lastUpdate > 600000)) { // 10 minutos
            console.warn("Vitriniii: Auto-cura ativada. Sincronizando novamente.");
            this.sync();
        }
    },

    notifyAdminError() {
        // Alerta sonoro de sistema (Beep discreto) - Apenas para o admin
        const audio = new Audio('data:audio/wav;base64,UklGRl9vWlFXQVZFQURhdWMPbC5BVyB2Mi40AAACiAAAACAAIQAAVf+4BwAAACgAAAAAgAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAABAAAAA'); // Beep simples
        audio.play().catch(e => console.log("Erro ao tocar áudio de alerta:", e));
        console.warn("ALERTA_VITRINIII: Sinal instável ou falha na rede. Verifique o dashboard.");
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v5_cmd') || '{}');
        const v = window.speechSynthesis;
        const m = new SpeechSynthesisUtterance();
        m.text = `Bem-vindos à Vitriniii Station, o epicentro do hype. ${cmd.frase || ''}. A notícia que domina as manchetes agora: ${this.news[0]?.title || 'Sintonizando as ondas do sucesso.'}`;
        m.lang = 'pt-BR';
        m.rate = 1.0; 
        m.pitch = 1.0; 
        v.speak(m);
    }
};
