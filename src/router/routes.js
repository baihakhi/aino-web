// profile
import profilePage from '../pages/profile/ProfilePage.vue'
import profilePostsPage from '../pages/profile/ProfilePostsPage.vue'

// single pages
import homePage from '../pages/Home.vue'
import loginPage from '../pages/Login.vue'
import registerPage from '../pages/Register.vue'
import notFoundPage from '../pages/NotFound.vue'

// import { routePropResolver } from './util'
import { DOMAIN_TITLE } from '../.env'

export const routes = [
  {
    path: '/',
    name: 'index',
    component: homePage,
    meta: { title: `${DOMAIN_TITLE} | home` }
  },
  {
    path: '/profile',
    component: profilePage,
    meta: { isAuth: true, title: `${DOMAIN_TITLE} | profile` },
    children: [
      {
        path: '',
        name: 'profile',
        component: profilePostsPage
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: registerPage,
    meta: { title: `${DOMAIN_TITLE} | register` }
  },

  {
    path: '/login',
    name: 'login',
    component: loginPage,
    meta: { title: `${DOMAIN_TITLE} | login` }
  },
  {
    path: '*',
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | not found` }
  }
]
