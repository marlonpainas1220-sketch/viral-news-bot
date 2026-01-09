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
        f.innerHTML = "<p style='color:yellow; text-align:center; padding:40px;'>CAPTURANDO SINAL...</p>";
        const cmd = JSON.parse(localStorage.getItem('vitrin_v3_cmd'));
        
        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            // Banner de Patrocínio Dinâmico
            if(cmd && cmd.marca) {
                f.innerHTML += `
                <div class="card" style="border: 2px solid yellow; padding: 20px; background: #080808; margin-bottom:20px;">
                    <div style="font-size:9px; font-weight:900; color:yellow; margin-bottom:5px;">OFERECIMENTO EXCLUSIVO</div>
                    <h2 style="margin:0; font-size:22px;">${cmd.marca}</h2>
                    <p style="color:#555; font-size:12px;">${cmd.frase}</p>
                </div>`;
            }

            d.items.slice(0, 10).forEach(i => {
                f.innerHTML += `
                <div class="card" onclick="window.open('${i.link}')">
                    <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover" onerror="this.src='icon.png.JPG'">
                    <div style="padding:15px;"><h3>${i.title}</h3></div>
                </div>`;
            });
        } catch (e) { f.innerHTML = "Sinal instável."; }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('vitrin_v3_cmd'));
        const v = window.speechSynthesis;
        v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO";

        let intro = "Sintonizado na Vitrin Três, o portal soberano. ";
        if(cmd && cmd.marca) {
            intro = `Este sinal chega até você com o apoio de ${cmd.marca}, ${cmd.frase}. Atenção para a manchete do minuto: `;
        }
        
        m.text = intro + (this.news[0] ? this.news[0].title : "Buscando novas notícias.");
        m.lang = 'pt-BR';
        m.rate = 1.05; 
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        const cmd = JSON.parse(localStorage.getItem('vitrin_v3_cmd'));
        let txt = cmd && cmd.op ? cmd.op : "A fofoca corre, mas a sensatez permanece. O sinal de hoje é focar no que é real.";
        
        c.innerHTML = `
        <div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
            <h2 style="color:yellow; font-size:18px;">REDAÇÃO SOBERANA</h2>
            <p style="color:#ccc; line-height:1.6; font-style:italic;">"${txt}"</p>
            <div style="margin-top:15px; font-size:10px; color:yellow; font-weight:900;">— PERSONA VITRIN III</div>
        </div>`;
    }
};
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
        f.innerHTML = "<p style='color:yellow; text-align:center;'>Buscando sinal...</p>";
        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';
            d.items.slice(0, 10).forEach(i => {
                f.innerHTML += `<div style="background:#0A0A0A; border:1px solid #1a1a1a; border-radius:15px; margin-bottom:15px; overflow:hidden;">
                    <img src="${i.thumbnail || 'icon.png.JPG'}" style="width:100%; height:200px; object-fit:cover;">
                    <div style="padding:15px;"><h3 style="margin:0; font-size:16px;" onclick="window.open('${i.link}')">${i.title}</h3></div>
                </div>`;
            });
        } catch (e) { f.innerHTML = "Erro de sinal."; }
    },
    play() {
        const cmd = JSON.parse(localStorage.getItem('vitrin_v3_cmd'));
        const v = window.speechSynthesis;
        v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO";
        let intro = "Vitrin Três no ar! ";
        if(cmd && cmd.marca) intro = `Oferecimento ${cmd.marca}, ${cmd.frase}. Manchete: `;
        m.text = intro + (this.news[0] ? this.news[0].title : "Sintonizando...");
        m.lang = 'pt-BR';
        v.speak(m);
    },
    redigir() {
        const c = document.getElementById('opinion-content');
        const cmd = JSON.parse(localStorage.getItem('vitrin_v3_cmd'));
        let txt = cmd && cmd.op ? cmd.op : "A fofoca corre, mas a sensatez permanece. Vitrin III filtra o ruído.";
        c.innerHTML = `<div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
            <h2 style="color:yellow; font-size:18px;">REDAÇÃO SOBERANA</h2>
            <p style="color:#ccc; font-style:italic;">"${txt}"</p>
        </div>`;
    }
};
