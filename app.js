const supabaseUrl = 'TUA_URL';
const supabaseKey = 'TUA_KEY';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;
let selectedGame = null;

// 1. LOGIN AUTOMATICO
async function initApp() {
    const { data } = await sb.auth.getSession();
    if (data.session) {
        currentUser = data.session.user;
        checkAdmin();
        loadLeaderboard();
    } else {
        // Logica di redirect al login
    }
}

// 2. CALCOLO PREZZI DINAMICO (Weekend e Durata)
function getPrice(category, duration) {
    const day = new Date().getDay();
    const isWE = (day === 0 || day === 6); // 0=Domenica, 6=Sabato

    const rates = {
        ps: isWE ? {30:7, 60:12, 120:20} : {30:6, 60:10, 120:18},
        sim: isWE ? {30:8, 60:14, 120:20} : {30:7, 60:12, 120:20}
    };

    return rates[category][duration];
}

// 3. GESTIONE SEZIONI
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    document.getElementById('sec-' + id).style.display = 'block';
}

function checkAdmin() {
    if(currentUser.email === 'admin@glasti.it') { // Cambia con la tua mail
        document.getElementById('admin-link').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', initApp);
