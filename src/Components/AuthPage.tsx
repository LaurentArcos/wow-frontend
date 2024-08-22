import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);  // Toggle entre connexion et inscription
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isLogin ? "/api/login" : "/api/register";
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${url}`,
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/");  // Redirection vers la page d'accueil
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
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
