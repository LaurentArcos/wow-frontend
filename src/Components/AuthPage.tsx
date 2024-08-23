import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import invisibleIcon from "../assets/invisible - gold.png";
import visibleIcon from "../assets/visible - gold.png";

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 
  const [showPasswordHint, setShowPasswordHint] = useState(false); 
  const [showUsernameHint, setShowUsernameHint] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (username: string) => {
    const errors = [];
    if (username.length < 4) errors.push("L'identifiant doit contenir au moins 4 caractères.");
    if (!/[A-Z]/.test(username)) errors.push("L'identifiant doit contenir au moins une majuscule.");
    return errors.length > 0 ? errors.join(" ") : null;
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères.");
    if (!/[A-Z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une majuscule.");
    if (!/\d/.test(password)) errors.push("Le mot de passe doit contenir au moins un chiffre.");
    if (!/[!@#\$%\^&\*]/.test(password)) errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
    return errors.length > 0 ? errors.join(" ") : null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valider l'identifiant
    const usernameError = validateUsername(username);
    if (usernameError) {
      alert(usernameError); // Affiche les erreurs pour l'identifiant
      return;
    }

    // Valider le mot de passe
    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError); // Affiche les erreurs pour le mot de passe
      return;
    }

    if (isLogin) {
      // Connexion
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          { username, password }
        );
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirection vers la page d'accueil
      } catch (error) {
        console.error("Erreur d'authentification :", error);
        alert("Erreur lors de l'authentification. Veuillez réessayer.");
      }
    } else {
      // Inscription désactivée
      alert("La création de compte est désactivée pour le moment.");
      // Logique d'inscription commentée pour une utilisation future
      /*
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/register`,
          { username, password }
        );
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirection vers la page d'accueil
      } catch (error) {
        console.error("Erreur d'inscription :", error);
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
      }
      */
    }
  };

  return (
    <div className="auth-container">

      {/* Lien vers la page d'accueil */}
      <div className="back-to-home">
        <p onClick={() => navigate("/")} className="back-link">
          Retour à l'accueil
        </p>
      </div>

      <div className="auth-form">
        <h2>{isLogin ? "Connexion" : "Creer un compte"}</h2>
        <form onSubmit={handleAuth}>
          <div className="username-container">
            <input
              type="text"
              placeholder="Identifiant"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              onFocus={() => setShowUsernameHint(true)} // Affiche la bulle d'info de l'identifiant
              onBlur={() => setShowUsernameHint(false)} // Cache la bulle d'info de l'identifiant
            />
            {showUsernameHint && (
              <div className="password-hint">
                L'identifiant doit contenir au moins 4 caractères, dont une majuscule.
              </div>
            )}
          </div>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => setShowPasswordHint(true)} // Affiche la bulle d'info du mot de passe
              onBlur={() => setShowPasswordHint(false)} // Cache la bulle d'info du mot de passe
            />
            <img
              src={passwordVisible ? visibleIcon : invisibleIcon}
              alt="Toggle visibility"
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
            {showPasswordHint && (
              <div className="password-hint">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
              </div>
            )}
          </div>
          <button type="submit">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? (
            <>
              Vous n'avez pas de compte ?{" "}
              <span className="highlight">Créer un compte</span>
            </>
          ) : (
            <>
              Vous avez déjà un compte ?{" "}
              <span className="highlight">Connectez-vous</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
