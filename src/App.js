import React from "react";
import { AppProvider } from "@shopify/polaris";
import DiscountForm from "./components/DiscountForm";
import "@shopify/polaris/build/esm/styles.css";

function App() {
  return (
    <AppProvider>
      <DiscountForm />
    </AppProvider>
  );
}

export default App;