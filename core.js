const Soberano = {
    news: [],
    init() { this.sync(); this.redigir(); },

    view(id, el) {
        document.querySelectorAll('.nav-link, .tab-icon').forEach(n => n.classList.remove('active'));
        el.classList.add('active');
        document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
        document.getElementById(`view-${id}`).style.display = 'block';
        window.scrollTo(0,0);
    },

    async sync() {
        const f = document.getElementById('view-feed');
        f.innerHTML = "<div style='padding:100px; text-align:center; font-size:10px; letter-spacing:4px; color:#444;'>COLLECTING INTELLIGENCE...</div>";
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        
        try {
            // Mix de Fofoca BR + Music Charts Global
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=celebridades+pop+culture+music+charts&hl=pt-BR`);
            const data = await res.json();
            this.news = data.items;
            f.innerHTML = '';

            if(cmd && cmd.marca) {
                f.innerHTML += `
                <div class="story-card" style="border: 0.5px solid #222; padding: 25px;">
                    <div class="story-meta">Oferecimento</div>
                    <div class="story-title" style="font-size:40px;">${cmd.marca}</div>
                    <div style="margin-top:15px; font-size:12px; color:var(--text-dim);">${cmd.frase}</div>
                </div>`;
            }

            data.items.slice(0, 15).forEach((item, index) => {
                const isBig = index % 4 === 0; // Alterna o layout das imagens automaticamente
                f.innerHTML += `
                <div class="story-card" onclick="window.open('${item.link}')">
                    <div class="story-img-wrap" style="height: ${isBig ? '550px' : '350px'}">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(item.thumbnail || item.enclosure.link)}&w=1000&fit=cover" onerror="this.parentElement.style.display='none'">
                    </div>
                    <div class="story-info">
                        <div class="story-meta">${item.pubDate} • Breaking</div>
                        <h2 class="story-title">${item.title}</h2>
                    </div>
                </div>`;
            });
        } catch (e) { setTimeout(() => this.sync(), 5000); }
    },

    play() {
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        const v = window.speechSynthesis; v.cancel();
        const m = new SpeechSynthesisUtterance();
        let intro = "Transmissão Soberana Vitriniii. ";
        if(cmd && cmd.marca) intro += `Patrocínio exclusivo por ${cmd.marca}. `;
        m.text = intro + (this.news[0]?.title || "Atualizando sinal global.");
        m.lang = 'pt-BR'; m.pitch = 0.8; // Voz mais grave e sofisticada
        v.speak(m);
    },

    redigir() {
        const c = document.getElementById('editorial-content');
        const cmd = JSON.parse(localStorage.getItem('v3_cmd'));
        c.innerText = cmd && cmd.op ? cmd.op : "A fofoca é o entretenimento dos deuses. Nós somos apenas os mensageiros.";
    }
};
