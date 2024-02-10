import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login-page.vue';
import Materials from './components/Materials.vue';
import UserList from './components/UserList.vue';
import AddMaterial from './components/AddMaterial.vue';


const routes = [
    {path: '' , component:Login},
    {path: '/admin' , component:UserList},
    {path: '/users' , component:Materials},
    {path: '' , component:Login},
    {path: '/ajouter-materiel' , component:AddMaterial},


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router ;