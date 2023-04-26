const { MiniMenu, P } = require("../views/components/menus");

const postAttributesMenu = new MiniMenu();

postAttributesMenu.createOptionInRow({
    rows: [{ text: "Like" }, { text: "Comentar" }, { text: "Compartilhar" }],
});

postAttributesMenu.createAction({
    actionKey: [1, 2, 3],
    callback: (system, user, postIdentifier, option) => {
        for (let i = 0; i < system.users[user].posts.length; i++) {
            const post = system.users[user].posts[i];

            if (post.identifier == postIdentifier) {
                switch (option) {
                    case 1:
                        P("deixe vazio para dar Like").print();
                        const isLike = P("0 - unLike?").num();
                        post.UnOrLikePost(isLike != 0 ? 1 : -1);
                        break;
                    case 2:
                        const comment = P("Conteúdo do comentário: ").char();
                        post.commentPost(comment, system.userSession[0].firstName, system.userSession[0].id);
                        break;
                    case 3:
                        post.shared++;
                        P(
                            "Compartilhamentos não são dinâmicos, mas você pode acompanhar quantas pessoas compartilharam."
                        ).printColor();
                        P("Post Compartilhado!").print();
                        break;
                    default:
                        break;
                }
                return;
            }
        }
    },
});

const postMenu = new MiniMenu();
postMenu.createOptionInRow({
    rows: [
        { text: "Ver Ultimos Posts" },
        { text: "Adicionar Post" },
        { text: "Procurar meu Post" },
        { text: "Excluir Post" },
        { text: "Voltar ao Perfil" },
    ],
});

postMenu.createAction({
    actionKey: [1],
    callback: (system) => {
        system.userSession[0].userLatestPosts();
    },
});

postMenu.createAction({
    actionKey: [2],
    callback: (system) => {
        const title = P("Título do Post: ").char();
        const content = P("Conteúdo do Post: ").char();
        const posted = system.handleUserPost("new", system.session.profileIndex, {
            postTitle: title,
            postContent: content,
        });
        if (!posted) {
            P("Algo deu errado. tente novamente").printColor();
            return;
        }
        P(`Post criado!`).printColor();
    },
});

postMenu.createAction({
    actionKey: [3],
    callback: (system) => {
        const title = P("Título do Post: ").char();

        const res = system.handleUserPost("search", system.session.profileIndex, { postTitle: title });

        if (res.has(-1)) {
            P(
                "Não foi possível aplicar ações as opções escolhidas. Verifique os dados ou tente novamente."
            ).printColor();
            return;
        }

        postAttributesMenu.printScreen();
        const postOption = postAttributesMenu.getOption("num");
        const postIdentifier = P("Selecione ID da Lista ").num();
        if (res.has(postIdentifier)) {
            if (!postAttributesMenu.actions.has(postOption)) return;
            postAttributesMenu.triggerAction(postOption).callback()(
                system,
                system.session.profileIndex,
                res.get(postIdentifier),
                postOption
            );
            P("Alterações aplicadas.").printColor();
            return;
        }
        P('Nada foi feito.').printColor();
    },
});

postMenu.createAction({
    actionKey: [4],
    callback: (system) => {
        const idPost = P("id: #").char();
        system.handleUserPost("remove", system.session.profileIndex, { removeID: idPost });
    },
});

postMenu.createAction({
    actionKey: [5],
    callback: () => {
        P("Redirecionado ao Perfil.").printColor();
    },
});

module.exports = {
    postAttributesMenu,
    postMenu,
};
