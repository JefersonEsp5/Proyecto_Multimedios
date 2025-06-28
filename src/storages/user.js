// src/stores/user.js
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import tursoClient from '../plugins/turso'; // <-- Esta es la importación directa (Opción 2)

export const useUserStore = defineStore('user', {
    state: () => ({
        userId: null,
    }),
    actions: {
        async initializeUser() {
            let id = localStorage.getItem('user_id');
            if (!id) {
                id = uuidv4();
                localStorage.setItem('user_id', id);
                console.log('DEBUG User Store: Nuevo usuario generado y guardado en localStorage:', id);
                await this.createUserInDb(id); // Llama a la acción para guardar en DB
            } else {
                console.log('DEBUG User Store: Usuario existente cargado de localStorage:', id);
            }
            this.userId = id;
        },
        async createUserInDb(id) {
            console.log('DEBUG User Store: Intentando guardar usuario', id, 'en Turso...');
            try {
                if (tursoClient) { // Verifica si el cliente importado no es null (si la conexión falló en plugins/turso.js)
                    console.log('DEBUG User Store: tursoClient está disponible. Ejecutando INSERT...');
                    await tursoClient.execute({
                        sql: "INSERT INTO users (id) VALUES (?)",
                        args: [id]
                    });
                    console.log(' Usuario', id, 'creado exitosamente en Turso.');
                } else {
                    console.error(' ERROR User Store: tursoClient es null/undefined. No se pudo guardar el usuario en DB.');
                }
            } catch (error) {
                if (error.message.includes("SQLITE_CONSTRAINT_PRIMARYKEY")) {
                    console.warn(' User Store: Usuario', id, 'ya existe en la base de datos Turso (clave primaria duplicada).');
                } else {
                    console.error(' ERROR User Store: Fallo al crear usuario', id, 'en Turso:', error.message);
                    console.error('Detalles del error:', error); // Loguea el objeto de error completo
                }
            }
        },
    },
});