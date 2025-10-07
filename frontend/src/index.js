import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Cargamos configuración runtime opcional desde /config.json si estamos en el navegador
if (typeof window !== 'undefined') {
	fetch('/config.json')
		.then(res => res.json())
		.then(cfg => {
			window.__RUNTIME_CONFIG__ = cfg || {};
			const root = ReactDOM.createRoot(document.getElementById("root"));
			root.render(<App />);
		})
		.catch(() => {
			window.__RUNTIME_CONFIG__ = {};
			const root = ReactDOM.createRoot(document.getElementById("root"));
			root.render(<App />);
		});
} else {
	// En entorno de tests/node
	const root = ReactDOM.createRoot(document.getElementById("root"));
	root.render(<App />);
}
