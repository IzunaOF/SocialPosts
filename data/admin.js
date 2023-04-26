const { Adress, Admin } = require("../models/usersModel");

const adminAdress = new Adress("Brazil", "88200-000", "SC", "Tijucas", "Centro", "15 Novembro", "0258");
const admin = new Admin(
    "master",
    "master123",
    1,
    "Carlos",
    "Danobrega",
    "carlosDan@gmail.com",
    "master123",
    32,
    "111.444.777-35",
    "99456-8541",
    adminAdress
);

module.exports = {
    admin,
};
