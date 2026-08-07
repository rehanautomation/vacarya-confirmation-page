import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CallConfirmation from "./CallConfirmation";
import "./fonts.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CallConfirmation />
  </StrictMode>,
);
