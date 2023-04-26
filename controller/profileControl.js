const { MiniMenu, P } = require("../views/components/menus");
const { Adress } = require("../models/usersModel");
const { getUserPrompt } = require("../models/getData");

const profileConfigMenu = new MiniMenu(new MiniMenu());

profileConfigMenu.createOptionInRow({
    rows: [
        { text: "Atualizar Meus Dados" },
        { text: "Trocar Conta" },
        { text: "Criar nova Conta" },
        { text: "Excluir Conta" },
        { text: "Voltar ao Perfil" },
    ],
});

profileConfigMenu.createAction({
    actionKey: [1],
    callback: (system) => {
        const id = system.session.id;
        const updateMenu = profileConfigMenu.submenu;

        updateMenu.printScreen();

        const updateField = updateMenu.getOption("num");

        if (updateMenu.menu.has(updateField)) {
            updateMenu.msgOnEntryPoint(updateField);

            if (updateField != 7) {
                const values = P(`Mudar ${updateMenu.menu.get(updateField).msg} para: `).char();
                updateMenu.triggerAction(updateField).callback()(system, id, updateField, values.split(" "));
            } else {
                updateMenu.triggerAction(updateField).callback()(system, id, updateField);
            }
        }
    },
});

profileConfigMenu.createAction({
    actionKey: [2],
    callback: (system) => {
        const user = P("CPF: ").char();
        const password = P("Senha: ").char();

        const logged = system.login(user, password);

        if (logged) return P(`Olá ${system.session.profileName}. Bem vindo de volta!`).printColor();
    },
});

profileConfigMenu.createAction({
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

profileConfigMenu.createAction({
    actionKey: [4],
    callback: (system) => {
        const deleted = system.deleteUserFromSystem();
        if (deleted) system.dropSession();
    },
});

profileConfigMenu.submenu.createOptionInRow({
    rows: [
        { text: "Nome e Sobrenome" },
        { text: "Data nascimento" },
        { text: "Password" },
        { text: "Email" },
        { text: "CPF" },
        { text: "Telefone" },
        { text: "Endereço" },
    ],
});

profileConfigMenu.submenu.createAction({
    actionKey: [1, 2, 3, 4, 5, 6],
    callback: (system, id, field, newValues = []) => {
        system.updateUser({ userId: id, field: field, values: newValues });
    },
});
profileConfigMenu.submenu.createAction({
    actionKey: [7],
    callback: (system, id, field) => {
        P("\nPreencha seu endreço corretamente").print();

        const country = P("País: ").char();
        const cep = P("CEP: 00000-000: ").char();
        const state = P("UF: ").char();
        const city = P("Cidade: ").char();
        const neighbor = P("Bairro: ").char();
        const street = P("Rua: ").char();
        const num = P("Numero da residencia: ").char();

        const adress = new Adress(country, cep, state, city, neighbor, street, num);

        system.updateUser({ userId: id, field: field, values: [adress] });
    },
});

module.exports = {
    profileConfigMenu,
};
