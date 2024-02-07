import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login-page.vue';
import Materials from './components/Materials.vue;';
import UserList from './components/UserList.vue';


const routes = [
    {path: '' , component:Login},
    {path: '/admin' , component:UserList},
    {path: '/users' , component:Materials},

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router ;