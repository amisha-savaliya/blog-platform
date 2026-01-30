import { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


import "./admin/assets/styles/tailwind.css";
import "aos/dist/aos.css";

import "./css/style.css";
import AppWrapper from "./layouts/AppWrapper.jsx";






createRoot(document.getElementById("root")).render(
  // <StrictMode>
<AppWrapper>
  <App />
</AppWrapper>
  // </StrictMode>
);
