import { createRoot } from "react-dom/client"
import { TestAppUiProvider, AppUiProvider } from "@canva/app-ui-kit"
import { App } from "./App"
import "@canva/app-ui-kit/styles.css"

const isCanva = !!(window as Record<string, unknown>).__canva__
const Provider = isCanva ? AppUiProvider : TestAppUiProvider

const root = createRoot(document.getElementById("root")!)
root.render(
  <Provider>
    <App />
  </Provider>
)
