const Soberano = {
    news: [],
    init() { this.sync(); this.redigir(); setInterval(() => this.autoHeal(), 300000); },

    tab(id, el) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        ['v-feed', 'v-radio', 'v-op'].forEach(v => document.getElementById(v).style.display = 'none');
        document.getElementById(`v-${id}`).style.display = 'block';
    },

    async sync() {
        const f = document.getElementById('v-feed');
        f.innerHTML = "<div style='color:var(--neon); font-size:10px; text-align:center; padding:100px;'>DECRYPTING_SIGNAL...</div>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        
        try {
            const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=celebrities+music+charts+fofoca&hl=pt-BR`);
            const d = await r.json();
            this.news = d.items;
            f.innerHTML = '';

            if(cmd && cmd.marca) {
                f.innerHTML += `<div class="v-card" style="border: 2px solid var(--neon);"><div class="v-tag">PARTNER</div><div class="v-content"><h2 class="v-title">${cmd.marca}</h2><p style="color:#666">${cmd.frase}</p></div></div>`;
            }

            d.items.slice(0, 15).forEach(i => {
                f.innerHTML += `
                <div class="v-card" onclick="window.open('${i.link}')">
                    <div class="v-tag">TOP_TRENDING</div>
                    <img src="https://images.weserv.nl/?url=${encodeURIComponent(i.thumbnail || i.enclosure.link)}&w=800&fit=cover" onerror="this.src='icon.png.JPG'">
                    <div class="v-content">
                        <h2 class="v-title">${i.title}</h2>
                        <p style="color:var(--neon); font-size:9px; margin-top:15px; font-weight:900;">READ_FULL_TRANSCRIPTION_></p>
                    </div>
                </div>`;
            });
        } catch (e) { this.autoHeal(); }
    },

    autoHeal() { if(this.news.length === 0) this.sync(); },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        let fala = `Transmissão Vitriniii ativada. `;
        if(cmd && cmd.marca) fala += `Suporte por ${cmd.marca}. `;
        m.text = fala + (this.news[0]?.title || "Sintonizando rede global.");
        m.lang = 'pt-BR'; m.rate = 1.1; v.speak(m);
    },

    redigir() {
        const c = document.getElementById('v-op');
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        let txt = cmd && cmd.op ? cmd.op : "A fofoca é a nova economia. Vitriniii é o banco central.";
        c.innerHTML = `<div style="border-left:2px solid var(--neon); padding-left:20px;"><h2 style="color:var(--neon); font-size:30px;">THE_CORE</h2><p style="color:#888; line-height:1.6; font-style:italic;">"${txt}"</p><p style="color:var(--neon); font-size:10px; margin-top:40px;">// SYSTEM_AUTONOMOUS_MODE_ON</p></div>`;
    }
};
