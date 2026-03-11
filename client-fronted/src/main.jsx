import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppWrapper from "./layouts/AppWrapper.jsx";

import "./index.css"; // Tailwind FIRST

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "aos/dist/aos.css";
import "./css/style.css";
import { Provider } from "react-redux";
import { store } from "./appStore/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppWrapper>
      <App />
    </AppWrapper>
  </Provider>,
);
