const { Actions, P } = require("../views/components/menus");
const getUserPrompt = new Actions();

getUserPrompt.createAction({
    actionKey: ["createUser"],
    callback: () => {
        P(
            "Atente-se aos filtros Aplicados",
            "Nome: mínimo 3 letras",
            "CPF: 000.000.000-11",
            "Senha: deve ser maior que 7 e conter pelo menos [1] letra, [1] número, [1] character especial, ",
            "Data Nascimento: dd/mm/yyyy",
            "Email: email@dominio.com",
            "Telefone:  deve conter o DDD e {5}-{4} :: ex (00)12345-6789"
        ).inLine();
        P("Escreva as informações corretamente, este processo não pode ser interrompido.").printColor();

        const firstName = P("Primeiro nome: ").char();
        const lastName = P("Sobrenome: ").char();
        const birthday = P("Data Nascimento: ").char();
        const email = P("Email: ").char();
        const cpf = P("CPF: ").char();
        const phone = P("Telefone: ").char();
        const password = P("Senha: ").char();

        P("\nPreencha seu endreço corretamente").print();

        const country = P("País: ").char();
        const cep = P("CEP: 00000-000: ").char();
        const state = P("UF: ").char();
        const city = P("Cidade: ").char();
        const neighbor = P("Bairro: ").char();
        const street = P("Rua: ").char();
        const num = P("Numero da residencia: ").char();

        return {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            birthday: birthday,
            cpf: cpf,
            phone: phone,
            adress: [country, cep, state, city, neighbor, street, num],
        };
    },
});

module.exports = {
    getUserPrompt,
};
