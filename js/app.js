/**
 * LÓGICA INTERACTIVA - INVITACIÓN DE CUMPLEAÑOS 60 AÑOS (WHITE PARTY)
 */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initAudioPlayer();
    initRSVPForm();
    loadSavedWebhookUrl();
    initCutoutLettersAnimation();
});

// ================= 0. ANIMACIÓN DE LETRAS TROQUELADAS =================
function initCutoutLettersAnimation() {
    const lettersContainer = document.querySelector('.cutout-letters-container');
    if (!lettersContainer) return;

    lettersContainer.title = "¡Haz clic para ver volar las letras nuevamente!";

    lettersContainer.addEventListener('click', () => {
        const tiles = lettersContainer.querySelectorAll('.cutout-tile');
        tiles.forEach(tile => {
            tile.style.animation = 'none';
            tile.offsetHeight; // Trigger reflow
            tile.style.animation = '';
        });
    });
}

// ================= 1. CUENTA REGRESIVA =================
function initCountdown() {
    // Fecha objetivo: 31 de Octubre de 2026, 22:00:00
    const targetDate = new Date('2026-10-31T22:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}


// ================= 2. REPRODUCTOR DE AUDIO =================
function initAudioPlayer() {
    const audioBtn = document.getElementById('audioBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (!audioBtn || !bgMusic) return;

    audioBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioBtn.classList.add('playing');
            }).catch(err => {
                console.warn('Auto-play preventing:', err);
            });
        } else {
            bgMusic.pause();
            audioBtn.classList.remove('playing');
        }
    });
}


// ================= 3. MODALES & LIGHTBOX =================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openLightbox(imgSrc, title, desc) {
    document.getElementById('lightboxImg').src = imgSrc;
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightboxDesc').textContent = desc;
    openModal('lightboxModal');
}


// ================= 4. COPIAR CBU / ALIAS =================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copyToast');
        if (toast) {
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2500);
        }
    }).catch(err => {
        alert('Copiado: ' + text);
    });
}


// ================= 5. DESCARGAR CALENDARIO (.ICS) =================
function downloadICS() {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Invitacion Cumple 60//White Party//ES',
        'BEGIN:VEVENT',
        'SUMMARY:Cumpleaños 60 Años - White Party 🥂',
        'DESCRIPTION:Celebremos juntos los 60 años. Dress code: TOTAL WHITE.',
        'LOCATION:Caja Complementaria de la UNSE\\, Santiago del Estero\\, Argentina',
        'DTSTART:20261031T220000Z',
        'DTEND:20261101T050000Z',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'cumple_60_white_party.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// ================= 6. FORMULARIO RSVP & GOOGLE SHEETS =================
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const successCard = document.getElementById('rsvpSuccessCard');
    const summaryBox = document.getElementById('rsvpSummaryBox');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    // Verificar si ya envió previamente
    const savedRSVP = localStorage.getItem('cumple60_rsvp_data');
    if (savedRSVP) {
        showSuccessState(JSON.parse(savedRSVP));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            asistencia: formData.get('asistencia'),
            acompanantes: formData.get('acompanantes'),
            dieta: formData.get('dieta'),
            cancion: formData.get('cancion'),
            mensaje: formData.get('mensaje'),
            timestamp: new Date().toLocaleString()
        };

        // UI Loading
        setBtnLoading(true);

        // Obtener URL de Webhook configurada
        const webhookUrl = getWebhookUrl();

        try {
            if (webhookUrl) {
                // Intentar enviar a Google Sheets vía Apps Script
                await fetch(webhookUrl, {
                    method: 'POST',
                    mode: 'no-cors', // Evita bloqueo CORS en Google Apps Script
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            // Guardar localmente
            localStorage.setItem('cumple60_rsvp_data', JSON.stringify(data));

            setTimeout(() => {
                setBtnLoading(false);
                showSuccessState(data);
            }, 1000);

        } catch (error) {
            console.error('Error al enviar RSVP:', error);
            // Guardar localmente de todos modos
            localStorage.setItem('cumple60_rsvp_data', JSON.stringify(data));
            setBtnLoading(false);
            showSuccessState(data);
        }
    });
}

function setBtnLoading(isLoading) {
    const btnText = document.querySelector('.btn-text');
    const btnSpinner = document.querySelector('.btn-spinner');
    const submitBtn = document.getElementById('submitBtn');

    if (isLoading) {
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function showSuccessState(data) {
    const form = document.getElementById('rsvpForm');
    const successCard = document.getElementById('rsvpSuccessCard');
    const summaryBox = document.getElementById('rsvpSummaryBox');

    form.classList.add('hidden');
    successCard.classList.remove('hidden');

    summaryBox.innerHTML = `
        <p><strong>Invitado/a:</strong> ${escapeHtml(data.nombre)}</p>
        <p><strong>Asistencia:</strong> ${escapeHtml(data.asistencia)}</p>
        ${data.asistencia.includes('Sí') ? `
            <p><strong>Acompañantes:</strong> ${escapeHtml(data.acompanantes)}</p>
            <p><strong>Menú Preferido:</strong> ${escapeHtml(data.dieta)}</p>
            ${data.cancion ? `<p><strong>Canción Pedida:</strong> 🎵 ${escapeHtml(data.cancion)}</p>` : ''}
        ` : ''}
        ${data.mensaje ? `<p><strong>Mensaje:</strong> "${escapeHtml(data.mensaje)}"</p>` : ''}
    `;
}

function resetRsvpForm() {
    localStorage.removeItem('cumple60_rsvp_data');
    document.getElementById('rsvpSuccessCard').classList.add('hidden');
    document.getElementById('rsvpForm').classList.remove('hidden');
}

// Configuración de Webhook Google Sheets
function toggleWebhookConfig() {
    const box = document.getElementById('webhookConfigBox');
    box.classList.toggle('hidden');
}

function getWebhookUrl() {
    const customUrl = localStorage.getItem('cumple60_webhook_url');
    if (customUrl) return customUrl;
    
    const inputUrl = document.getElementById('webhookUrl').value;
    return inputUrl.trim();
}

function loadSavedWebhookUrl() {
    const savedUrl = localStorage.getItem('cumple60_webhook_url');
    const inputUrl = document.getElementById('webhookUrl');
    const apiStatusBanner = document.getElementById('apiStatusBanner');

    if (savedUrl && inputUrl) {
        inputUrl.value = savedUrl;
    }

    if (inputUrl) {
        inputUrl.addEventListener('change', () => {
            const val = inputUrl.value.trim();
            if (val) {
                localStorage.setItem('cumple60_webhook_url', val);
                if (apiStatusBanner) {
                    apiStatusBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> URL de Google Sheets guardada`;
                }
            } else {
                localStorage.removeItem('cumple60_webhook_url');
            }
        });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
