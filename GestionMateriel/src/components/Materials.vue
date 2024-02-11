<script setup lang="ts">
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { createApp, ref } from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';
import ApiService from '../services/ApiService';

const app = createApp({});
app.use(VueSweetalert2);



const items = ref<any[]>([]);
  const role = localStorage.getItem('userRole');
  const userId = localStorage.getItem('UserId') as string;
  const nom = localStorage.getItem('Username') as string;
  const prenom = localStorage.getItem('Userprenom') as string;
  const next = ref(false);

const currentPage = ref(1);

const getMaterials = () => {
  const param = new URLSearchParams();
  param.append('page', currentPage.value.toString());
  ApiService.getRessource2('/paginatedMaterials', param).then((response:any) => {
    items.value = response.data.materials; 
    next.value = response.data.next;
  });
}

getMaterials();


const updateItem = async (item: any) => {
  const { value: formValues } = await Swal.fire({
    title: 'Update Material',
    html:
      `<input id="swal-input1" class="swal2-input" placeholder="Nom" value="${item.nom}">` +
      `<input id="swal-input2" class="swal2-input" placeholder="Version" value="${item.version}">` +
      `<input id="swal-input3" class="swal2-input" placeholder="Ref" value="${item.ref}">`,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return [
        (document.getElementById('swal-input1') as HTMLInputElement).value,
        (document.getElementById('swal-input2') as HTMLInputElement).value,
        (document.getElementById('swal-input3') as HTMLInputElement).value
      ]
    }
  })

  if (formValues) {
    const params = new URLSearchParams();
    params.append('nom', formValues[0]);
    params.append('version', formValues[1]);
    params.append('ref', formValues[2]);

    ApiService.putRessource('/update/'+item.idMateriel, params).then(response => {
      getMaterials();
    }).catch(error => {
      console.error(error);
    });
  }
}

const deleteItem = async (item: any) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr(e) ?',
    text: "Vous ne pourrez pas revenir en arrière !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimez-le !'
})


  if (result.isConfirmed) {
    ApiService.deleteRessource('/delete/'+item.idMateriel).then(response => {
      getMaterials();
    }).catch(error => {
      console.error(error);
    });
  }
}

const borrowItem = async (item: any) => {
  if(item != null) {
    ApiService.getRessource('/get/'+item.idMateriel).then(async response => {
      const responseData =response.data;

      const status = responseData.status;
      const materielid = responseData.idMateriel;
      if(status == 0) {

  const { value: startdate } = await Swal.fire({
  title: "Choisir votre debut d'emprunt",
  input: "date",
  didOpen: () => {
    const today = (new Date()).toISOString();
    const inputElement = Swal.getInput();
if (inputElement) {
  inputElement.min = today.split("T")[0];
} else {
  Swal.fire("veuillez choisir une date");
}
  }
});
if (startdate) {
  const { value: enddate } = await Swal.fire({
  title: "Choisir votre date de fin d'emprunt",
  input: "date",
  didOpen: () => {
    const today = (new Date()).toISOString();
    const inputElement = Swal.getInput();
if (inputElement) {
  inputElement.min = startdate.split("T")[0];
} else {
  Swal.fire("veuillez choisir une date");
}
  }
});
if(enddate) {
  const params = {
  dateDebut: startdate.toString(), 
  dateFin: enddate.toString(),
  idUtilisateur: parseInt(userId),
  idMateriel: parseInt(materielid)
};
  Swal.fire("Vous avez emprunte du " + startdate + " jusqu'au "+ enddate);

  ApiService.makereservation('/makeReservation', params).then(response => {
    const params1 = {
     

      status : 1,
    }
    
    ApiService.putStatus('/updatestatus/'+item.idMateriel, params1).then(response => {
      getMaterials();
    }).catch(error => {
      console.error(error);
    });
  }).catch(error => {
    console.error(error);
  })
  
}
}

      }
    }).catch(error => {
      console.error(error);
    });
  }


}

const nextPage = () => {
  currentPage.value++;
  getMaterials();
}


const addMateriel = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Ajouter un matériel',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Nom">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Version">' +
      '<input id="swal-input3" class="swal2-input" placeholder="Ref">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return [
        (document.getElementById('swal-input1') as HTMLInputElement).value,
        (document.getElementById('swal-input2') as HTMLInputElement).value,
        (document.getElementById('swal-input3') as HTMLInputElement).value
      ]
    }
  })

  if (formValues) {
    const params = new URLSearchParams();
    params.append('nom', formValues[0]);
    params.append('version', formValues[1]);
    params.append('ref', formValues[2]);
    
    ApiService.postRessource('/add', params).then(response => {
      getMaterials();
    }).catch(error => {
      console.error(error);
    });
  }
}



const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--; 
    getMaterials();
  }
}
</script>
<template>
  
  <div class="ajouter">
  <button v-on:click="addMateriel" class="btn btn-primary" v-if="role === '1'">Ajouter</button>


    </div>
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
            <td>
              <p v-if="item.status === 1" style="color: #C02F1D;">Emprunté</p>
              <p v-else style="color: #107896;">Disponible</p>
            </td>
            <td>
            <button @click="updateItem(item)" class="btn btn-primary" v-if="role === '1'">Modifier</button>
            <button @click="deleteItem(item)" class="btn btn-danger"  v-if="role === '1' " :disabled="item.status">Supprimer</button>
            <button @click="borrowItem(item)" class="btn btn-success" :disabled="item.status">Emprunter</button>
          </td>
          </tr>
        </tbody>
      </table>

<div class="pagination">
  <button class="btn btn-primary" @click="prevPage">Precedant</button>
  <span>Page: {{ currentPage }}</span>
  <button class="btn btn-success" @click="nextPage" :disabled="!next">Suivant</button>
</div>
    </div>
  </template>
  

<style scoped>
/* Add custom styles here */
.material-lists {
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

.table td button {
  margin-right: 5px;
}

.btn-success {
  background-color: #28a745; /* Green */
  color: white;
}

.pagination {
  display: flex;
  justify-content: flex-end; /* Align items to the left */
  margin-top: 20px;
}



.ajouter {
  display: flex;
  justify-content: flex-end; /* Align items to the left */
  margin-top: 20px;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .table th, .table td {
    font-size: 14px;
  }
}



</style>
