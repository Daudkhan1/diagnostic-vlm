import { useState } from "react";
import {
  Navbar,
  Heading,
  ChatWindow,
  Card,
  PasswordPrompt,
} from "./components";

import "./App.scss";

const AUTH_SESSION_KEY = "livePreviewAuthenticated";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
  });

  const handleAuthentication = () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <PasswordPrompt onAuthenticate={handleAuthentication} />;
  }

  return (
    <div className="App">
      <Navbar />

      <section className="vlm-main-body-container">
        <main className="vlm-main-body-wrapper">
          <Heading
            heading="Medical Scan Analysis"
            description="Upload your medical scans and get AI-powered insights. Our vision language model can analyze radiological images and answer your questions. Radiology Assistant."
          />

          <ChatWindow />

          <section className="chat-cards-container">
            <Card />
          </section>
        </main>
      </section>
    </div>
  );
};

export default App;
