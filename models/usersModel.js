const { P } = require("../views/components/menus");
const { Posts } = require("./posts");

class Adress {
    constructor(country, BRcep, state, city, neighbor, street, number) {
        this.country = country;
        this.state = state;
        this.city = city;
        this.neighbor = neighbor;
        this.street = street;
        this.cep = BRcep;
        this.number = number;
    }
}

class UserSchema {
    constructor(firstName, lastName, email, password, birthday, cpf, phone, adress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.age = 0;
        this.birthday = birthday;
        this.cpf = cpf;
        this.phone = phone;
        this.adress = adress;
    }
}

class User {
    constructor(id, firstName, lastName, email, password, birthday, cpf, phone, adress) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.age = 0;
        this.birthday = birthday;
        this.cpf = cpf;
        this.phone = phone;
        this.adress = adress;
        this.online = true;
        this.postId = 0;
        this.posts = [];
        this.firstPublish = false;
        this.friends = [];
        this.newFriends = new Array(10).fill(null);
        this.logginDate = new Date().getFullYear();
        this.friendsSince = new Date().toISOString().replace("T", "/").substring(0, 19);
    }
    getAge(birth = this.birthday) {
        const birthdate = birth.split("/");
        const date = new Date();
        const birthDay = Number(birthdate[0]);
        const birthMonth = Number(birthdate[1]);
        const birthYear = Number(birthdate[2]);

        const year = date.getFullYear();
        const month = Number(date.toLocaleDateString().split("/")[1]);
        let yearsOnEarth = Number(year - birthYear);
        if (month < birthMonth || birthMonth == month) {
            yearsOnEarth--;
        }
        this.age = yearsOnEarth;
        return yearsOnEarth;
    }
    updateName({ first, last }) {
        this.firstName = first;
        this.lastName = last;
    }
    updateEmail(newEmail) {
        this.email = newEmail;
    }
    updateBirthday(newBirthday) {
        this.birthday = newBirthday;
        this.getAge();
    }
    updateCpf(newCpf) {
        this.cpf = newCpf;
    }
    updatePhone(newPhone) {
        this.phone = newPhone;
    }
    updateAdress(newAdress) {
        this.adress = newAdress;
    }
    setOnline() {
        this.online = !this.online;
    }
    addNewFriend(newFriendSchema) {
        this.friends.push(newFriendSchema);
        if (this.newFriends.length == 10) {
            this.newFriends.shift();
            this.newFriends.push(newFriendSchema);
        } else {
            this.newFriends.push(newFriendSchema);
        }
    }
    unFriend(unfriend) {
        for (let i = 0; i < this.friends.length; i++) {
            const u = this.friends[i];
            if (u.id == unfriend) {
                this.friends.splice(i, 1);
                for (let j = 0; j < this.newFriends.length; j++) {
                    const nF = this.newFriends[j];
                    if (nF != undefined && nF != null)
                        if (nF.id == unfriend) {
                            this.newFriends.splice(j, 1);
                        }
                }
            }
        }
    }
    myFriends() {
        if (this.friends.length == 0) P("Você ainda não adicionou nenhum amigo").printColor();
        else {
            this.friends.map((e) => {
                P(`ID: ${e.id} > ${[e.firstName, e.lastName].join(" ")} amigos desde: ${e.friendsSince}`).inLine();
            });
            P(`Você tem: ${this.friends.length} amigo(s)`).print();
            P("Lista de amigos acima.").printColor();
        }
    }
    addPost(post) {
        const identifier = "#" + this.postId++;
        const newPost = new Posts(identifier, post.title, post.content, post.writer, post.writerID);
        this.posts.push(newPost);
        return true;
    }

    removePost(identifier) {
        for (let i = 0; i < this.posts.length; i++) {
            const post = this.posts[i];
            if (post.identifier.split("#")[1] == identifier) {
                this.posts.splice(i, 1);
                P(`Post ${post.title} excluído com sucesso`).printColor();
                return true;
            }
        }
        return false;
    }
    searchPost(title) {
        const postsIds = new Map();
        if (this.posts.length <= 0) {
            P("Você ainda não publicou nada").printColor();
            return postsIds.set(-1, "noactions");
        }
        for (let i = 0; i < this.posts.length; i++) {
            const post = this.posts[i];
            if (post.title.includes(title)) {
                P(
                    `Título: ${post.title}`,
                    `lista ID: ${i}`,
                    `\t '${post.content} '`,
                    `\t\tlikes: ${post.likes} compartilhamentos: ${post.shared}`,
                    "--\n"
                ).inLine();
                postsIds.set(i, post.identifier);
            }
        }
        if (postsIds.size == 0) {
            P("Sem resultado...").printColor();
            return postsIds.set(-1, "noactions");
        }
        return postsIds;
    }
    userLatestPosts() {
        const len = this.posts.length;
        if (len == 0) {
            P(`Você ainda não publicou nada. aperte [2], Adicione um post e Compartilhe com seus amigos `).printColor();
            return;
        }
        for (let i = 0; i < len && 5; i++) {
            this.posts[i].viewPost();
        }
        P(`Aqui estão seus posts mais recentes, lista acima.`).printColor();
    }

    searchFriendsPosts() {
        if (this.friends.length == 0)
            return { postId: friendsPostsIds.set(-1, "noaction"), friends: userFriends.set(-1, "noaction") };

        const friendsPostsIds = new Map();
        const userFriends = new Map();

        for (let i = 0; i < this.friends.length; i++) {
            const friendPost = this.friends[i].posts;
            if (friendPost.length != 0) {
                P(`Posts de seu amigo: ${this.friends[i].firstName} ID: ${i}`).print();
                for (let j = 0; j < friendPost.length; j++) {
                    const post = friendPost[j];
                    P(
                        `Título: ${post.title}`,
                        `post ID: ${j}`,
                        `\t${post.content}`,
                        `likes: ${post.likes} compartilhamentos: ${post.shared}`,
                        "--\n"
                    ).inLine();
                    this.showAllPosts(i);
                    friendsPostsIds.set(j, post.identifier);
                    userFriends.set(i, this.friends[i].id);
                }
            }
        }
        return { postId: friendsPostsIds, friends: userFriends };
    }
    showAllFriendsPosts(index = 0) {
        if (this.friends[index].posts.length == 0) {
            P("Postagens: sem publicações.", "").inLine();
            return;
        }
        P(`Postagens: `).print();
        this.friends[index].posts.forEach((post) => {
            if (post.writerID != this.id) {
                post.viewPost();
            }
        });
    }
    showAllPosts() {
        if (this.posts.length == 0) {
            P("Postagens: sem publicações.", "").inLine();
            return;
        }
        P(`Postagens: `).print();
        this.posts.forEach((post) => {
            post.viewPost();
        });
    }
    profile() {
        const title = this.firstPublish
            ? " - -- - -- - -- - \n ${-- DINO's KEY - received for be the one who published}"
            : " - -- - -- - -- -";

        P(
            title,
            `ID: ${this.id}\t\t-> conectado desde: ${this.logginDate}`,
            `Nome: ${[this.firstName, this.lastName].join(" ")}`,
            `Email: ${this.email} `,
            `Idade: ${this.age}`,
            `Contato: ${this.phone} `
        ).inLine();
        this.showAllPosts();
    }
}
class Admin extends User {
    constructor(admin, adminPassword, id, firstName, lastName, email, password, age, cpf, phone, adress) {
        super(id, firstName, lastName, email, password, age, cpf, phone, adress);
        this.adminName = admin;
        this.adminPassword = adminPassword;
    }
}
module.exports = {
    User,
    Adress,
    Admin,
    UserSchema,
};
