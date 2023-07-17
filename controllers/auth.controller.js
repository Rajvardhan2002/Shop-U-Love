const User = require("../models/user.models");
const authUtil = require("../utilities/auth.util");
const validation = require("../utilities/validation");
const saveSession = require("../utilities/save-sessions");

//renders our signup page
function getSignup(req, res) {
  let sessionData = saveSession.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }
  res.render("customers/auth/signup", {
    inputData: sessionData,
  }); /* because we have already exposed our views folder and hence we don't need to add views/.That's
   soomething automatically done via browser*/
}

//hNDLE our signup form submission
async function signup(req, res, next) {
  const enteredDataByUser = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    saveSession.saveDataInSession(
      req,
      {
        errorMessage: "Please recheck your entered data.",
        ...enteredDataByUser,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const userExistsAlready = await user.existsAlready();
    if (userExistsAlready) {
      saveSession.saveDataInSession(
        req,
        {
          errorMessage: "User exists already! Try logging in instead!",
          ...enteredDataByUser,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}

//renders our login page
function getLogin(req, res) {
  let sessionData = saveSession.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customers/auth/login", {inputData : sessionData});
}

//handle our login form submission
async function login(req, res) {
  const user = new User(req.body.email, req.body.password); // here we are passing an unhashed password, just a string
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail(); //boolean
  } catch (error) {
    next(error);
    return;
  }

  //creating object in which session data will be saved
  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - please re-check your email and password!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    saveSession.saveDataInSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasmatchingPassword(
    existingUser.password
  );
  if (!passwordIsCorrect) {
    saveSession.saveDataInSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

//handle logout form submission
function logout(req, res) {
  authUtil.destroyUserSession(req, function () {
    res.redirect("/login");
  });
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
