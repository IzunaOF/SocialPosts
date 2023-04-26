const { P } = require("../views/components/menus");

class PostsSchema {
    constructor(title, content, writer, writerID) {
        this.writer = writer;
        this.writerID = writerID;
        this.content = content;
        this.title = title;
    }
}

class Comments {
    constructor(content, writer, writerID) {
        this.writer = writer;
        this.writerID = writerID;
        this.content = content;
        this.likes = 0;
        this.updatedAt = new Date().toISOString().replace("T", " / ").substring(0, 19);
        this.createdAt = new Date().toISOString().replace("T", " / ").substring(0, 19);
    }
    UnOrLikeComment(n = 1) {
        this.likes += n;
    }
    updateCommentMesssage(newContent) {
        this.content = newContent;
        this.updatedAt = new Date().toISOString().replace("T", " / ").substring(0, 19);
    }
}
class Posts extends Comments {
    constructor(id, title, content, writer, writerID) {
        super(content, writer, writerID);
        this.identifier = id;
        this.title = title;
        this.totalPosts = 0;
        this.coments = new Map();
        this.shared = 0;
    }
    commentPost(comment, writer, writerID) {
        if (writerID == this.writerID) writer = "Você";
        this.coments.set(this.totalPosts++, new Comments(comment, writer, writerID));
    }
    UnOrLikePost(n) {
        this.likes += n;
    }
    viewPost() {
        P("", `PostID: ${this.identifier}`, `Título: ${this.title}`, `Conteúdo: '${this.content} '`).inLine();
        P(`\t\tlikes: ${this.likes}, shared: ${this.shared}`, `\tUltima Modificação: ${this.updatedAt}`).inLine();
        P(`Comentários:`).print();
        if (this.coments.size == 0) {
            return P("Ninguem comentou ainda.", "--").inLine();
        }
        this.coments.forEach((c) => {
            P(
                "   --",
                `  ${c.writer} comentou: ' ${c.content} '`,
                `\tlikes:${c.likes} verPerfil: ${c.writerID}`,
            ).inLine();
        });
    }
}

module.exports = {
    Posts,
    Comments,
    PostsSchema,
};
