<template>
  <div class="login-container">
    <div class="login-form">
      <h3>Connexion</h3>
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
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { createApp, ref } from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import ApiService from '../services/ApiService';

const app = createApp({});
app.use(VueSweetalert2);

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
      this.loading = true;
      UserService.login({ email: this.email, password: this.password })
        .then(response => {
          if (response.data.haslogiIn === false) {
            Swal.fire({
              title: 'changer le mot de passe',
              html:
                `<input id="swal-input1" type="password" class="swal2-input" placeholder="Nouveau mot de passe">` +
                `<input id="swal-input2" type="password" class="swal2-input" placeholder="Confirmez le mot de passe">`,
              focusConfirm: false,
              showCancelButton: true,
              preConfirm: () => {
                return [
                  document.getElementById('swal-input1').value,
                  document.getElementById('swal-input2').value
                ]
              }
            }).then(result => {
              if (result.value) {
                const newPassword = result.value[0];
                const confirmPassword = result.value[1];

                if (newPassword !== confirmPassword) {
                  Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
                } else {
                  ApiService.postRessource('/api/change-password', {
                    email: this.email,
                    password: newPassword
                  }).then(response => {
                    Swal.fire('Succès', 'Mot de passe mis à jour avec succès', 'success');
                  }).catch(error => {
                    Swal.fire('Erreur', 'Erreur lors de la mise à jour du mot de passe', 'error');
                  });
                }
              }
            });
          } else {
            localStorage.setItem('userRole', parseInt(response.data.role, 10));
            localStorage.setItem('UserId', parseInt(response.data.id));
            localStorage.setItem('userAuthenticated', true);
            if (response.data.role === 1) {
              this.$router.push('/admin');
            } else {
              this.$router.push('/users');
            }
          }
        })
        .catch(error => {
          console.error('Erreur de connexion:', error);
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            this.errorMessage = error.response.data; 
          } else {
            this.errorMessage = "Email ou mot de passe incorrecte"; 
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
