const supabaseUrl = 'https://lojcsjsnwyxggfylguei.supabase.co';
const supabaseKey = 'sb_publishable_2qD9UjedDM8O0kVYn6fY2w_pDgGoAND';
const sb = supabase.createClient(supabaseUrl, supabaseKey);

let selectedDate = new Date();
let selectedTime = null;
let currentCategory = null;
let prices = {}; // Verranno caricati dal DB

// INIZIALIZZAZIONE
async function init() {
    loadPrices();
    renderCalendar();
    checkAdminStatus();
}

// CARICA PREZZI DAL DB (Tabella config_prezzi)
async function loadPrices() {
    const { data } = await sb.from('config_prezzi').select('*');
    if (data) {
        data.forEach(p => { prices[p.key] = p.value; });
    }
}

// GENERA GRIGLIA ORARI (15:00 - 24:00)
function renderCalendar() {
    const grid = document.getElementById('time-grid');
    grid.innerHTML = '';
    document.getElementById('current-date-display').innerText = selectedDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' });

    for (let h = 15; h < 24; h++) {
        for (let m of ['00', '30']) {
            const time = `${h}:${m}`;
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.innerText = time;
            slot.onclick = () => openBooking(time);
            grid.appendChild(slot);
        }
    }
}

function openBooking(time) {
    selectedTime = time;
    document.getElementById('modal-time-title').innerText = `Prenota per le ${time}`;
    document.getElementById('booking-modal').style.display = 'block';
}

function selectCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('cat-' + cat).classList.add('active');
    
    // Aggiorna i prezzi nel popup in base alla categoria e al giorno (WE/Feriale)
    const isWE = [0, 6].includes(selectedDate.getDay());
    const prefix = `${cat}_${isWE ? 'we' : 'fe'}_`;
    
    document.getElementById('p-30').innerText = prices[prefix + '30'] || '--';
    document.getElementById('p-60').innerText = prices[prefix + '60'] || '--';
    document.getElementById('p-120').innerText = prices[prefix + '120'] || '--';
    
    document.getElementById('booking-details').style.display = 'block';
    loadGamesIntoSelect();
}

function changeDay(delta) {
    selectedDate.setDate(selectedDate.getDate() + delta);
    renderCalendar();
}

function closeModal() { document.getElementById('booking-modal').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', init);
