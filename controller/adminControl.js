const { getUserPrompt } = require("../models/getData");
const { MiniMenu, P } = require("../views/components/menus");

const adminBoard = new MiniMenu();

adminBoard.createOptionInRow({
    rows: [
        { text: "Consultar usuários existentes" },
        { text: "Criar nova Conta" },
        { text: "Atualizar dados de usuários" },
        { text: "Excluir Conta de Usuários" },
        { text: "Encerrar Sessão" },
    ],
});

adminBoard.createAction({
    actionKey: [1],
    callback: (system) => {
        const search = P("Consultar: ").char();
        P("").inLine();
        const isAdminOnline = system.session.admin
            ? system.admin.adminName
            : "CANTGOTRHOUGHDUESYSTEMHASNOADMIN";
        system.searchUsersAsAdmin(isAdminOnline, { search: search });
    },
});

adminBoard.createAction({
    actionKey: [2],
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

adminBoard.createAction({
    actionKey: [3],
    callback: (system) => {},
});

adminBoard.createAction({
    actionKey: [4],
    callback: (system) => {
        system.deleteAccountAsAdmin();
    },
});
adminBoard.createAction({
    actionKey: [5],
    callback: (system) => {
        system.dropSession();
    },
});
module.exports = {
    adminBoard,
};
