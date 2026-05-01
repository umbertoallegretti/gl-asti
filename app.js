// CONFIGURAZIONE PREZZI (Punto 8 e 9 delle tue richieste)
const PREZZI = {
    PS: {
        settimana: { 30: 6, 60: 10, 120: 18 },
        weekend: { 30: 7, 60: 12, 120: 20 }
    },
    SIM_VR: {
        settimana: { 30: 7, 60: 12, 120: 20 },
        weekend: { 30: 8, 60: 14, 120: 20 }
    }
};

// 1. SALVATAGGIO AUTOMATICO CREDENZIALI (Punto 1)
async function checkSession() {
    const { data: { session }, error } = await sb.auth.getSession();
    if (session) {
        user = session.user;
        await loadUserData();
        showSection('dashboard');
    }
}

// 2. CALCOLO PREZZI DINAMICO (Punto 2, 8, 9)
function calcolaPrezzoPrenotazione(tipoPostazione, durataMinuti) {
    const d = new Date();
    const isWeekend = (d.getDay() === 0 || d.getDay() === 6); // 0=Domenica, 6=Sabato
    const fascia = isWeekend ? 'weekend' : 'settimana';
    
    let categoria = 'PS';
    if (tipoPostazione.includes('Simulatore') || tipoPostazione.includes('VR')) {
        categoria = 'SIM_VR';
    }

    return PREZZI[categoria][fascia][durataMinuti] || 0;
}

// 3. LOGICA SEZIONE ADMIN SEPARATA (Punto 5)
function accessAdminSection() {
    // Controlla se l'utente ha il ruolo admin nei metadati di Supabase
    if (user && user.app_metadata.role === 'admin') {
        showSection('admin-panel');
    } else {
        showToast("Accesso negato: Area riservata agli Admin", "error");
    }
}

// 4. CLASSIFICA ORE DI GIOCO (Punto 4 e 7)
async function loadHoursLeaderboard(startDate, endDate) {
    // Questa funzione somma le ore dalle prenotazioni invece delle vittorie
    let query = sb.from('bookings')
        .select('profile_id, duration_minutes, profiles(username)')
        .eq('status', 'completed');

    if (startDate && endDate) {
        query = query.gte('created_at', startDate).lte('created_at', endDate);
    }

    const { data, error } = await query;
    // Logica di raggruppamento per utente...
}

// Inizializzazione al caricamento
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});
