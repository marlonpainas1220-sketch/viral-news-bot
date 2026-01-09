const Soberano = {
    newsData: [],
    init() { this.carregar('HYPE'); this.gerarRedacao(); },

    showTab(tab) {
        document.getElementById('news-tab').style.display = tab === 'news' ? 'block' : 'none';
        document.getElementById('radio-tab').style.display = tab === 'radio' ? 'block' : 'none';
        document.getElementById('opinion-tab').style.display = tab === 'opinion' ? 'block' : 'none';
        if(tab === 'radio') document.getElementById('radio-station').style.display = 'block';
    },

    async carregar(tipo) {
        const feed = document.getElementById('feed');
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=celebridades+brasil&hl=pt-BR`);
            const data = await res.json();
            this.newsData = data.items;
            feed.innerHTML = '';
            data.items.slice(0, 10).forEach(item => {
                feed.innerHTML += `
                    <div class="card" onclick="window.open('${item.link}')">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(item.thumbnail || item.enclosure.link)}&w=600">
                        <div style="padding:15px;"><h3 style="margin:0; font-size:17px;">${item.title}</h3></div>
                    </div>`;
            });
        } catch (e) { feed.innerHTML = "Erro ao conectar."; }
    },

    playRadio() {
        const msg = new SpeechSynthesisUtterance();
        const news = this.newsData[0].title;
        document.getElementById('radio-status').innerText = "📻 LOCUTOR AO VIVO";
        
        msg.text = `Atenção Brasil! Aqui é o locutor da Vitrin Três, trazendo o sinal da fofoca em tempo real. A bomba do momento é: ${news}. Fique ligado, porque a gente não dorme pra você não perder nada!`;
        msg.lang = 'pt-BR';
        msg.rate = 1.1; // Velocidade de locutor
        window.speechSynthesis.speak(msg);
    },

    gerarRedacao() {
        const opinion = document.getElementById('editorial-content');
        const temas = ["o cancelamento excessivo nas redes", "a ostentação dos influencers", "a vida editada do Instagram"];
        const tema = temas[Math.floor(Math.random() * temas.length)];
        
        opinion.innerHTML = `
            <div class="editorial-card">
                <div class="editorial-title">OPINIÃO SENSATA: ${tema.toUpperCase()}</div>
                <p class="editorial-text">"Vivemos em uma era onde a verdade vale menos que um like. Acompanhando os sinais de hoje, percebo que ${tema} está saindo do controle. Precisamos de mais pé no chão e menos filtro. A Vitriniii está de olho."</p>
                <small style="color:var(--yellow)">— Editor-Chefe Vitrin III</small>
            </div>`;
    }
};
