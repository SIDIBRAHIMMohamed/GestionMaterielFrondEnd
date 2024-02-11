<template>
  <fwb-navbar class="full-width-navbar" solid>
      <template #logo>
          <fwb-navbar-logo>
              Gestion Materiel
          </fwb-navbar-logo>
      </template>
      <template #default="{ isShowMenu }">
          <fwb-navbar-collapse :is-show-menu="isShowMenu">
              <template v-if="isAdmin">
                  <fwb-navbar-link :class="{ 'active': $route.path === '/admin' }" link="/admin">
                      Utilisateurs
                  </fwb-navbar-link>
              </template>
              <fwb-navbar-link :class="{ 'active': $route.path === '/users' }" link="/users">
                  Materiels
              </fwb-navbar-link>
              <fwb-navbar-link @click="logout" link="/">
                  Deconnexion
              </fwb-navbar-link>
          </fwb-navbar-collapse>
      </template>
  </fwb-navbar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {
  FwbNavbar,
  FwbNavbarCollapse,
  FwbNavbarLink,
  FwbNavbarLogo,
} from 'flowbite-vue';

const router = useRouter();

const isAdmin = parseInt(localStorage.getItem('userRole')) === 1;

const logout = () => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('UserId');
  localStorage.removeItem('userAuthenticated');
  router.push('/');
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.full-width-navbar {
  width: 100%;
}

/* Ajout du style pour le texte du bouton actif */
.active {
  color: white; /* Texte blanc */
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); /* Effet de brillance blanche */
  border-bottom: 2px solid white; /* Soulignement de la page courante */
}
</style>
