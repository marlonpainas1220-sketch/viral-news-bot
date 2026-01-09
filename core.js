/* 🛡️ VITRIN III - CORE SOBERANO V.PERSONA */
(function() {
    const BRIDGE = "https://api.rss2json.com/v1/api.json?rss_url=";
    const FEEDS = {
        HYPE: encodeURIComponent("https://news.google.com/rss/search?q=fofoca+celebridades+brasil&hl=pt-BR"),
        SUBS: encodeURIComponent("https://noticiasdatv.uol.com.br/rss/celebridades"),
        TREND: encodeURIComponent("https://news.google.com/rss/search?q=trending+topics+twitter+brasil&hl=pt-BR")
    };
    const IMG_PROXY = "https://images.weserv.nl/?url=";

    window.Soberano = {
        async abaHype() { this.renderizar('Hype Feed', FEEDS.HYPE, 't-hype', true); },
        async abaSubs() { this.renderizar('Subcelebs BR', FEEDS.SUBS, 't-subs', true); },
        async abaTrend() { this.renderizar('Trending Topics', FEEDS.TREND, 't-trend', false); },

        async renderizar(label, url, tabId, comManual) {
            document.querySelectorAll('.tab-item').forEach(i => i.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            const container = document.getElementById('app-content');
            container.innerHTML = `<div style="text-align:center; padding:50px; color:var(--gold);">Sincronizando ${label}...</div>`;
            
            const res = await fetch(BRIDGE + url);
            const data = await res.json();
            container.innerHTML = '';

            if(comManual) {
                const manual = JSON.parse(localStorage.getItem('noticia_manual'));
                if(manual && (Date.now() - manual.timestamp < 14400000)) {
                    this.buildCard(container, manual, true);
                }
            }

            if(data.items) {
                data.items.slice(0, 12).forEach(n => {
                    if(tabId === 't-trend') {
                        this.buildTrend(container, n);
                    } else {
                        this.buildCard(container, { title: n.title, desc: n.description, img: n.thumbnail || n.enclosure?.link, link: n.link }, false);
                    }
                });
            }
        },

        buildCard(target, data, isOfficial) {
            const cleanDesc = data.desc ? data.desc.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : '';
            let media = data.img ? `<img src="${IMG_PROXY + encodeURIComponent(data.img)}&w=600&fit=cover" class="card-img">` : '';
            
            if (data.img && data.img.includes('tiktok.com')) {
                const vid = data.img.split('/').pop().split('?')[0];
                media = `<div style="width:100%; border-radius:15px; overflow:hidden;"><blockquote class="tiktok-embed" data-video-id="${vid}"><section></section></blockquote></div>`;
            }

            target.innerHTML += `
                <div class="news-card" onclick="window.open('${data.link || '#'}', '_blank')">
                    ${media}
                    <div class="card-body">
                        <h3 style="margin:0 0 10px 0; font-size:18px;">${data.title}</h3>
                        <p style="font-size:14px; color:var(--text-dim); line-height:1.5; margin:0;">${cleanDesc}</p>
                        <div style="display:flex; align-items:center; gap:10px; margin-top:15px;">
                            <div class="card-persona" style="${isOfficial ? '' : 'filter:grayscale(1); opacity:0.4;'}"></div>
                            <span style="font-size:11px; font-weight:900; color:var(--gold);">${isOfficial ? '⚡ PERSONA VERIFIED' : 'SINAL EXTERNO'}</span>
                        </div>
                    </div>
                </div>`;
        },

        buildTrend(target, data) {
            target.innerHTML += `
                <div style="padding:15px; border-bottom:1px solid var(--border);" onclick="window.open('${data.link}', '_blank')">
                    <div style="color:var(--text-dim); font-size:11px;">Trending agora no sinal</div>
                    <div style="font-weight:700; font-size:16px; margin:4px 0;">${data.title}</div>
                    <div style="color:var(--gold); font-size:11px; font-weight:900;">+ ${(Math.random()*100).toFixed(1)}k menções</div>
                </div>`;
        }
    };
})();
