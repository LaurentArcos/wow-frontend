import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import invisibleIcon from "../assets/invisible - gold.png";
import visibleIcon from "../assets/visible - gold.png";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle entre connexion et inscription
  const [showPasswordHint, setShowPasswordHint] = useState(false); // Pour afficher la bulle d'info
  const navigate = useNavigate();

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

    // Valider le mot de passe uniquement lors de la soumission
    const error = validatePassword(password);
    if (error) {
      alert(error); // Affiche les erreurs en alerte
      return;
    }

    const url = isLogin ? "/login" : "/register";
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${url}`,
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/"); // Redirection vers la page d'accueil
    } catch (error) {
      console.error("Erreur d'authentification :", error);
      alert("Erreur lors de l'authentification. Veuillez réessayer.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? "Connexion" : "Creer un compte"}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => setShowPasswordHint(true)} // Affiche la bulle d'info
              onBlur={() => setShowPasswordHint(false)} // Cache la bulle d'info
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
          {isLogin
            ? "Vous n'avez pas de compte ? Créer un compte"
            : "Vous avez déjà un compte ? Connectez-vous"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
