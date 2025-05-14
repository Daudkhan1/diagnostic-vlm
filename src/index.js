import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { UUIDProvider } from "./context/UUIDContext";

import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UUIDProvider>
      <App />
    </UUIDProvider>
  </React.StrictMode>
);
