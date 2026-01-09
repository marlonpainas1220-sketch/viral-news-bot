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
        const cmd = JSON.parse(localStorage.getItem('v3_comando'));
        
        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            // Se tiver Patrocinador no Admin, ele aparece no topo
            if(cmd && cmd.marca) {
                f.innerHTML += `<div class="card" style="border: 2px solid yellow; padding: 20px; background: #050505;">
                    <small style="color:yellow; font-weight:900;">OFERECIMENTO</small>
                    <h2 style="margin:5px 0;">${cmd.marca}</h2>
                    <p style="color:#666; margin:0;">${cmd.slogan}</p>
                </div>`;
            }

            d.items.slice(0, 10).forEach(i => {
                f.innerHTML += `<div class="card" onclick="window.open('${i.link}')"><img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800"><div style="padding:15px;"><h3>${i.title}</h3></div></div>`;
            });
        } catch (e) { f.innerHTML = "Erro de sinal."; }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_comando'));
        const v = window.speechSynthesis;
        v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO";

        let texto = "Sintonizado na Vitrin Três! ";
        if(cmd && cmd.marca) texto = `Este sinal é um oferecimento de ${cmd.marca}, ${cmd.slogan}. Agora, a manchete: `;
        
        m.text = texto + (this.news[0] ? this.news[0].title : "Aguardando sinal.");
        m.lang = 'pt-BR';
        m.rate = 1.1;
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        const cmd = JSON.parse(localStorage.getItem('v3_comando'));
        let txt = cmd && cmd.texto ? cmd.texto : "A Vitrin III filtra o ruído para você não se perder no hype.";
        c.innerHTML = `<div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;"><h2 style="color:yellow;">REDAÇÃO SOBERANA</h2><p style="color:#ccc; font-style:italic;">"${txt}"</p></div>`;
    }
};
