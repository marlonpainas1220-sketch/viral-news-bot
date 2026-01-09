const Soberano = {
    BRIDGE: "https://api.rss2json.com/v1/api.json?rss_url=",
    FEEDS: {
        HYPE: "https://news.google.com/rss/search?q=celebridades+famosos+brasil&hl=pt-BR",
        SUBS: "https://alfinetei.com.br/feed",
        X: "https://news.google.com/rss/search?q=trending+topics+brasil&hl=pt-BR"
    },

    async carregar(tipo) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const btnId = tipo === 'HYPE' ? 'btn-hype' : (tipo === 'SUBS' ? 'btn-subs' : 'btn-trend');
        document.getElementById(btnId).classList.add('active');

        const feed = document.getElementById('feed');
        feed.innerHTML = `<div style="text-align:center; padding:100px 0; color:yellow; font-weight:900; letter-spacing:2px;">SINCRO DE SINAL...</div>`;
        
        try {
            const res = await fetch(this.BRIDGE + encodeURIComponent(this.FEEDS[tipo]));
            const data = await res.json();
            feed.innerHTML = '';

            const manual = JSON.parse(localStorage.getItem('noticia_manual'));
            if(manual && (Date.now() - manual.timestamp < 14400000)) this.render(feed, manual, true);

            data.items.slice(0, 15).forEach((item, index) => {
                this.render(feed, {
                    titulo: item.title,
                    desc: item.description,
                    img: item.thumbnail || item.enclosure?.link,
                    link: item.link
                }, false);
                
                // Insere Ad entre notícias a cada 3 cards
                if((index + 1) % 3 === 0) {
                    feed.innerHTML += `<div class="ads-container">PUBLICIDADE</div>`;
                }
            });
        } catch (e) { feed.innerHTML = '<div style="color:red; text-align:center; padding:50px;">ERRO DE CONEXÃO</div>'; }
    },

    render(target, data, oficial) {
        const desc = data.desc.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
        // Fallback de imagem caso venha vazia
        let imagemUrl = data.img ? `https://images.weserv.nl/?url=${encodeURIComponent(data.img)}&w=800&fit=cover` : 'https://via.placeholder.com/800x400/111/FFFF00?text=SINAL+VITRIN';
        
        let midia = `<img src="${imagemUrl}" class="card-media" onerror="this.src='https://via.placeholder.com/800x400/111/FFFF00?text=VITRIN+SDR'">`;
        
        if (data.img && (data.img.includes('tiktok.com') || data.img.includes('tiktok'))) {
            const vid = data.img.split('/').pop().split('?')[0];
            midia = `<div style="background:#000;"><blockquote class="tiktok-embed" data-video-id="${vid}"><section></section></blockquote></div>`;
        }

        target.innerHTML += `
            <div class="card" onclick="window.open('${data.link || '#'}', '_blank')">
                ${midia}
                <div class="card-info">
                    <div class="persona-badge" style="${oficial ? '' : 'filter:grayscale(1); opacity:0.3; border-color:#222;'}"></div>
                    <h3 class="manchete">${data.titulo}</h3>
                    <p class="teaser">${desc}</p>
                    <div style="margin-top:15px; font-size:11px; font-weight:900; color:yellow; letter-spacing:2px;">
                        ${oficial ? 'SINAL OFICIAL @VITRINIII' : 'SINAL DE RADAR'}
                    </div>
                </div>
            </div>`;
    }
};
