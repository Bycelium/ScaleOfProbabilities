import "./style.css";
import { createScale } from "./scale";
import { parseSiteRoute } from "./site";

createScale(document.querySelector<HTMLElement>("#app")!, { initialRoute: parseSiteRoute(location.pathname) ?? {} });
