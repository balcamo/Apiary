import 'rsuite/dist/rsuite.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "./styles/App.css";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./utils/config/serviceWorker";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
		<Router>
			<App />
		</Router>
);



serviceWorker.unregister();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();