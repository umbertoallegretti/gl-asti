const supabaseUrl = 'https://lojcsjsnwyxggfylguei.supabase.co';
const supabaseKey = 'sb_publishable_2qD9UjedDM8O0kVYn6fY2w_pDgGoAND';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// Funzione per mostrare le sezioni
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById('sec-' + id);
    if (target) target.style.display = 'block';
}

// PASSO 1: CONTROLLO SESSIONE AUTOMATICA
async function checkUserSession() {
    const { data: { session }, error } = await sb.auth.getSession();

    if (session) {
        currentUser = session.user;
        console.log("Accesso eseguito come:", currentUser.email);
        
        // Se è l'admin, mostra il tasto admin
        if (currentUser.email === 'sk1zz8@hotmail.it') { // Sostituisci con la tua mail admin
            document.getElementById('admin-link').style.display = 'block';
        }

        showSection('booking'); // Vai subito alla prenotazione
    } else {
        console.log("Nessun utente loggato");
        document.getElementById('login-welcome').innerHTML = '<h1>Esegui il login</h1><p>Usa la pagina di accesso per continuare.</p>';
    }
}

// Avvio applicazione
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
});

// Funzioni placeholder per i prossimi passi
function openGamePopup() { alert("Prossimamente: Scelta del gioco!"); }
