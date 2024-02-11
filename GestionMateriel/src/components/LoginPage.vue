<template>
  <div class="login-container">
    <div class="login-form">
      <h3>Login</h3>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email</label>
          <input type="text" class="form-control" v-model="email" placeholder="Entrez votre email">
        </div>

        

        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="password" placeholder="Entrez votre mot de passe">
        </div>

        <!-- Affichage du message d'erreur -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>

    <!-- Affichage de l'état de chargement -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errorMessage: '' // Ajout de la variable errorMessage pour afficher les erreurs
    };
  },
  methods: {
    login() {
      this.loading = true; // Indiquer que la connexion est en cours
      UserService.login({ email: this.email, password: this.password })
        .then(response => {
          console.log('Connexion réussie:', response.data);
          localStorage.setItem('userRole', parseInt(response.data.role, 10));
          localStorage.setItem('UserId', parseInt(response.data.id));
          localStorage.setItem('userAuthenticated', true);
          console.log("userRole", localStorage.getItem('userRole'));
          console.log("userId", localStorage.getItem('UserId'));
          if (response.data.role === 1) {
            this.$router.push('/admin');
          } else {
            this.$router.push('/users');
          }
        })
        .catch(error => {
          console.error('Erreur de connexion:', error);
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            this.errorMessage = error.response.data; // Afficher le message d'erreur provenant de la réponse
          } else {
            this.errorMessage = "Email ou mot de passe incorrecte"; // Message d'erreur générique
          }
        })
        .finally(() => {
          this.loading = false; // Réinitialiser l'état de chargement après la connexion
        });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h3 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Ajout d'un style pour l'état de chargement */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
