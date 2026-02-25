import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import App from "./App.tsx";
// import { worker } from "./mocks/server.ts";

async function render() {
    //await worker.start();
    const rootNode = createRoot(document.getElementById('root') as HTMLElement);
    rootNode.render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>
    )
}
render()
