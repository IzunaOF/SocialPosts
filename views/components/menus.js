class Message {
    constructor(msg) {
        this.says = msg;
    }
}
const prompt = require("prompt-sync")();
const P = (...str) => {
    const message = str.join(" ");
    const constructor = {
        print() {
            console.log(message);
        },
        printColor() {
            console.log(new Message(...str));
            console.log("--\n");
        },
        inLine() {
            console.log(str.join("\n"));
        },
        num() {
            return parseInt(prompt(message));
        },
        char() {
            return prompt(message);
        },
    };
    return constructor;
};

class Actions {
    constructor() {
        this.targets = [];
        this.actions = new Map();
    }
    createAction({ actionKey = [], callback }) {
        for (let i = 0; i < actionKey.length; i++) {
            this.actions.set(actionKey[i], { callback: () => callback });
            this.targets.push(actionKey[i]);
        }
        const acts = this.actions;
        const toTrigger = actionKey;
        const triggers = {
            triggerAct: function (target = toTrigger) {
                return acts.get(target[0]).callback();
            },
        };
        return triggers;
    }
    triggerAction(target) {
        return this.actions.get(target);
    }
}

class Options extends Actions {
    constructor(key, msg) {
        super();
        this.key = key;
        this.msg = msg;
    }
    newMessage(nMsg) {
        this.msg = nMsg;
    }
}

class MiniMenu extends Actions {
    constructor(submenu = null) {
        super();
        this.menu = new Map();
        this.submenu = submenu;
    }
    createOption({ key, text }) {
        const id = key || this.menu.size;
        this.menu.set(id, new Options(id, text));
    }
    createOptionInRow({ rows = [{ text: "" }], increaseIdBy = 1 }) {
        const whichPick = [];

        this.menu.forEach((a, x) => {
            whichPick.push(x);
        });
        whichPick.sort((a, b) => a - b).sort((a, b) => b - a);

        for (let i = 0, id = whichPick[0] || 0 + increaseIdBy; i < rows.length; i++, id += increaseIdBy) {
            this.menu.set(id, new Options(id, rows[i].text));
        }
    }
    getOption(type = "char") {
        const msg = "sys: Escolha > ";
        switch (type) {
            case "num":
                return P(msg).num();
            default:
                return P(msg).char();
        }
    }
    printScreen() {
        this.menu.forEach((opt, x) => {
            console.log(x, `${opt.msg}`);
        });
    }
    msgOnEntryPoint(p, errorMsg = "Escolha incorreta, por favor considerar apenas as ações listadas.") {
        if (!this.actions.has(p)) {
            P(errorMsg).printColor();
            return false;
        }
        P(`Executou: ${this.menu.get(p).msg}`).printColor();
    }
}

module.exports = {
    MiniMenu,
    Options,
    Actions,
    P,
    Message,
};
