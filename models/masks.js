class Utils {
    constructor(verifiableFields) {
        this.verify = verifiableFields;
        this.mask = new Map();
        this.templates = new Map();
    }
    defaultMaks() {
        this.verify.map((cm) => {
            switch (cm) {
                case "cpf":
                    this.mask.set("cpf", {
                        validate: (cpf = "") => {
                            const calcCpf = cpf.replace(/[\.\-]/g, "");
                            const rx = new RegExp(/\d{3}\.\d{3}\.\d{3}\-\d{2}/);

                            let first = 0;
                            let second = 0;

                            for (let i = 0; i < 9; i++) first += calcCpf.charAt(i) * (10 - i);
                            for (let j = 0; j < 10; j++) second += calcCpf.charAt(j) * (11 - j);
                            const digit = (s, x) => (s % 11 < 2 ? 0 : 11 - (s % 11) == calcCpf.charAt(x));

                            return digit(first, 9) && digit(second, 10) && rx.test(cpf);
                        },
                    });
                    break;
                case "email":
                    this.mask.set("email", {
                        validate: (email) => {
                            const rx = new RegExp(/[\w]+\@([\w]+\.)+\w/);
                            return rx.test(email);
                        },
                    });
                case "phone":
                    this.mask.set("phone", {
                        validate: (phone) => {
                            const rx = new RegExp(/^(\(\d{2}\))*\d{5}-\d{4}$/);
                            return rx.test(phone);
                        },
                    });
                    break;
                case "dateFormat":
                    this.mask.set("dateFormat", {
                        validate: (date) => {
                            const rx = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
                            return rx.test(date);
                        },
                    });
                    break;
                default:
                    this.mask.set("name", {
                        validate: (name) => {
                            const rx = new RegExp(/\D{3,}/);
                            return rx.test(name);
                        },
                    });
                    break;
            }
        });
    }
    createNewMask({ maskName, regex }) {
        this.mask.set(maskName, {
            validate: (line) => {
                const rx = new RegExp(regex);
                return rx.test(line);
            },
        });
    }
    createNewVerification({ maskName, callbackFn }) {
        this.mask.set(maskName, {
            callbackFn: callbackFn,
        });
    }
    useMask(maskName) {
        return this.mask.get(maskName);
    }
    getMaskTeamplate(mask) {
        return this.templates.get(mask);
    }
}

module.exports = { Utils };
