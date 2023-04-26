const { getUserPrompt } = require("../models/getData");

const { MiniMenu, P } = require("../views/components/menus");
const { friendInteractionMenu } = require("./interactionsControl");
const { postMenu } = require("./postsControl");
const { profileConfigMenu } = require("./profileControl");

const mainMenu = new MiniMenu();

mainMenu.createOptionInRow({
    rows: [
        { text: "Ver Perfil" },
        { text: "Meus Posts" },
        { text: "Meus Amigos" },
        { text: "Opções de perfil" },
        { text: "Pesquisar Perfis" },
        { text: "Encerrar Sessão" },
    ],
});

mainMenu.createAction({
    actionKey: [1],
    callback: (system) => {
        system.showUserSessionProfile();
    },
});

mainMenu.createAction({
    actionKey: [2],
    callback: (system) => {
        let postMenuOption = 0;
        do {
            postMenu.printScreen();

            postMenuOption = postMenu.getOption("num");
            postMenu.msgOnEntryPoint(postMenuOption);

            if (postMenu.actions.has(postMenuOption)) {
                postMenu.triggerAction(postMenuOption).callback()(system);
            }
        } while (postMenuOption != postMenu.menu.size);
    },
});

mainMenu.createAction({
    actionKey: [3],
    callback: (system) => {
        let interactionOption = 0;
        do {
            friendInteractionMenu.printScreen();
            interactionOption = friendInteractionMenu.getOption("num");

            friendInteractionMenu.msgOnEntryPoint(interactionOption);

            if (friendInteractionMenu.actions.has(interactionOption)) {
                friendInteractionMenu.triggerAction(interactionOption).callback()(system);
            }
        } while (interactionOption != friendInteractionMenu.menu.size);
        P("Redirecionado ao perfil").printColor();
    },
});

mainMenu.createAction({
    actionKey: [4],
    callback: (system) => {
        let profileOptions = 0;
        do {
            profileConfigMenu.printScreen();
            profileOptions = profileConfigMenu.getOption("num");
            profileConfigMenu.msgOnEntryPoint(profileOptions);
            
            if (profileConfigMenu.actions.has(profileOptions)) {
                profileConfigMenu.triggerAction(profileOptions).callback()(system);
            }
        } while (profileOptions != profileConfigMenu.menu.size);
        P("Redirecionado ao perfil").printColor();
    },
});

mainMenu.createAction({
    actionKey: [5],
    callback: (system) => {
        const search = P("Consultar: ").char();
        P("").inLine();
        system.searchUsers({ search: search });
    },
});

mainMenu.createAction({
    actionKey: [6],
    callback: (system) => {
        system.dropSession();
    },
});

module.exports = {
    mainMenu,
};
