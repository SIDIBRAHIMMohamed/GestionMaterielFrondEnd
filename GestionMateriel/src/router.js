// router.js

import { createRouter, createWebHistory } from 'vue-router';
import Layout from './components/LayOut.vue';
import Login from './components/LoginPage.vue';
import Materials from './components/Materials.vue';
import UserList from './components/UserList.vue';

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '/admin', component: UserList, meta: { requiresAdmin: true } },
            { path: '/users', component: Materials, meta: { requiresAuth: true } }, // Ajouter meta: { requiresAuth: true }
        ]
    },
    { path: '', component: Login },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAdmin)) {
        const userRole = parseInt(localStorage.getItem('userRole'));
        if (!userRole || userRole !== 1) {
            next({ path: '/', query: { redirect: to.fullPath } });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresAuth)) { // Ajouter la logique pour vérifier l'authentification
        const isAuthenticated = localStorage.getItem('userAuthenticated');
        if (!isAuthenticated) {
            next({ path: '/', query: { redirect: to.fullPath } });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
