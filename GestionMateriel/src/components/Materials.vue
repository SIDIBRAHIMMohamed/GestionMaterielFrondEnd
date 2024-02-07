<script setup lang="ts">
import { ref } from 'vue';
// import { Materiel } from '../models/Materiel'
import materials from '../assets/materials.json';

const items = ref(materials['materials']);

const updateItem = (item: any) => {
  console.log('Update:', item);
  // Implement your update logic here
}

const borrowItem = (item: any) => {
  console.log('Borrow:', item);
  // Implement your borrow logic here
}
</script>
<template>
    <div class="material-lists">
      <table class="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Version</th>
            <th>Ref</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.idMateriel">
            <td>{{ item.nom }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.ref }}</td>
            <td>{{ item.status }}</td>
            <td>
            <button @click="updateItem(item)" class="btn btn-primary">Update</button>
            <button @click="borrowItem(item)" class="btn btn-success">Borrow</button>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  

<style scoped>
/* Add custom styles here */
.material-lists {
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}

.table-striped tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.btn {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-primary {
  background-color: #007bff; /* Blue */
  color: white;
}

.btn-success {
  background-color: #28a745; /* Green */
  color: white;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .table th, .table td {
    font-size: 14px;
  }
}

</style>
