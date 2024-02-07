import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login-page.vue';
import UserList from './components/UserList.vue';


const routes = [
    {path: '' , component:Login},
    {path: '/admin' , component:UserList},

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router ;