import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import ProjectView from "../views/ProjectView.vue";
import ContactView from "../views/ContactView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { title: "Home" },
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      meta: { title: "About" },
      component: AboutView,
    },
    {
      path: "/projects",
      name: "projects",
      meta: { title: "Projects" },
      component: ProjectsView,
    },
    {
      path: "/projects/:slug",
      name: "project",
      component: ProjectView,
    },
    {
      path: "/contact",
      name: "contact",
      meta: { title: "Contact" },
      component: ContactView,
    },
  ],
});

export const SITE_TITLE = "Loann Juillerat";

export function setPageTitle(title) {
  document.title = title ? `${title} - ${SITE_TITLE}` : SITE_TITLE;
}

// Pages without a static title (a project) set it themselves once loaded
router.afterEach((to) => {
  if (to.meta.title) setPageTitle(to.meta.title);
});

export default router;
