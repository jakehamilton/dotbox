import { render } from "preact";
import App from "./App";
import "./theme.css";
import "./global.css";

const root = document.querySelector("#root");

render(<App />, root);
