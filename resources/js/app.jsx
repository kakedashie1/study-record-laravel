import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

console.log("Available pages:", Object.keys(pages));

createInertiaApp({
    title: (title) => `${title} - 学習時間記録アプリ`,

    resolve: (name) => {
        const page = pages[`./Pages/${name}.jsx`];

        if (!page) {
            console.error("Inertia page not found:", name);
            console.error("Available pages:", Object.keys(pages));
            throw new Error(`Inertia page not found: ${name}`);
        }

        return page.default;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#4B5563",
    },
});

// ↓追加
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered:",
                    registration
                );
            })
            .catch((error) => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}
