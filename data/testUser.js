const generateCPF = () => {
    let cpf = "";
    while (cpf.length < 9) cpf += Math.floor(Math.random() * 9);
    const digit = (s) => (s % 11 < 2 ? 0 : 11 - (s % 11));
    let first = 0;
    let second = 0;
    for (let i = 0; i < 9; i++) first += cpf.charAt(i) * (10 - i);
    cpf += digit(first);
    for (let j = 0; j < 10; j++) second += cpf.charAt(j) * (11 - j);

    return (cpf += digit(second))
        .substring(0, 3)
        .concat(".", cpf.substring(3, 6), ".", cpf.substring(6, 9), "-", cpf.substring(9));
};

const validateCPF = (cpf = "") => {
    const calcCpf = cpf.replace(/[\.\-]/g, "");
    const rx = new RegExp(/\d{3}\.\d{3}\.\d{3}\-\d{2}/);
    let first = 0;
    let second = 0;
    for (let i = 0; i < 9; i++) first += calcCpf.charAt(i) * (10 - i);
    for (let j = 0; j < 10; j++) second += calcCpf.charAt(j) * (11 - j);
    const digit = (s, x) => (s % 11 < 2 ? 0 : 11 - (s % 11)) == calcCpf.charAt(x);
    return digit(first, 9) && digit(second, 10) && rx.test(cpf);
};

function getCPF() {
    let validCPF = "";
    let isValid = false;
    do {
        validCPF = generateCPF();
        isValid = validateCPF(validCPF) == 0 ? false : true;
    } while (isValid == false);
    return validCPF;
}

const names = `Luiz Otávio Rodrigues,André Pereira,João Lucas Porto,Emanuel Mendes,Ana Lívia Fernandes,
Eloah Ribeiro,Raquel Dias,Natália Almeida,Milena Sales,Giovanna Sales,
Luiz Fernando Cardoso,Gabriel Fernandes,Maria Cecília Martins,Clara Melo,Samuel da Rocha,
Diego da Mata,Fernando Dias,Luiz Otávio Moreira,Vitor Campos,Maria Julia das Neves,Caio das Neves,
Thomas da Mata,Renan Cardoso,Pietro das Neves,Emilly Almeida,Lorenzo Ferreira,Yuri Castro,
Alexandre Lopes,João Lucas Pereira,Joaquim da Rosa,Agatha da Luz,Thiago da Cunha,
Stella Moraes,Agatha Teixeira,Nicole Sales,Isis Farias,Vicente Novaes,Gustavo Henrique da Mota,
Luiz Fernando Rodrigues,Marcela Rodrigues,Isaac Aragão,Noah da Cruz,Ian Oliveira,Ana Clara Rezende,
Sophie Silva,Ana Jesus,Rafael Fogaça,Luiz Miguel Peixoto,Brenda Ferreira,Helena Moraes,Luiz Felipe Dias,
Nicole Moraes,Giovanna Rezende,Marcelo Cardoso,Nina Novaes,Gustavo Teixeira,Vitor Gabriel Fogaça,
Gabrielly Farias,Ana Vitória Cardoso,Henrique Fogaça,Maitê Gonçalves,Maria Luiza da Cunha,Maria Sophia Cardoso,
Maria Alice Castro,Lucas Lima,Alexandre das Neves,Manuela Pereira,Lucas Ferreira,Ana Vitória das Neves,
Lucca Rodrigues,Sarah Silva,Vitor Gabriel Castro,Emilly Fernandes,Isaac Almeida,Maria Luiza Dias,
Maria Santos,Juliana Peixoto,Mariana Vieira,Luiz Felipe Lopes,Rafaela Azevedo,Nicolas Rodrigues,Enzo Novaes,
Fernanda Fogaça,Samuel da Paz,Amanda Azevedo,Lorenzo Cardoso,Nathan Fernandes,Kevin Jesus,Lucas da Rocha,
Clara Jesus,Breno Monteiro,Maitê Melo,Larissa da Conceição,Maria Cecília Barbosa,Pedro Lucas Gonçalves,
Antônio Araújo,Ana Sophia Duarte,Samuel Ferreira,Rebeca da Costa,Diogo Rocha,Lucas Gabriel da Luz,Breno da Cruz,João Guilherme Lima,
Ana Beatriz Carvalho,Renan Cardoso,Pedro Lucas da Luz,Lavínia Viana,Ryan Moraes,Marcelo Ferreira,Alice Correia,Isis Ramos,João Gabriel Alves,
Júlia Lima,Igor da Costa,Eloah da Cruz,Vitor Gabriel da Mata,Alana da Luz,Camila Dias,Brenda Martins,
Enzo Gabriel Aragão,Maria Cecília Teixeira,Alana Souza,Ana Moura,Emanuella Freitas,Vitória Moura,Raul Nascimento,
Danilo Porto,Ana Luiza Fogaça,Amanda Cunha,Pietro Pinto,Danilo Souza,Benjamin Cunha,Juliana Melo,Nina Viana,
Maitê Porto,Caio Cavalcanti,Ana Julia Viana,João Felipe da Costa,Júlia Pinto,Otávio Correia,
Diogo Correia,Ryan Vieira,Lorena Nascimento,Enrico da Luz,Igor da Costa,Kaique Rodrigues,Vitória Lima,Pietra Novaes,
Ana Julia Farias,Sophie Martins`.split(",");

const tel = () => Math.floor(Math.random() * 9);
const month = () => Math.floor(Math.random() * 12 + 1);
const day = (m) => Math.floor(Math.random() * (m == 2 ? 28 : 30) + 1);
const year = () => Math.floor(Math.random() * 100 + 1923);
const homeNumber = () => Math.floor(Math.random() * 1000);

const format = (num, interval = 10) => {
    const zeros = interval.toString().length;
    const ocupados = num.toString().length;
    let str = "";
    while (str.length < zeros - ocupados) str += "0";
    return num < interval ? str + num : num;
};
const testadrs = (a) => {
    return ["Brazil", "88200-000", "SC", "Tijucas", "Centro", "15 Novembro", `${a}`];
};

const testUsers = names.map((u) => {
    const mes = month();
    return {
        user: [
            u.split(" ")[0].trim(),
            u.split(" ").map((n, i) => {
                    if (i != 0) return n;
                }).join(" ").trim(),
            u.split(" ").join("").trim().concat("@gmail.com").toLocaleLowerCase(),
            u.split(" ")[0].trim().concat("*123"),
            `${format(day(mes))}/${format(mes)}/${year()}`,
            getCPF(),
            `${[9, tel(), tel(), tel(), tel()].join("")}-${[tel(), tel(), tel(), tel()].join("")}`,
            testadrs(format(homeNumber(), 1000)),
        ],
    };
});

module.exports = testUsers;
