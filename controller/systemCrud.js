const { admin } = require("../data/admin");
const { SystemControl } = require("../models/systemSys");
const { loginMenu } = require("./loginMenuControl");
const { mainMenu } = require("./mainMenuControl");
const { adminBoard } = require("./adminControl");
const testUserList = require("../data/testUser");
const { P } = require("../views/components/menus");
const { UserSchema, Adress } = require("../models/usersModel");
const { POSTS_TESTS_SCHEMA } = require("../data/posts");

const system = new SystemControl(admin, adminBoard, ["cpf", "email", "phone", "name", "dateFormat"]);

system.defaultMaks();
system.loginMaster(admin.firstName, admin.adminPassword);

system.createNewVerification({
    maskName: "password",
    callbackFn: (line) => {
        if (line.length < 7 && !line.match(/[A-Z]/g) && !line.match(/[0-9]+/g) && !line.match(/[\/\.\*\#\$\-]/g))
            return { status: false, message: "Formato de Senha incorreto" };
        if (line.length < 7) return { status: false, message: "Tamanho inválido" };
        if (!line.match(/[A-Z]/g)) return { status: false, message: "Deve conter Letras Maiúsculas" };
        if (!line.match(/[0-9]+/g)) return { status: false, message: "Deve conter [1] ou mais números" };
        if (!line.match(/[\/\.\*\#\$\-]/g))
            return { status: false, message: "Deve conter caracteres especiais. [ / | . | * | # | $ | - ]" };

        return { status: true };
    },
});

/* CONSTRUINDO DADOS PARA TESTE DA APLICAÇÃO */

system.adminBoard
    .createAction({
        actionKey: ["INSERIR-LISTA-DE-USUARIOS-PARA-TEST"],
        callback: () => {
            testUserList.forEach((user) => {
                const u = user.user;
                system.createUser(new UserSchema(u[0], u[1], u[2], u[3], u[4], u[5], u[6], new Adress(...u[7])), true);
            });
            const adrs = new Adress("Brazil", "88372-700", "SC", "Penha", "Centro", "Alvorada Santana", "0258");
            system.createUser(
                new UserSchema(
                    "Celine",
                    "Dakota",
                    "celineDK@estudante.com",
                    "Test*123",
                    "03/08/1998",
                    "111.444.777-35",
                    "(48)99223-7788",
                    adrs
                ),
                true
            );
            system.createUser(
                new UserSchema(
                    "Francisco",
                    "Feliciano",
                    "ciscoCiano@estudante.com",
                    "Test*123",
                    "03/08/1998",
                    "111.111.111-11",
                    "(48)99456-1234",
                    adrs
                ),
                true
            );
        },
    })
    .triggerAct()();

POSTS_TESTS_SCHEMA.forEach((post) => {
    system.responses++;
    const random = Math.floor(Math.random() * system.users.length);
    system.handleUserPost("new", system.users[random].id, { postTitle: post.title, postContent: post.content });
});

/* O SISTEMA COMEÇA AQUI */

const MiniSystem = () => {
    let entryOption = 0;

    const constructor = {
        execute: () => {
            let has = false;
            for (let i = 0, s = 0; i < system.users.length; i++) {
                const posts = system.users[i].posts;
                if (posts.length > 0) {
                    P("", "", `Publicado por ${system.users[i].firstName}. #${system.users[i].id}`).inLine();
                    posts[posts.length - 1].viewPost();
                    s++;
                    has = true;
                }
                if (s == 5) break;
            }
            if (has) P("Acima estão algumas das últimas publicações da plataforma.").printColor();

            P(`Foram criados [ ${system.users.length} ] usuários para teste`).print();
            P(
                "Login de test: 111.444.777-35   >>   Test*123",
                "ou\n",
                "Login de test: 111.111.111-11   >>   Test*123",
                "\n"
            ).print();

            do {
                loginMenu.printScreen();
                entryOption = loginMenu.getOption("num");
                if (entryOption == loginMenu.menu.size) return;

                loginMenu.msgOnEntryPoint(entryOption);
                if (loginMenu.actions.has(entryOption)) {
                    loginMenu.triggerAction(entryOption).callback()(system);
                }

                while (system.session.admin) {
                    system.adminBoard.printScreen();
                    const adminOption = system.adminBoard.getOption("num");

                    const sysMsg = `sys: Admin ${system.admin.adminName} atente-se ao menu!`;
                    if (system.adminBoard.actions.has(adminOption)) {
                        system.adminBoard.msgOnEntryPoint(adminOption);
                        system.adminBoard.triggerAction(adminOption).callback()(system);
                    } else P(sysMsg).printColor();
                }

                while (system.session.status && !system.session.admin) {
                    mainMenu.printScreen();
                    const entryMainOption = mainMenu.getOption("num");

                    mainMenu.msgOnEntryPoint(entryMainOption);
                    if (mainMenu.actions.has(entryMainOption)) {
                        mainMenu.triggerAction(entryMainOption).callback()(system);
                    }
                }
            } while (entryOption != loginMenu.menu.size);
        },
    };
    return constructor;
};

module.exports = {
    system,
    MiniSystem,
};
