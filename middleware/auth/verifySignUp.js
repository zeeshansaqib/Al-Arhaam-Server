const db = require("../../model/index");
const ROLES = db.ROLES;
const Auth = db.Auths;

checkDuplicateUsernameOrPhone = (req, res, next) => {
  // Username
  Auth.findOne({
    where: {
      user_name: req.body.user_name,
    },
  })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          message: "Failed! Username is already in use!",
        });
      }

      // Phone
      Auth.findOne({
        where: {
          phone: req.body.phone,
        },
      })
        .then((user) => {
          if (user) {
            return res.status(200).json({
              message: "Failed! Phone is already in use!",
            });
          }

          next();
        })
        .catch((err) => {
          return res.status(200).json({
            message: "Error checking phone: " + err.message,
          });
        });
    })
    .catch((err) => {
      return res.status(200).json({
        message: "Error checking username: " + err.message,
      });
    });
};


checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrPhone: checkDuplicateUsernameOrPhone,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
