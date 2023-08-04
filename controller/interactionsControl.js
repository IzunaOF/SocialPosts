const { MiniMenu, P } = require("../views/components/menus");
const { postAttributesMenu } = require("./postsControl");

const friendInteractionMenu = new MiniMenu();

friendInteractionMenu.createOptionInRow({
    rows: [
        { text: "Interagir" },
        { text: "Adicionar Amigo" },
        { text: "Ver Perfil de Amigos" },
        { text: "Ver Lista de amigos" },
        { text: "Amizades Recentes" },
        { text: "Remover Amizade" },
        { text: "Voltar ao Perfil" },
    ],
});

friendInteractionMenu.createAction({
    actionKey: [1],
    callback: (system) => {
        const interact = P("Isso irá carregar os posts de seus amigos. Deseja continuar [1]? >> ").num();
        if (interact != 1) {
            P("Interação interrompida!").printColor();
            return;
        }
        const res = system.userSession[0].searchFriendsPosts();
        postAttributesMenu.printScreen();
        if (res.postId != -1) {
            const interactionOption = postAttributesMenu.getOption("num");
            const friendIdentifier = P("Selecione a ID do Amigo na Lista: ").num();
            const postIdentifier = P("Selecione ID do Post na Lista: ").num();

            postAttributesMenu.msgOnEntryPoint(interactionOption);

            if (res.friends.has(friendIdentifier) && res.postId.has(postIdentifier)) {
                if (!postAttributesMenu.actions.has(interactionOption)) return;
                postAttributesMenu.triggerAction(interactionOption).callback()(
                    system,
                    res.friends.get(friendIdentifier),
                    res.postId.get(postIdentifier),
                    interactionOption
                );
                P("Alterações aplicadas.").printColor();
                return;
            }
        }

        P("Não foi possível aplicar ações as opções escolhidas. Verifique os dados ou tente novamente.").printColor();
        return;
    },
});

friendInteractionMenu.createAction({
    actionKey: [2],
    callback: (system) => {
        const friendId = P("Adicionar amigo com #").num();
        system.addUserFriend(friendId);
    },
});

friendInteractionMenu.createAction({
    actionKey: [3],
    callback: (system) => {
        const friends = system.userSession[0].friends;
        if (friends.length == 0) {
            P("Você ainda não adicionou nenhum amigo").printColor();
            return;
        }
        friends.map((friend) => {
            friend.profile();
        });
        P("").print();
    },
});

friendInteractionMenu.createAction({
    actionKey: [4],
    callback: (system) => {
        system.users[system.session.profileIndex].myFriends();
    },
});

friendInteractionMenu.createAction({
    actionKey: [5],
    callback: (system) => {
        system.userSession[0].friends.length == 0
            ? P("Ainda não adicionou nenhum amigos").printColor()
            : system.userSession[0].newFriends
                  .map((friend) => {
                      if (friend != null) return friend;
                  })
                  .forEach((res) => {
                      if (res != null || res != undefined)
                          P(
                              `ID: ${res.id} > ${[res.firstName, res.lastName].join(" ")}  -- amigos desde: ${
                                  res.friendsSince
                              }`
                          ).inLine();
                  });
        P("").print();
    },
});

friendInteractionMenu.createAction({
    actionKey: [6],
    callback: (system) => {
        const friendId = P("ID: ").char();
        system.userSession[0].unFriend(friendId);
    },
});

module.exports = {
    friendInteractionMenu,
};

