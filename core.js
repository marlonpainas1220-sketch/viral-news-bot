const Soberano = {
    news: [],
    init() { this.sync(); this.redigir(); },

    tab(name, el) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        if(el) el.classList.add('active');
        document.getElementById('view-news').style.display = name === 'news' ? 'block' : 'none';
        document.getElementById('view-radio').style.display = name === 'radio' ? 'block' : 'none';
        document.getElementById('view-opinion').style.display = name === 'opinion' ? 'block' : 'none';
    },

    async sync() {
        const f = document.getElementById('feed');
        f.innerHTML = "<p style='color:yellow; text-align:center; padding:50px;'>SINCRONIZANDO SINAL...</p>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        
        try {
            // Túnel RSS2JSON para evitar erros de conexão
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            // Injeta o Patrocinador se existir no Dashboard
            if(cmd && cmd.marca) {
                f.innerHTML += `<div class="card" style="border: 2px solid yellow; padding: 20px; background: #080808; margin-bottom:20px;">
                    <small style="color:yellow; font-weight:900;">OFFERED BY</small>
                    <h2 style="margin:0; font-size:24px;">${cmd.marca}</h2>
                    <p style="color:#666; margin:0; font-size:12px;">${cmd.frase}</p>
                </div>`;
            }

            d.items.slice(0, 15).forEach(i => {
                f.innerHTML += `
                    <div class="card" onclick="window.open('${i.link}')">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover" onerror="this.src='icon.png.JPG'">
                        <div style="padding:20px;">
                            <h3 style="margin:0; font-size:18px; line-height:1.2; font-weight:900;">${i.title}</h3>
                        </div>
                    </div>`;
            });
        } catch (e) { f.innerHTML = "<p style='text-align:center;'>ERRO DE CONEXÃO.</p>"; }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO";

        let fala = "Vitrin Três no ar! O sinal soberano. ";
        if(cmd && cmd.marca) fala = `Este sinal chega a você por ${cmd.marca}, ${cmd.frase}. Atenção para a manchete: `;
        
        m.text = fala + (this.news[0] ? this.news[0].title : "Buscando notícias.");
        m.lang = 'pt-BR'; m.rate = 1.1;
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('opinion-content');
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        let txt = cmd && cmd.op ? cmd.op : "A fofoca corre, mas a sensatez permanece. O sinal de hoje é focar no que é real.";
        c.innerHTML = `<div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
            <h2 style="color:yellow; font-size:20px; font-weight:900;">COLUNA SOBERANA</h2>
            <p style="color:#ccc; line-height:1.6; font-style:italic;">"${txt}"</p>
            <div style="margin-top:20px; color:yellow; font-weight:900;">— EDITOR VITRIN III</div>
        </div>`;
    }
};
