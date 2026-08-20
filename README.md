# 🥂 Invitación Digital Interactiva - Cumpleaños de 60 Años (White Party)

Invitación digital interactiva con estética **Scrapbook / Vintage Paper Cutout** basada en el diseño de inspiración. Incluye confirmación de asistencia RSVP vinculada en tiempo real a una planilla de **Google Sheets**.

---

## 🌟 Características e Innovaciones de Alto Valor Agregado

1. **Diseño Scrapbook / White Party de Alto Impacto**:
   - Fondo de papel reciclado texturizado con bordes desgarrados.
   - Letras troqueladas estilo diario para el título **C U M P L E** y número **60** gigante en papel negro rasgado.
   - Polaroids inclinadas con cinta adhesiva (washi tape) realista.
   - Perlas tridimensionales, brillos plateados y garabatos dibujados a mano (moño, copa de champagne, bola disco).

2. **Integración RSVP con Google Sheets (Google Apps Script)**:
   - Formulario interactivo que recopila: Nombre, Asistencia (Sí/No), Acompañantes, Menú/Dieta (Vegetariano, Celíaco, etc.), Canción sugerida para la fiesta y Mensaje personal.
   - Guardado automático directo en una planilla de Google Sheets mediante webhook.

3. **Cuenta Regresiva Animada (Countdown)**:
   - Reloj dinámico estilo tarjetas de papel troquelado contando hacia el **31 de Octubre a las 22:00hs**.

4. **Galería "60 Años de Momentos" (Polaroids Interactivas)**:
   - Carrusel de fotos Polaroid que se activan con clic y abren un visor modal (lightbox) con historias y descripciones.

5. **Ubicación e Integración con Calendarios**:
   - Botón con enlace directo a **Google Maps** para la *Caja Complementaria de la UNSE*.
   - Botón para guardar en **Google Calendar** y botón para descargar archivo `.ics` (para iPhone/Apple Calendar/Outlook).

6. **Modales Interactivos**:
   - **Guía Dress Code: Total White**: Sugerencias de outfit para damas y caballeros, paleta de colores permitidos.
   - **Sobre de Regalo / CBU**: Modal desplegable con sobre vintage, Alias, CBU y botón de copiar al portapapeles con alerta animada.

7. **Reproductor de Música Temática**:
   - Botón flotante para reproducir u pausar el soundtrack de la fiesta con animación de ondas de sonido.

---

## 🛠️ Configuración de Google Sheets (Paso a Paso)

Para conectar las respuestas del formulario RSVP a tu propia planilla de Google Sheets:

1. Crea una nueva planilla en [Google Sheets](https://sheets.google.com).
2. Nómbrala por ejemplo: `RSVP Cumple 60 - White Party`.
3. Ve al menú superior: `Extensiones` -> `Apps Script`.
4. Borra cualquier código existente e inserta el contenido del archivo [`js/google-apps-script.js`](js/google-apps-script.js).
5. Haz clic en el ícono de **Guardar** (Disco).
6. Haz clic en **Desplegar** -> **Nuevo despliegue**.
7. En el ícono de engranaje (Tipo de despliegue), selecciona **Aplicación web**.
8. Configura los parámetros:
   - **Descripción**: `Servidor RSVP Cumple 60`
   - **Ejecutar como**: `Yo` (tu cuenta de Google)
   - **Quién tiene acceso**: `Cualquier persona` (*Anyone*) **<- Muy Importante**
9. Haz clic en **Desplegar** y concede los permisos requeridos.
10. Copia la **URL de la aplicación web** generada (empieza por `https://script.google.com/macros/s/.../exec`).
11. Pega esa URL dentro del formulario de la invitación (en el botón *"Configurar URL de Google Sheets"*) o actualiza la variable en `js/app.js`.

---

## 🚀 Ejecución Local

Puedes visualizar la invitación abriendo directamente el archivo `index.html` en tu navegador o ejecutando un servidor local HTTP:

```bash
# Opción usando Python
python -m http.server 8000

# Opción usando Node npx
npx serve .
```

Abre `http://localhost:8000` en tu navegador móvil o de escritorio.
