const Soberano = {
    news: [],
    init() { 
        this.sync(); 
        this.redigir();
        // Auto-Cura: Verifica o sinal a cada 5 minutos
        setInterval(() => { if(this.news.length === 0) this.sync(); }, 300000);
    },

    tab(name, el) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        if(el) el.classList.add('active');
        document.getElementById('view-news').style.display = name === 'news' ? 'block' : 'none';
        document.getElementById('view-radio').style.display = name === 'radio' ? 'block' : 'none';
        document.getElementById('view-opinion').style.display = name === 'opinion' ? 'block' : 'none';
    },

    async sync() {
        const f = document.getElementById('feed');
        f.innerHTML = "<p style='color:yellow; text-align:center; padding:50px;'>MODO AUTÔNOMO: ESCANEANDO SINAL...</p>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        
        try {
            // Rota de busca otimizada
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR&t=${Date.now()}`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            if(cmd && cmd.marca) {
                f.innerHTML += `<div class="card" style="border: 2px solid yellow; padding: 20px; background: #080808; margin-bottom:20px;">
                    <small style="color:yellow; font-weight:900;">PROPAGANDA ATIVA</small>
                    <h2 style="margin:0;">${cmd.marca}</h2>
                    <p style="color:#666;">${cmd.frase}</p>
                </div>`;
            }

            d.items.slice(0, 15).forEach(i => {
                f.innerHTML += `<div class="card" onclick="window.open('${i.link}')">
                    <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover" onerror="this.src='icon.png.JPG'">
                    <div style="padding:20px;"><h3>${i.title}</h3></div>
                </div>`;
            });
        } catch (e) { 
            f.innerHTML = "<p style='text-align:center;'>ERRO DETECTADO. INICIANDO AUTO-CURA...</p>";
            setTimeout(() => this.sync(), 5000);
        }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 LOCUTOR VITRINIII ON";

        let intro = "Sinal Soberano Vitrin Três! ";
        if(cmd && cmd.marca) intro = `Oferecimento ${cmd.marca}, ${cmd.frase}. Escuta essa bomba: `;
        
        m.text = intro + (this.news[0] ? this.news[0].title : "Aguardando sinal estável.");
        m.lang = 'pt-BR'; m.rate = 1.1;
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        let txt = cmd && cmd.op ? cmd.op : "A Persona Vitriniii está cuidando de tudo por aqui. Sente-se e aproveite o sinal filtrado.";
        c.innerHTML = `<div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
            <h2 style="color:yellow; font-size:22px;">REDAÇÃO VITRINIII</h2>
            <p style="color:#ccc; font-style:italic;">"${txt}"</p>
        </div>`;
    }
};
