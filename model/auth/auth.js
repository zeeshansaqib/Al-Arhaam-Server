module.exports = (sequelize, Sequelize) => {
  const Auth = sequelize.define("auth", {
    user_name: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    is_super_user: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Auth;
};
