import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { animate } from "./directives/animate.js";

createApp(App).use(router).directive("animate", animate).mount("#app");
