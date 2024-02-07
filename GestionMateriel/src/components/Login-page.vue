<template>
    <div>
      <div>
        <h3>Login</h3>
      </div>
      
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email</label>
          <input type="text" class="form-control" v-model="email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="password">
        </div>
  
        <div class="my-3">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  </template>


<script>
import UserService from '@/services/UserService';

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    };
  },
  methods: {
    login() {
      UserService.login({ email: this.email, password: this.password })
        .then(response => {
          // Gérer la réponse du backend
          console.log('Connexion réussie:', response.data);
          // Stockez les informations d'authentification dans le stockage local
          localStorage.setItem('userRole', parseInt(response.data.role, 10));

          // Rediriger l'utilisateur en fonction de son rôle
          if (response.data.role === 1) {
            // Si l'utilisateur est administrateur, redirigez-le vers la liste des utilisateurs
            this.$router.push('/admin');
          } else {
            // Rediriger l'utilisateur vers une autre page selon son rôle
            this.$router.push('/user');
          }
        })
        .catch(error => {
          console.error('Erreur de connexion:', error);
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
          }
          // Affichez un message d'erreur à l'utilisateur
          this.$message.error('Échec de la connexion. Veuillez réessayer.');
        });
    }
  }
};
</script>
