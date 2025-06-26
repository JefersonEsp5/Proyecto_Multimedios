<template>
  <div class="user-profile">
    <button @click="goToProfile">
      <svg class="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  methods: {
    goToProfile() {
      console.log('Navigating to user profile');
      // Aquí puedes usar Vue Router para navegar al perfil del usuario
      // Ejemplo con Vue Router: this.$router.push({ name: 'profile' });
    },
  },
};
</script>

<style scoped>
.user-profile {
  margin-left: 20px;   
}

.user-profile button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-icon {
  width: 28px;
  height: 28px;
  color: #6366f1; /* Color del icono de perfil */
  border: 2px solid #6366f1; /* Borde alrededor del icono */
  border-radius: 50%; /* Hacerlo circular */
  padding: 3px; /* Espacio entre el icono y el borde */
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .user-profile {
    margin-left: 0; /* Eliminar el margen en móvil */
    display: none;
  }

  .profile-icon {
    width: 32px;
    height: 32px;
  }
}
</style>