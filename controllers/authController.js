const User = require("../models/user.js");

// Show login form
const showLogin = (req, res) => {
  return res.render("pages/login", {
    title: "Login",
  });
};

// Login
const login = (req, res) => {
  const { login, password } = req.body;
  const errors = {};

  if (!login) errors.login = "Login is required.";
  if (!password) errors.password = "Password is required.";

  if (Object.keys(errors).length > 0) {
    return res.render("pages/login", {
      title: "Login - Error",
      errors,
      patient: { login },
    });
  }

  User.findOne({ login })
    .then((user) => {
      if (!user) {
        return res.render("pages/login", {
          title: "Login - Error",
          errors: { login: "Wrong login data" },
          patient: { login },
        });
      }

      if (user.password !== password) {
        return res.render("pages/login", {
          title: "Login - Error",
          errors: { password: "Wrong login data" },
          patient: { login },
        });
      }

      req.session.user = { login: user.login, rol: user.rol, id: user._id };
      console.log(req.session.user);
      return res.redirect("/");
    })
    .catch((err) => {
      res.status(500).render("pages/error", {
        title: "Error",
        error: "Error at login",
        code: 500,
      });
    });
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('pages/error', {
        title: "Error",
        error: "An error occurred while logging out.",
        code: 500,
      });
    }
    res.redirect('/');
  });
};

// Roles controller
const allowedRoles = (...allowedRoles) => {
  return (req, res, next) => {
      Promise.resolve().then(() => {
          if (!req.session || !req.session.user) {
              return res.redirect('/auth/login');
          }

          const user = req.session.user;

          if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
              return res.status(403).render('pages/error', {
                  title: "Forbidden",
                  error: "Forbidden: Insufficient role privileges.",
                  code: 403
              });
          }

          req.user = user;
          next(); // Continue to the next middleware or route handler
      }).catch(err => {
          res.status(500).render('pages/error', {
              title: "Error",
              error: "An error occurred while processing the request.",
              code: 500
          });
      });
  };
};


module.exports = {
  showLogin,
  login,
  logout,
  allowedRoles
};
