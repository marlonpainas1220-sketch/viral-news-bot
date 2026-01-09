const Soberano = {
    BRIDGE: "https://api.rss2json.com/v1/api.json?rss_url=",
    FEEDS: {
        HYPE: "https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR",
        SUBS: "https://alfinetei.com.br/feed",
        X: "https://news.google.com/rss/search?q=trending+topics+brasil&hl=pt-BR"
    },

    async carregar(tipo) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const btnId = tipo === 'HYPE' ? 'btn-hype' : (tipo === 'SUBS' ? 'btn-subs' : 'btn-trend');
        document.getElementById(btnId).classList.add('active');

        const feed = document.getElementById('feed');
        feed.innerHTML = `<div style="text-align:center; padding:100px 0; color:yellow; font-weight:900;">BUSCANDO SINAL...</div>`;
        
        try {
            const res = await fetch(this.BRIDGE + encodeURIComponent(this.FEEDS[tipo]));
            const data = await res.json();
            feed.innerHTML = '';

            const manual = JSON.parse(localStorage.getItem('noticia_manual'));
            if(manual && (Date.now() - manual.timestamp < 14400000)) this.render(feed, manual, true);

            data.items.slice(0, 15).forEach(item => {
                this.render(feed, {
                    titulo: item.title,
                    desc: item.description,
                    img: item.thumbnail || item.enclosure?.link,
                    link: item.link
                }, false);
            });
        } catch (e) { feed.innerHTML = '<div style="color:red; text-align:center; padding:50px;">ERRO DE SINCRO</div>'; }
    },

    render(target, data, oficial) {
        const desc = data.desc.replace(/<[^>]*>?/gm, '').substring(0, 130) + '...';
        let midia = data.img ? `<img src="https://images.weserv.nl/?url=${encodeURIComponent(data.img)}&w=800&fit=cover" class="card-media">` : '';
        
        if (data.img && (data.img.includes('tiktok.com') || data.img.includes('tiktok'))) {
            const vid = data.img.split('/').pop().split('?')[0];
            midia = `<div style="border-bottom:2px solid yellow; background:#000;"><blockquote class="tiktok-embed" data-video-id="${vid}"><section></section></blockquote></div>`;
        }

        target.innerHTML += `
            <div class="card" onclick="window.open('${data.link || '#'}', '_blank')">
                ${midia}
                <div class="card-info">
                    <div class="persona-badge" style="${oficial ? '' : 'filter:grayscale(1); opacity:0.3; border-color:#222;'}"></div>
                    <h3 style="margin:0 0 15px 0; font-size:22px; line-height:1.1; font-weight:900;">${data.titulo}</h3>
                    <p style="color:#666; font-size:14px; line-height:1.5; margin:0;">${desc}</p>
                    <div style="margin-top:20px; font-size:11px; font-weight:900; color:yellow;">
                        ${oficial ? 'SINAL VERIFICADO @VITRINIII' : 'SINAL DE RADAR'}
                    </div>
                </div>
            </div>`;
    }
};
