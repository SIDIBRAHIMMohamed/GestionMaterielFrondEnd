<!-- Layout.vue -->
<template>
    <div>
      <NavBar v-if="!isLoginPage" /> <!-- Affiche la NavBar si ce n'est pas la page de connexion -->
      <router-view v-if="!isLoginPage" /> <!-- Affiche le contenu dynamique de chaque page -->
    </div>
  </template>
  
  <script>
  import NavBar from './NavBar.vue';
  
  export default {
    components: {
      NavBar
    },
    computed: {
      isLoginPage() {
        // Vérifie si la route actuelle correspond à la page de connexion
        return this.$route.path === '/'; // Mettez ici le chemin de votre page de connexion
      }
    }
  };
  </script>
  