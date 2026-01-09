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
        f.innerHTML = "<p style='color:yellow; text-align:center; padding:50px;'>SINCRONIZANDO SINAL...</p>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';
            if(cmd && cmd.marca) {
                f.innerHTML += `<div style="background:#080808; border:2px solid yellow; border-radius:15px; padding:15px; margin-bottom:15px;"><small style="color:yellow">PATROCÍNIO</small><h2 style="margin:0;">${cmd.marca}</h2><p style="color:#666; margin:0;">${cmd.frase}</p></div>`;
            }
            d.items.slice(0, 12).forEach(i => {
                f.innerHTML += `<div style="background:#0A0A0A; border:1px solid #1a1a1a; border-radius:15px; margin-bottom:15px; overflow:hidden;">
                    <img src="${i.thumbnail || 'icon.png.JPG'}" style="width:100%; height:200px; object-fit:cover;">
                    <div style="padding:15px;"><h3 style="margin:0; font-size:16px;" onclick="window.open('${i.link}')">${i.title}</h3></div>
                </div>`;
            });
        } catch (e) { f.innerHTML = "<p style='text-align:center; color:red;'>ERRO DE SINAL. RECARREGUE.</p>"; }
    },
    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        document.getElementById('radio-status').innerText = "📻 AO VIVO";
        let msg = "Vitrin Três no ar! ";
        if(cmd && cmd.marca) msg = `Oferecimento ${cmd.marca}, ${cmd.frase}. Manchete: `;
        m.text = msg + (this.news[0]?.title || "Aguardando sinal");
        m.lang = 'pt-BR'; v.speak(m);
    },
    redigir() {
        const c = document.getElementById('opinion-content');
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        let txt = cmd && cmd.op ? cmd.op : "A Vitrin III filtra o ruído para você não se perder no hype.";
        c.innerHTML = `<div style="background:#111; padding:25px; border-radius:20px; border-left:4px solid yellow;">
            <h2 style="color:yellow; font-size:20px;">REDAÇÃO SOBERANA</h2>
            <p style="color:#ccc; font-style:italic;">"${txt}"</p>
        </div>`;
    }
};
