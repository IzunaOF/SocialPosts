const { getUserPrompt } = require("../models/getData");
const { MiniMenu, P } = require("../views/components/menus");

const loginMenu = new MiniMenu();

loginMenu.createOptionInRow({
    rows: [
        { text: "Administrador" },
        { text: "Já Tenho Uma Conta" },
        { text: "Criar conta" },
        { text: "Encerrar Sistema" },
    ],
});

loginMenu.createAction({
    actionKey: [1],
    callback: (system) => {
        const admin = P("name: ").char();
        const adminPassword = P("password: ").char();
        const logged = system.loginMaster(admin, adminPassword);
        if (logged) return P(`Bem vindo ${system.admin.adminName.toLocaleUpperCase()}. Todas as configurações foram carregadas!`).printColor();
        P("Administrador inválido!").printColor();
    },
});
loginMenu.createAction({
    actionKey: [2],
    callback: (system) => {
        system.dropSession();
        const user = P("CPF: ").char();
        const password = P("Senha: ").char();
        const logged = system.login(user, password);
        if (logged) return P(`Login Efetuado. ${system.session.profileName}, seja Bem Vindo!`).printColor();
        P("Este usuário não está registrado!").printColor();
    },
});
loginMenu.createAction({
    actionKey: [3],
    callback: (system) => {
        const c = getUserPrompt.triggerAction("createUser").callback()();
        system.createUser({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            password: c.password,
            birthday: c.birthday,
            cpf: c.cpf,
            phone: c.phone,
            adress: c.adress,
        });
    },
});

loginMenu.createAction({
    actionKey: [4],
    callback: () => {
        P("Sitema encerrado!").printColor();
    },
});

module.exports = {
    loginMenu,
};
