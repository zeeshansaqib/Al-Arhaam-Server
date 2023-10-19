module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  // set your database name here => DB: "database name"
  DB: "al-arham",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
