/**
 * LÓGICA INTERACTIVA - INVITACIÓN DE CUMPLEAÑOS 60 AÑOS (WHITE PARTY)
 */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initAudioPlayer();
    initRSVPForm();
    // loadSavedWebhookUrl(); // Comentado: Confirmación exclusiva por WhatsApp
    initCutoutLettersAnimation();
    initHeroVideo();
    initConfettiRain();
});

// ================= 0.0 LLUVIA DE CONFETI / PARTÍCULAS =================
function initConfettiRain() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Colores temática White Party (Blanco, Plata, Dorado, Champaña)
    const colors = [
        '#ffffff',
        '#f8fafc',
        '#ffd700',
        '#eab308',
        '#e4e4e7',
        '#cbd5e1',
        '#fde68a'
    ];

    const particleCount = window.innerWidth < 600 ? 55 : 95;
    const particles = [];

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height - height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star'),
            speedY: Math.random() * 1.8 + 0.7,
            speedX: Math.random() * 0.8 - 0.4,
            oscillation: Math.random() * 0.03,
            step: Math.random() * 100,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 3 - 1.5,
            opacity: Math.random() * 0.6 + 0.4
        };
    }

    for (let i = 0; i < particleCount; i++) {
        const p = createParticle();
        p.y = Math.random() * height; // Distribución inicial uniforme
        particles.push(p);
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.step += p.oscillation;
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.step) * 0.6;
            p.rotation += p.rotationSpeed;

            // Reciclar suavemente al salir por abajo
            if (p.y > height + 20) {
                p.y = -20;
                p.x = Math.random() * width;
            }
            if (p.x > width + 20) p.x = -20;
            if (p.x < -20) p.x = width + 20;

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);

            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === 'star') {
                drawStar(ctx, 0, 0, 4, p.size / 1.8, p.size / 4);
            }

            ctx.restore();
        });

        requestAnimationFrame(render);
    }

    render();
}

// ================= 0. VIDEO HERO =================
function initHeroVideo() {
    const videoContainer = document.getElementById('heroVideoContainer');
    const video = document.getElementById('heroVideo');
    const badge = document.getElementById('videoBadge');

    if (!videoContainer || !video) return;

    // Asegurar reproducción automática silenciada
    video.muted = true;
    video.play().catch(err => {
        console.warn('Autoplay del video hero prevenido por el navegador:', err);
    });

    // Permitir alternar pausar / reproducir al hacer clic en el contenedor del video
    videoContainer.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            if (badge) badge.innerHTML = '<i class="fa-solid fa-film"></i>';
        } else {
            video.pause();
            if (badge) badge.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    });
}

// ================= 0.1 ANIMACIÓN DE LETRAS TROQUELADAS =================
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
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');

    if (img) img.src = imgSrc;
    if (titleEl) titleEl.textContent = title || '';
    if (descEl) descEl.textContent = desc || '';

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


// ================= 6. FORMULARIO RSVP & WHATSAPP =================
// Número definitivo para recepción de confirmaciones por WhatsApp: +5493854094154
const WHATSAPP_NUMBER = "5493854094154";

function buildWhatsAppUrl(data) {
    let text = `¡Hola! Confirmo mi respuesta para la Fiesta de 60 Años (White Party) 🥂✨\n\n`;
    text += `👤 *Nombre:* ${data.nombre}\n`;
    text += `🎉 *Respuesta:* ${data.asistencia}\n`;

    if (data.asistencia.includes('Sí') || data.asistencia.toLowerCase().includes('allí')) {
        if (data.acompanantes) text += `👥 *Acompañantes:* ${data.acompanantes}\n`;
        if (data.dieta) text += `🍽️ *Menú Preferido:* ${data.dieta}\n`;
        if (data.cancion) text += `🎵 *Canción Pedida:* ${data.cancion}\n`;
    }

    if (data.mensaje) {
        text += `💬 *Mensaje:* "${data.mensaje}"\n`;
    }

    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
}

function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
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

        /* ==========================================================================
           REGISTRO GOOGLE SHEETS (Deshabilitado / Comentado para esta ocasión)
           ==========================================================================
        const webhookUrl = getWebhookUrl();
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(err => console.warn('Error enviando a Webhook:', err));
        }
        ========================================================================== */

        try {
            // Guardar en almacenamiento local
            localStorage.setItem('cumple60_rsvp_data', JSON.stringify(data));

            // Abrir WhatsApp con el mensaje pre-cargado
            const waUrl = buildWhatsAppUrl(data);
            window.open(waUrl, '_blank');

            setTimeout(() => {
                setBtnLoading(false);
                showSuccessState(data);
            }, 600);

        } catch (error) {
            console.error('Error procesando RSVP:', error);
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

    const waUrl = buildWhatsAppUrl(data);

    summaryBox.innerHTML = `
        <p><strong>Invitado/a:</strong> ${escapeHtml(data.nombre)}</p>
        <p><strong>Asistencia:</strong> ${escapeHtml(data.asistencia)}</p>
        ${(data.asistencia.includes('Sí') || data.asistencia.toLowerCase().includes('allí')) ? `
            <p><strong>Acompañantes:</strong> ${escapeHtml(data.acompanantes)}</p>
            <p><strong>Menú Preferido:</strong> ${escapeHtml(data.dieta)}</p>
            ${data.cancion ? `<p><strong>Canción Pedida:</strong> 🎵 ${escapeHtml(data.cancion)}</p>` : ''}
        ` : ''}
        ${data.mensaje ? `<p><strong>Mensaje:</strong> "${escapeHtml(data.mensaje)}"</p>` : ''}
        
        <div style="margin-top: 15px; text-align: center;">
            <a href="${waUrl}" target="_blank" class="scrapbook-btn" style="background-color: #25d366; color: #ffffff; text-decoration: none;">
                <i class="fa-brands fa-whatsapp"></i> Abrir WhatsApp nuevamente
            </a>
        </div>
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
