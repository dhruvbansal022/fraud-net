import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ensureConfig } from "@/config/env";

ensureConfig();

createRoot(document.getElementById("root")!).render(<App />);
