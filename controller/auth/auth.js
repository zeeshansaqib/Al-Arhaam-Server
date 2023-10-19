const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../model/index");

const Auth = db.Auths;
const User = db.Sealers;

const Role = db.Roles;
const Logout = db.Logouts;

const config = require("../../config/auth.config");

//Method: POST
//Route: /Login
exports.Login = (req, res) => {
  Auth.findOne({
    where: {
      phone: req.body.phone,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(200)
          .send({ message: "Login Failed! Please check your phone" });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];

      user
        .getRoles()
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());

          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            phone: user.phone,
            roles: authorities,
            accessToken: token,
            message:'success'
          });
        })
        .catch((err) => {
          res
            .status(200)
            .send({ message: "Login Failed! Please check your input.2" });
        });
    })
    .catch((err) => {
      res
        .status(200)
        .send({ message: "Login Failed! Please check your input.3" });
    });
};

//Method: POST
//Route: /sealerRegister

exports.postSealerRegister = (req, res) => {
  //validate
  if (!req.body.user_name && !req.body.phone && !req.body.password) {
    res.status(200).send({
      message: "Input fields cannot be Empty!",
    });
    return;
  } else {
    // Create
    let encPass = bcrypt.hashSync(req.body.password, 8);
    const data = {
      password: encPass,
      user_name: req.body.user_name,
      phone: req.body.phone,
    };
// return res.json({message:data})
    // save
    Auth.create(data)
      .then((user) => {
        // res.status(200).send({
        //   data: user,
        //   message: "success",
        // });
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400, // 24 hours
        });
        res.status(200).send({
          id: user.id,
          user_name: user.user_name,
          phone: user.phone,
          // roles: authorities,
          accessToken: token,
          message: "Login successfull",
        });
        // save sealer 
        //  const profile = {
        //   name: req.body.user_name,
        //   salerId: user.id,
        //   logo:'',
        //   phone:'',
        //   description:''
        // };
        // User.create(profile)
        // // end save sealer 

        // Role.findAll({
        //   where: {
        //     name: "sealer",
        //   },
        // }).then((roles) => {
        //   user
        //     .setRoles(roles)
        //     .then(() => {
             
        //       // end save user
        //       res.status(200).send({
        //         data: user,
        //         message: "success",
        //       });
        //     })
        //     .catch(() => {
        //       res.status(200).send({
        //         message: "yah hay error",
        //       });
        //     });
        // });
      })
      .catch((err) => {
        res.status(200).send({
          message: "Something went wrong",
        });
      });


  }
};

//Method: POST
//Route: /UserRegister

exports.postUserRegister = (req, res) => {
  //validate
  if (!req.body.user_name && !req.body.phone && !req.body.password) {
    res.status(200).send({
      message: "Input fields cannot be Empty!",
    });
    return;
  } else {
    // Create
    let encPass = bcrypt.hashSync(req.body.password, 8);
    const data = {
      password: encPass,
      username: req.body.user_name,
      phone: req.body.phone,
    };

    //save
    Auth.create(data)
      .then((user) => {
        Role.findAll({
          where: {
            name: "user",
          },
        }).then((roles) => {
          user
            .setRoles(roles)
            .then(() => {
              res.status(200).send({
                data: user,
                message: "success",
              });
            })
            .catch(() => {
              res.status(200).send({
                message: "error",
              });
            });
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "error",
        });
      });
  }
};

//Method: GET
//Route: /Logout

exports.Logout = (req, res) => {
  const authHeader = req.headers["x-access-token"];

  Logout.create({
    jwtToken: authHeader,
  })
    .then((result) => {
      console.log(result);
      res.status(200).send({
        message: "User has been Logout",
      });
    })
    .catch((err) => {
      res.status(200).send({
        message: "Something went wrong! Not logout",
      });
    });
};