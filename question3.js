const fs = require("fs"); // Faz requisição para converter de json para csv e vice-versa
const csv = fs.readFileSync("CSV_file.csv"); // Le o arquivo csv
const DEFAULT_ARRAY = csv.toString().split("\n").map((line) => line.split('@')); // Transforma o arquivo em um array dentro de array

// --------------------------------------------------------------------------------------------------------------

// Questão 3 - A

const COLS_SELECTED= ['Código', 'Repac./Venc.', 'Índice/ Correção', 'taxa indicativa', 'PU', 'Duration']; // Array utilizado para a questão 3-A e 3-E, por pedir para usar o mesmo da 3-A, usado o solicitado no exercicio.

function Questao3A(ColsRequired, generateCSV = true)  {

	const header = {};
	DEFAULT_ARRAY[2].forEach((col, index) => {
		const value = col.replaceAll(' ', '').toLowerCase();
		return header[index] = value;
	}); // Gera o header com chave sendo index e o valor sendo o valor do cabeçalho

	const array = DEFAULT_ARRAY .map((line) => { // Transforma o array do arquivo em um array com objetos para melhor entendimento
		const lineObj = {};
		line.forEach((col, index) => {
			const position = header[index].replaceAll(' ', '').toLowerCase();
			return lineObj[position] = col;
		});
		return lineObj;
	});

	const QUESTION_3_A = ColsRequired.map((i) => i.replaceAll(' ', '').toLowerCase()); // Colunas solicitadas pelo exercicio;

	const result = array
		.filter((_v, index) => index !== 0 && index !== 1)
		.map((line) => Object.entries(line)
		.filter((item) => QUESTION_3_A.some((item2) => item[0] === item2))
		.map((item) => `| ${item[1]} |`).toString().replaceAll('|,', ''))
		.map((line) => `${line} \n `).toString().replaceAll(',|', '|'); // Filtra as colunas e a transforma no formato separado por |
	const json = JSON.stringify(result); // Transforma o resultado em json
	if(generateCSV) {
	fs.writeFileSync('Questão 3-A.csv', json); // Cria o arquivo CSV
	}
	return result;
};

Questao3A(COLS_SELECTED); // Valor solicitado pela questão

// Função aceita espaços e maisculas/minusculas (Acentuação é preciso estar correta, igual ao da tabela)
// Função dinâmina, podendo solicitar colunas diferentes das pedidas na questão

// --------------------------------------------------------------------------------------------------------------

// Questão 3 - B

const CDI_ANUAL = 0.0925;
const IPCA_ANUAL = 0.1074;


const calcTaxForDay = (taxa) => { // Pelo javascript ter uma certa instabilidade ao calcular números decimais,foi utilizado o precision para diminuir o tamanho do decimal chegando ao valor mais proximo da conta
	const value1 = (1 + taxa).toPrecision(2); // Valor dentro da raiz do exemplo do exercicio  (1 + taxa%a.a)
	const value2 = (1/252).toPrecision(2); // Valor que será utilizado em exponencial para criação de raiz

	return ((value1 ** value2) - 1); // Resultado final da raiz quadrada de 252 da taxa subtraindo 1;
};

// Calculo do exemplo: duraçao * (taxa informada * (252√(1 + taxa anual) - 1))
function Percent_CDI(taxa, duration) {
  const taxaCovert = taxa / 100;
	const CDI = (calcTaxForDay(CDI_ANUAL) * taxaCovert); // Multiplica a taxa anual convertida em dia com a taxa informada
	const result = (duration * CDI); // Multiplica o resultado da taxa diaria com os dias

	return result;
};

Percent_CDI(100, 252); 
Percent_CDI(105, 65);
Percent_CDI(113.87, 614.25);

// --------------------------------------------------------------------------------------------------------------

// Questão 3 = C

// Calculo do exemplo: duracao * (taxa informada + (252√(1 + taxa anual) - 1))
function Spread_CDI(taxa, duration) {
	const newTaxa = (taxa / 100) + CDI_ANUAL; // Soma a taxa informado com o CDI anual
	const result = (calcTaxForDay(newTaxa) * duration); // Multiplica a taxa anual convertida em dia com a duração
	return result;
};

Spread_CDI(0, 252);
Spread_CDI(1.3, 85);
Spread_CDI(0.82, 517.41);

// --------------------------------------------------------------------------------------------------------------

// Questão 3 = D

// Calculo do exemplo: duracao * (taxa informada + (252√(1 + taxa anual) - 1))
function Spread_IPCA(taxa, duration) {
	const newTaxa = (taxa / 100) + IPCA_ANUAL; // Soma a taxa informado com o IPCA anual
	const result = (calcTaxForDay(newTaxa) * duration); // Multiplica a taxa anual convertida em dia com a duração
	return result;
};

Spread_IPCA(0, 252)
Spread_IPCA(6.5, 104)
Spread_IPCA(4.293, 1468.24)

// --------------------------------------------------------------------------------------------------------------

// Questão 3 - E

function Questao3E(generateCSV = true) {
	const TABLE_QUESTAO_3_A = Questao3A(COLS_SELECTED, false);

	const INIT_ARRAY = TABLE_QUESTAO_3_A.split('\n').map((line) => { //Transforma a tabela da questão 3-a em um array
		return line.split('|').filter((i) => i && i !== ' ');
	});

	const array = INIT_ARRAY .map((line, index) => { // Adiciona a coluna final de TAXA_FINAl, com os seus respectivos valores
		if(index === 0) return [...line, 'TAXA_FINAL'];
		if(Number(line[5]) === NaN) return [...line, -1];

		const TAXA = (line[3] ? Number(line[3].replace(',', '.')) : undefined);
		const DURATION = (line[5] ? Number(line[5].replace(',', '.')) : undefined);
		const INDICE_CORRECAO = (search) => (line[2] ? line[2].toString().includes(search) : false);

		if(INDICE_CORRECAO('do DI')) return [...line, Percent_CDI(TAXA, DURATION).toPrecision(4)];
		if(INDICE_CORRECAO('DI +')) return [...line, Spread_CDI(TAXA, DURATION).toPrecision(4)];
		if(INDICE_CORRECAO('IPCA +')) return [...line, Spread_IPCA(TAXA, DURATION).toPrecision(4)];
		return [...line, -1];
	});

	const result = array
		.map((line) => `${line.map((item) => `| ${item} |`)
		.toString().replaceAll('|,', '')} \n `).toString().replaceAll(',|', '|'); // Filtra as colunas e a transforma no formato separado por |

	const json = JSON.stringify(result); // Transforma o resultado em json

	if(generateCSV) {
	fs.writeFileSync('Questão 3-E.csv', json); // Cria o arquivo CSV
	}

	return result;
}

// Questao3E();
