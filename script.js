// Configurações do seu projeto rwqowtbeetzwrljrpdmh
const SUPABASE_URL = "https://rwqowtbeetzwrljrpdmh.supabase.co";
const SUPABASE_KEY = "SUA_ANON_KEY_AQUI"; // Vamos já proteger isto no passo 2

async function carregarNoticias() {
    const feed = document.getElementById('feed');

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/noticias?select=*`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        const noticias = await response.json();

        if (noticias.error) throw noticias.error;

        // Inverte para mostrar as mais recentes primeiro
        feed.innerHTML = noticias.reverse().map(n => `
            <div class="card">
                <img src="${n.imagem || 'https://via.placeholder.com/600x400'}" alt="Foto">
                <div class="info">
                    <span class="badge">${n.categoria || 'FAMOSOS'}</span>
                    <h3>${n.titulo}</h3>
                    <small>Fonte: ${n.fonte || 'Viral News'}</small>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Erro de Blindagem:", error);
        feed.innerHTML = "<p>O feed está em manutenção. Voltamos já!</p>";
    }
}

carregarNoticias();
