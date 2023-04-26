const { User, Adress } = require("./usersModel");
const { Utils } = require("../models/masks");
const { P } = require("../views/components/menus");
const { PostsSchema } = require("./posts");

class Session extends Utils {
    constructor(verifiableFields) {
        super(verifiableFields);
        this.userSession = new Array(1);
        this.session = {
            profileIndex: null,
            id: null,
            profileName: null,
            email: null,
            status: false,
            admin: false,
            data: [],
        };
    }
    setSession(user) {
        this.userSession.fill(user);
        const u = this.userSession.fill(user)[0];
        const s = this.session;
        s.profileIndex = u.id;
        s.id = u.cpf;
        s.profileName = u.firstName;
        s.email = u.email;
        s.status = true;
        s.admin = u.adminName ? true : false;

        return true;
    }
    dropSession() {
        this.userSession.fill(null);
        const s = this.session;
        s.profileIndex = null;
        s.id = null;
        s.profileName = null;
        s.email = null;
        s.status = false;
        s.admin = false;
        s.data = [];
    }
}

class SystemControl extends Session {
    constructor(admin, adminBoard, verifiableFields) {
        super(verifiableFields);
        this.AIKey = 0;
        this.users = [];
        this.admin = admin;
        this.adminBoard = adminBoard;
        this.responses = 0;
    }

    deleteAccountAsAdmin() {
        const user = P("Identificador da conta: ").char();
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].cpf == user) {
                this.users.splice(i, 1);
                P(`Conta excluida com exíto!`).printColor();
                P(`Você foi Redirecionado`).printColor();
                return;
            }
        }
        P(`Processo de interrompido! conteúdo informado não é válido! Verifique os dados informados.`).printColor();
    }
    searchUsersAsAdmin(admin, { search }) {
        if (admin != this.admin.adminName) return;
        let total = 0;
        this.users.forEach((u) => {
            if (u.firstName.includes(search) || u.lastName.includes(search) || u.cpf.includes(search)) {
                Object.entries(u).forEach((v) => {
                    if (
                        v[1] != null &&
                        v[1] != undefined &&
                        v[1] != "" &&
                        v[0] != "friends" &&
                        v[0] != "newFriends" &&
                        v[0] != "birthday" &&
                        v[0] != "age" &&
                        v[0] != "phone" &&
                        v[0] != "online" &&
                        v[0] != "postId"
                    )
                        if (v[0] == "adress") P(Object.values(v[1])).printColor();
                        else {
                            P(v[1]).print();
                        }
                });

                P(" *--*").inLine();
            }
            total++;
        });

        if (total == 0) return P("Sem resultados ").printColor();

        P(`Resultado da pesquisa acima`).printColor();
    }

    loginMaster(admin, password) {
        if (admin == this.admin.adminName && password == this.admin.adminPassword) {
            return this.setSession(this.admin);
        }
        return false;
    }

    login(id, password) {
        for (let i = 0; i < this.users.length; i++) {
            const u = this.users[i];
            if (u.cpf == id && u.password == password) {
                return this.setSession(u);
            }
        }
        return false;
    }

    createUser(schema, test = false) {
        const S = schema;
        const validUser = this.validations({
            names: [S.firstName, S.lastName],
            email: S.email,
            password: S.password,
            birthday: S.birthday,
            cpf: S.cpf,
            phone: S.phone,
        });
        if (validUser.status) {
            this.users.push(
                new User(this.AIKey, S.firstName, S.lastName, S.email, S.password, S.birthday, S.cpf, S.phone, S.adress)
            );
            this.AIKey++;
            this.users[this.users.length - 1].getAge();

            if (!test) P("Cadastro efetuado com sucesso!").printColor();

            return;
        }
        if (!test) {
            P(`${validUser.message || `Cadastro Interrompido! informações preenchidas são inválidas.`}`).printColor();
        }
        return validUser;
    }

    validations({ names = [], email = "", password = "", birthday = "", cpf = "", phone = "" }) {
        if (names.length == 0 || names[0] == " " || (email, password, birthday, cpf, phone) == "")
            return { status: false };

        for (let i = 0; i < names.length; i++) {
            if (!this.mask.get("name").validate(names[i])) return { status: false };
        }
        const hasCpf = this.users.find(u=>{
            return u.cpf == cpf
        })
        const validEmail = this.mask.get("email").validate(email);
        const validPassword = this.mask.get("password").callbackFn(password);
        const validBirthday = this.mask.get("dateFormat").validate(birthday);
        const validPhone = this.mask.get("phone").validate(phone);
        const validCpf = this.mask.get("cpf").validate(cpf);

        if (validCpf && validBirthday && validPhone && validEmail && validPassword.status && !hasCpf) {
            return { status: true };
        }
        return { status: false, message: validPassword.mesage };
    }

    searchUsers({ search }) {
        let total = 0;
        this.users.forEach((u) => {
            if (
                u.firstName.includes(search) ||
                u.lastName.includes(search) ||
                u.adress.city.includes(search) ||
                u.adress.neighbor.includes(search) ||
                u.id.toString().includes(search) ||
                u.friends.includes(this.userSession[0].friends.firstName)
            ) {
                P(
                    "",
                    `Perfil: #${u.id}`,
                    `Usuário: ${[u.firstName, u.lastName].join(" ")}`,
                    `Idade: ${u.age}`,
                    `Nascido em: ${u.birthday}`,
                    `Email: ${u.email}`,
                    `Telefone: ${u.phone}`,
                    `Endereço >> \n\tcidade:${u.adress.city}`,
                    `\tbairro: ${u.adress.neighbor}`,
                    `\trua: ${u.adress.street}`
                ).inLine();
            }
            total++;
        });

        if (total == 0) return P("Sem resultados ").printColor();

        P(`Resultado da pesquisa acima`).printColor();
    }
    updateUser({ userId, field, values }) {
        for (let i = 0; i < this.users.length; i++) {
            const u = this.users[i];
            const v = values[0] || [];

            if (u.cpf == userId) {
                const error = P("Formato inválido, tente novamente").printColor();
                switch (field) {
                    case 1:
                        if (this.mask.get("name").validate(values[0]))
                            u.updateName({ first: values[0], last: values.length > 1 ? values[1] : u.lastName });
                        else error;
                        break;
                    case 2:
                        if (this.mask.get("dateFormat").validate(v)) u.updateBirthday(v);
                        else error;
                        break;
                    case 3:
                        if (this.mask.get("password").callbackFn(v)) u.updatePassword(v);
                        else error;
                        break;
                    case 4:
                        if (this.mask.get("email").validate(v)) u.updateEmail(v);
                        else error;
                        break;
                    case 5:
                        if (this.mask.get("cpf").validate(v)) u.updateCpf(v);
                        else error;
                        break;
                    case 6:
                        if (this.mask.get("phone").validate(v)) u.updatePhone(v);
                        else error;
                        break;
                    case 7:
                        u.updateAdress(v);
                        break;
                    default:
                        P("Nenhuma alteração foi aplicada").print();
                        break;
                }
            }
        }
    }
    deleteUserFromSystem() {
        const user = P("CPF: ").char();
        if (user == this.session.id) {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].cpf == user) {
                    this.users.splice(i, 1);
                    P(`Conta excluida com exíto!`).printColor();
                    P(`Você foi Redirecionado`).printColor();
                    return true;
                }
            }
            P("Usuário não encontrado.").printColor();
            return false;
        }
        P(
            `Processo de interrompido! conteúdo informado não é válido! Verifique seus dados, ou se há uma sessão aberta.`
        ).printColor();
    }
    addUserFriend(friendId) {
        if (friendId == this.session.profileIndex) return P("Você não pode se adicionar").printColor();
        const isFriend = this.userSession[0].friends.find((friend) => {
            return friend.id == friendId;
        });
        if (isFriend) return P(`${isFriend.firstName} já está na sua lista de amigos.`).printColor();

        const friend = this.users.find((u) => {
            return u.id == friendId;
        });

        if (friend) {
            this.userSession[0].addNewFriend(friend);
            friend.addNewFriend(this.userSession[0]);
            P(`${friend.firstName} foi adicionado à sua lista de amigos!`).printColor();
            return;
        }
        P("Usuário inválido!").printColor();
    }

    unFriendUser(unfriend) {
        if (unfriend == this.session.profileIndex) return P("Você não pode se excluir").printColor();
        this.userSession[0].unFriend(unfriend);
    }

    showUserSessionProfile() {
        this.userSession[0].profile();
    }

    handleUserPost(useCase, user, { postTitle = "", postContent = "", removeID = "" }) {
        switch (useCase) {
            case "new":
                if (postContent.length == 0 || postTitle.length == 0) {
                    P("Você não pode publicar campos vazios.");
                    return false;
                }
                this.responses++;
                if (this.responses == 1) this.users[user].firstPublish = true;
                const userToPost = this.users[user];
                return userToPost.addPost(new PostsSchema(postTitle, postContent, userToPost.firstName, userToPost.id));
            case "remove":
                return this.users[user].removePost(removeID);
            case "search":
                return this.users[user].searchPost(postTitle);
            default:
                P("Requisição recusada pelo sistema!").printColor();
                break;
        }
    }
}

module.exports = {
    SystemControl,
};
