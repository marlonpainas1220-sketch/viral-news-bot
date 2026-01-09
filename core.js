const Soberano = {
    carregar: async function(tipo) {
        const feed = document.getElementById('feed');
        feed.innerHTML = '<p style="text-align:center; color:yellow;">Sincronizando...</p>';
        const rss = {
            HYPE: "https://news.google.com/rss/search?q=fofoca+celebridades&hl=pt-BR",
            SUBS: "https://alfinetei.com.br/feed",
            X: "https://news.google.com/rss/search?q=trending+topics+brasil&hl=pt-BR"
        };
        try {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss[tipo])}`);
            const data = await res.json();
            feed.innerHTML = '';
            data.items.forEach(item => {
                const img = item.thumbnail || item.enclosure.link || "https://via.placeholder.com/400x200/000/FFFF00?text=VITRIN";
                feed.innerHTML += `
                    <div class="card" onclick="window.open('${item.link}')">
                        <img src="https://images.weserv.nl/?url=${encodeURIComponent(img)}&w=600">
                        <div style="padding:20px; position:relative;">
                            <div class="badge"></div>
                            <h3 style="margin:0; font-size:18px;">${item.title}</h3>
                        </div>
                    </div>`;
            });
        } catch (e) { feed.innerHTML = "Erro ao carregar sinal."; }
    }
};
