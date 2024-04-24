import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "../src/Redux/Store/Index";
import { createRoot } from "react-dom/client"; // Import createRoot
import { PersistGate } from "redux-persist/integration/react";

/* ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>
);
 */

// Find the root element in your HTML
const rootElement = document.getElementById("root");
// Create a root
const root = createRoot(rootElement);

// Initial render: Render your app within the context of the Redux Provider and PersistGate
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
);
