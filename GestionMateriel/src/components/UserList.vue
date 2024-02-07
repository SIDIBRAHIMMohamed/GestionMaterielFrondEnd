<template>
  <div>
    <h2>Liste des utilisateurs</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.nom }} {{ user.prenom }}
        <button @click="showUserDetails(user)">Détails</button>
        <button @click="editUser(user)">Modifier</button>
        <button @click="deleteUser(user.id)">Supprimer</button>
      </li>
    </ul>

    <button @click="showAddUserDialog = true">Ajouter un utilisateur</button>

    <div v-if="showAddUserDialog" class="dialog">
      <div class="dialog-content">
        <h3 v-if="editMode">Modifier un utilisateur</h3>
        <h3 v-else>Ajouter un utilisateur</h3>
        <form @submit.prevent="editMode ? updateUser() : addUser()">
          <div>
            <label>Nom:</label>
            <input type="text" :value="getFieldValue('nom')" @input="updateField($event.target.value, 'nom')" required>
          </div>
          <div>
            <label>Prénom:</label>
            <input type="text" :value="getFieldValue('prenom')" @input="updateField($event.target.value, 'prenom')" required>
          </div>
          <div>
            <label>Email:</label>
            <input type="email" :value="getFieldValue('email')" @input="updateField($event.target.value, 'email')" required>
          </div>
          <div v-if="!editMode">
            <label>Mot de passe:</label>
            <input type="password" v-model="newUser.password" required>
          </div>
          <div>
            <label>Rôle:</label>
            <select v-model="newUser.role" required>
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
        <p>Nom: {{ userDetails.nom }}</p>
        <p>Prénom: {{ userDetails.prenom }}</p>
        <p>Email: {{ userDetails.email }}</p>
        <p>Password: {{ userDetails.password }}</p>
        <p>Role: {{ userDetails.role }}</p>
        <!-- Autres détails à afficher -->
        <button @click="closeUserDetailsDialog">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  data() {
    return {
      users: [],
      showAddUserDialog: false,
      showUserDetailsDialog: false,
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
      fields: [
        { key: 'nom', label: 'Nom' },
        { key: 'prenom', label: 'Prénom' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Mot de passe' },
        { key: 'role', label: 'Rôle' }
      ]
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      UserService.getAllUsers()
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
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
      this.userDetails = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: user.password,
        role: user.role
      };
      this.showUserDetailsDialog = true;
    },
    editUser(user) {
      this.editMode = true;
      this.editedUser = { ...user };
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
    closeUserDetailsDialog() {
      this.userDetails = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 0
      };
      this.showUserDetailsDialog = false;
    },
    getFieldValue(fieldName) {
      return this.editMode ? this.editedUser[fieldName] : this.newUser[fieldName];
    },
    updateField(value, fieldName) {
      if (this.editMode) {
        this.editedUser[fieldName] = value;
      } else {
        this.newUser[fieldName] = value;
      }
    }
  }
};
</script>

<style scoped>
/* Styles pour la liste des utilisateurs */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

/* Styles pour les boutons */
button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
}

button:hover {
  background-color: #0056b3;
}

/* Styles pour le formulaire d'ajout/modification d'utilisateur */
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

.dialog-content div {
  margin-bottom: 10px;
}

.dialog-content input {
  width: 100%;
  padding: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.dialog-content button {
  margin-top: 10px;
}
</style>
