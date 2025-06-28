// src/plugins/turso.js
import { createClient } from "@libsql/client";

const config = {
    url: import.meta.env.VITE_TURSO_DATABASE_URL,
    authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
};

// --- Añadimos más logs de verificación para el config ---
if (!config.url) {
    console.error("ERROR Turso: La URL de la base de datos es 'undefined'. Revisa VITE_TURSO_DATABASE_URL en tu .env.");
} else {
    console.log("Turso URL cargada:", config.url);
}

if (!config.authToken) {
    console.error("ERROR Turso: El token de autenticación es 'undefined'. Revisa VITE_TURSO_AUTH_TOKEN en tu .env.");
} else {
    console.log("Turso Auth Token cargado (parcialmente visible para seguridad):", config.authToken ? config.authToken.substring(0, 10) + '...' : 'N/A');
}

// Verifica si falta alguna configuración crítica antes de intentar crear el cliente
if (!config.url || !config.authToken) {
    console.error("ERROR CRÍTICO Turso: Faltan credenciales para conectar. Cliente Turso NO inicializado.");
}


// --- Crear el cliente Turso ---
const tursoClient = createClient(config);
console.log("Cliente Turso creado. Intentando verificar conexión..."); // Log de que el objeto cliente ha sido creado

// --- Función para verificar la conexión ---
async function verifyTursoConnection() {
    try {
        // Ejecuta una consulta simple que no modifica datos, solo para verificar la conexión
        const result = await tursoClient.execute("SELECT 1");
        if (result && result.rows.length > 0 && result.rows[0][0] === 1) {
            console.log("¡Conexión a Turso exitosa! Base de datos accesible.");
        } else {
            console.error("ERROR Turso: Conexión establecida, pero la consulta de prueba falló inesperadamente.");
        }
    } catch (error) {
        console.error("ERROR Turso: Falló la conexión a la base de datos o la consulta de prueba:", error);
        // Aquí puedes inspeccionar 'error' para ver la causa real (por ejemplo, errores de autenticación, red, etc.)
        if (error.message.includes('Auth token invalid') || error.message.includes('Unauthorized')) {
            console.error("Posiblemente el token de Turso es inválido o ha expirado.");
        }
        if (error.message.includes('URL_INVALID')) {
            console.error("La URL de Turso aún puede ser inválida.");
        }
    }
}

// Llama a la función de verificación de conexión.
// La ejecutamos inmediatamente (autoinvocada) para probarla al cargar el módulo.
verifyTursoConnection();


export default tursoClient; // Exporta el cliente para que pueda ser usado en otros lugares