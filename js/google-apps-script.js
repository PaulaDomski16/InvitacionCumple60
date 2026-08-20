/**
 * ==============================================================================
 * CÓDIGO DE GOOGLE APPS SCRIPT PARA TU GOOGLE SHEETS
 * ==============================================================================
 * 
 * Instrucciones de Instalación:
 * 
 * 1. Abre tu Google Sheet donde quieras recibir las respuestas.
 * 2. En el menú superior, ve a "Extensiones" -> "Apps Script".
 * 3. Borra todo el código que aparezca y pega exactamente este script.
 * 4. Haz clic en el botón "Guardar" (icono de disco).
 * 5. Haz clic en "Desplegar" -> "Nuevo despliegue".
 * 6. En "Seleccionar tipo", elige "Aplicación web".
 * 7. Configura los permisos:
 *    - Descripción: RSVP Cumple 60
 *    - Ejecutar como: "Yo" (tu cuenta de correo)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone) -> ¡IMPORTANTE!
 * 8. Haz clic en "Desplegar", autoriza los permisos si te los pide.
 * 9. Copia la "URL de la aplicación web" (empieza con https://script.google.com/macros/s/.../exec).
 * 10. Pega esa URL en el campo de configuración de tu invitación digital o en tu app.js.
 */

function doPost(e) {
  try {
    // Abrir la planilla activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la planilla está vacía, agregar encabezados automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha / Hora", 
        "Nombre y Apellido", 
        "Asistencia", 
        "Acompañantes", 
        "Menú / Dieta Especial", 
        "Canción Pedida 🎵", 
        "Mensaje / Deseo"
      ]);
      
      // Dar formato a los encabezados
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#181818");
      headerRange.setFontColor("#FFFFFF");
    }

    // Obtener los datos JSON enviados por el formulario
    var data = JSON.parse(e.postData.contents);

    // Agregar la fila con la respuesta del invitado
    sheet.appendRow([
      new Date(),
      data.nombre || "",
      data.asistencia || "",
      data.acompanantes || "0",
      data.dieta || "Ninguna",
      data.cancion || "",
      data.mensaje || ""
    ]);

    // Responder al cliente HTTP con éxito
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "RSVP guardado correctamente en Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servidor de RSVP activo y listo para recibir confirmaciones.");
}
