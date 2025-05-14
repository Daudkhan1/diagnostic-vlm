import { useState } from "react";

import "./passwordPrompt.scss";

const FIXED_PASSWORD = process.env.REACT_APP_PREVIEW_PASSWORD;
console.log("FIXED_PASSWORD", FIXED_PASSWORD);

const PasswordPrompt = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!FIXED_PASSWORD) {
    console.error(
      "FATAL ERROR: Preview password environment variable (PREVIEW_PASSWORD) not set or loaded correctly!"
    );
    return (
      <div className="password-prompt-overlay">
        <div className="password-prompt-box">
          <h2>Configuration Error</h2>
          <p>
            The required application configuration (password) is missing. Please
            contact support.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === FIXED_PASSWORD) {
      setError("");
      onAuthenticate();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="password-prompt-overlay">
      <div className="password-prompt-box">
        <h2>Authorization Required</h2>

        <p>Please enter the password to access the Live Preview.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password:</label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Authorize
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPrompt;
