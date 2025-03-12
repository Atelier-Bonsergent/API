const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.LOGIN_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.LOGIN_MAX_REQUESTS) || 5, // Limite chaque IP à 5 requêtes par fenêtre de 15 minutes
  message: "Trop de tentatives de connexion, veuillez réessayer après 15 minutes."
});

const registerLimiter = rateLimit({
  windowMs: parseInt(process.env.REGISTER_WINDOW_MS) || 60 * 60 * 1000, // 1 heure
  max: parseInt(process.env.REGISTER_MAX_REQUESTS) || 3, // Limite chaque IP à 3 requêtes par fenêtre d'une heure
  message: "Trop de tentatives d'inscription, veuillez réessayer après une heure."
});

module.exports = { loginLimiter, registerLimiter }; 