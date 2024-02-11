<template>
  <div class="ajouter">
    <button @click="showAddUserDialog = true" class="btn btn-add">Ajouter un utilisateur</button>
  </div>
  <div class="user-page"> 
    <div class="user-lists">
      <table class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.nom }}</td>
            <td>{{ user.prenom }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role === 1 ? 'Administrateur' : 'Utilisateur' }}</td>
            <td>
              <button @click="showUserDetails(user)" class="btn btn-details">Détails</button>
              <button @click="editUser(user)" class="btn btn-modify">Modifier</button>
              <button @click="resetPassword(user.email)" class="btn btn-reset">Réinitialiser</button>
              <button @click="confirmDeleteUser(user.id)" class="btn btn-delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAddUserDialog" class="dialog">
    <div class="dialog-content">
        <h3 v-if="editMode">Modifier un utilisateur</h3>
        <h3 v-else>Ajouter un utilisateur</h3>
        <form @submit.prevent="editMode ? updateUser() : addUser()" class="form">
            <div>
                <label>Nom:</label>
                <input type="text" v-if="editMode" v-model="editedUser.nom" required>
                <input type="text" v-else v-model="newUser.nom" required>
            </div>
            <div>
                <label>Prénom:</label>
                <input type="text" v-if="editMode" v-model="editedUser.prenom" required>
                <input type="text" v-else v-model="newUser.prenom" required>
            </div>
            <div>
                <label>Email:</label>
                <input type="email" v-if="editMode" v-model="editedUser.email" required>
                <input type="email" v-else v-model="newUser.email" required>
            </div>
            <div>
                <label>Mot de passe:</label>
                <input type="password" v-if="editMode" v-model="editedUser.password" required>
                <input type="password" v-else v-model="newUser.password" required>
            </div>
            <div>
                <label>Rôle:</label>
                <select v-if="editMode" v-model="editedUser.role" required>
                  <option value="0">Utilisateur</option>
                  <option value="1">Administrateur</option>
                </select>
                <select v-else v-model="newUser.role" required>
                  <option value="0">Utilisateur</option>
                  <option value="1">Administrateur</option>
                </select>
            </div>


            <button type="submit">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
            <button @click="closeDialog">{{ editMode ? 'Annuler' : 'Fermer' }}</button>
        </form>
    </div>
</div>

    <div v-if="showUserDetailsDialog" class="dialog">
      <div class="dialog-content">
        <h3>Détails de l'utilisateur</h3>
        <p><strong>Nom:</strong> {{ userDetails.nom }}</p>
        <p><strong>Prénom:</strong> {{ userDetails.prenom }}</p>
        <p><strong>Email:</strong> {{ userDetails.email }}</p>
        <p><strong>Rôle:</strong> {{ userDetails.role === 1 ? 'Administrateur' : 'Utilisateur' }}</p>
        <!-- Autres détails à afficher -->
        <button @click="closeUserDetailsDialog">Fermer</button>
      </div>
    </div>

    <!-- Fenêtre modale de confirmation de suppression -->
    <div v-if="showDeleteConfirmation" class="modal">
  <div class="modal-content">
    <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
    <button @click="deleteUserConfirmed" class="confirm-button">Confirmer</button>
    <button @click="showDeleteConfirmation = false" class="cancel-button">Annuler</button>
  </div>
</div>

    <div class="pagination">
      <button @click="loadPreviousPage" :disabled="currentPage === 1" class="btn btn-pagination">Page précédente</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="loadNextPage" :disabled="currentPage === totalPages" class="btn btn-pagination">Page suivante</button>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>


<script>
import UserService from '@/services/UserService';
import ApiService from '@/services/ApiService';
export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      totalPages: 0,
      showAddUserDialog: false,
      showUserDetailsDialog: false,
      showDeleteConfirmation: false,
      newUser: {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 0
      },
      editMode: false,
      editedUser: {
        id: '',
        nom: '',
        prenom: '',
        email: '',
        password: ''
      },
      userDetails: {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 0
      },
      errorMessage: '' // Ajout de la variable pour stocker le message d'erreur
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      UserService.getAllUsersPagination(this.currentPage, 10)
        .then(response => {
          this.users = response.data.users;
          this.currentPage = response.data.currentPage;
          this.totalPages = response.data.totalPages;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
    loadPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadUsers();
      }
    },
    loadNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadUsers();
      }
    },
    addUser() {
      UserService.createUser(this.newUser)
        .then(() => {
          this.loadUsers();
          this.closeDialog();
        })
        .catch(error => {
          console.error('Error adding user:', error);
        });
    },
    showUserDetails(user) {
      this.userDetails = { ...user };
      this.showUserDetailsDialog = true;
    },
    editUser(user) {
      this.editMode = true;
      this.editedUser = { ...user };
      this.editedUser.password = user.password;
      this.showAddUserDialog = true;
    },
    deleteUser(userId) {
      UserService.deleteUser(userId)
        .then(() => {
          this.loadUsers();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    },
    updateUser() {
      UserService.updateUser(this.editedUser.id, this.editedUser)
        .then(() => {
          this.loadUsers();
          this.closeDialog();
        })
        .catch(error => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.';
        });
    },
    resetPassword(email) {
    const reset = {
      "email": email
    }  
    ApiService.postRessource('/api/reset-password', reset).then(response => {
    }).catch(error => {
      console.error(error);
    });
  },

    closeDialog() {
      this.editMode = false;
      this.showAddUserDialog = false;
      this.editedUser = {
        id: '',
        nom: '',
        prenom: '',
        email: '',
        password: ''
      };
      this.newUser = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 0
      };
    },
    confirmDeleteUser(userId) {
      this.userIdToDelete = userId; // Sauvegarde de l'ID de l'utilisateur à supprimer
      this.showDeleteConfirmation = true; // Affichage de la fenêtre modale de confirmation
    },
    deleteUserConfirmed() {
      UserService.deleteUser(this.userIdToDelete)
        .then(() => {
          this.loadUsers();
          this.showDeleteConfirmation = false; // Cacher la fenêtre modale après suppression
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          this.showDeleteConfirmation = false; // Cacher la fenêtre modale en cas d'erreur
        });
    },
    closeUserDetailsDialog() {
      this.userDetails = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 0
      };
      this.showUserDetailsDialog = false;
    }
  }
};
</script>

<style scoped>

.modal {
  position: fixed;
  top: 300px;
  left: 350px;
  width: 31%;
  height: 25%;
  background-color: rgba(0, 0, 0, 0.2); /* Opacité réduite pour la transparence */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.modal-content p {
  margin-bottom: 10px;
}

.modal-content button {
  margin-right: 10px;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 3px;
}

.modal-content button:last-child {
  margin-right: 0;
}

.confirm-button {
  background-color: #007bff; /* Bleu */
  color: white;
}

.cancel-button {
  background-color: #dc3545; /* Rouge */
  color: white;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.pagination {
  display: flex;
  justify-content: flex-end; /* Align items to the right */
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  background-color: #007bff; /* Bleu */
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

.pagination button:last-child {
  background-color: #28a745; /* Vert */
}

.pagination button:hover {
  opacity: 0.8;
}

.pagination span {
  margin: 0 10px;
}
.user-lists {
  margin-top: 20px;
}

.table {
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

/* Styles pour les boutons */
.btn {
  padding: 5px 10px;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

.btn-details {
  background-color: #28a745; /* Vert */
}

.btn-modify {
  background-color: #007bff; /* Bleu */
}

.btn-delete {
  background-color: #dc3545; /* Rouge */
}

.btn-reset {
  background-color: #ffc107; /* Jaune */
}

.btn-add {
  background-color: #17a2b8; /* Autre bleu */
}

.btn:hover {
  opacity: 0.8;
}

/* Styles pour le formulaire d'ajout/modification/détails */
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.dialog-content h3 {
  margin-bottom: 10px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form label {
  margin-bottom: 5px;
}

.form input {
  padding: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.form select {
  padding: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.dialog-content p {
  margin-bottom: 5px;
  font-size: 16px;
}

.dialog-content strong {
  font-weight: bold;
  margin-right: 5px;
}

.dialog-content button {
  margin-top: 10px;
  background-color: #007bff; /* Bleu */
  color: white;
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  cursor: pointer;
}

.dialog-content button:hover {
  background-color: #0056b3; /* Bleu plus foncé au survol */
}

/* Styles pour la pagination */
.pagination {
  display: flex;
  justify-content: flex-end; /* Align items to the left */
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  background-color: #007bff; /* Bleu */
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.pagination button:hover {
  opacity: 0.8;
}

.pagination span {
  margin: 0 10px;
}
.add-user-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999; /* Assure que le bouton reste au-dessus du reste du contenu */
}
.ajouter {
  display: flex;
  justify-content: flex-end; /* Align items to the left */
  margin-top: 20px;
}
</style>
