const verifyMatrizNumbers = (matriz) => { // Verifica se a matriz só possui numeros 0
  const searchMatrizOfZero = matriz.every((line) => line.every((n) => n === '0')); // Realiza a validação da matriz
  return (searchMatrizOfZero);
};

const numberMoves = (line, position) => { // Movimenta os números dentro do array, encontrando a sequência com menos movimentos
  if (line.every((n) => n === '0')) return 0; // Caso a linha só possua 0, retorna o número 0;
  if (!line.some((n) => n === '1')) return 0; // Caso a linha não possua o número 1, retorna o número 0;
  let quantMoves = 0;
  const moveLeft = [...line];
  const moveRight = [...line];

  for (let index = 0; index < line.length; index += 1) { // Realiza um loop movimentando o array pela direita e esquerda.
    if (moveLeft[position] === '1' || moveRight[position] === '1') return quantMoves;
    quantMoves += 1;

    const lastItem = moveRight[moveRight.length - 1];
    moveRight.unshift(lastItem);
    moveRight.pop();

    const firstItem = moveLeft[0];
    moveLeft.push(firstItem);
    moveLeft.shift();
  }
  return 0;
};

const rotateMatriz = (matriz) => { // Rotaciona a matriz, deixando a parte vertical na horizonal e a horizontal na vertical
  const rotateMatriz = {};
  let newMatriz;

  matriz.forEach((__v, index) => rotateMatriz[index] = []); // Cria um objeto com a quantidade de linhas

  matriz[0].forEach((__number, indexCol) => { // Rotaciona a coluna para a linha
    for (let index = 0; index < matriz.length; index += 1) {
      rotateMatriz[indexCol].push(matriz[index][indexCol]);
    }
    return newMatriz = Object.values(rotateMatriz); // Seta a nova matriz rotacionada
  });

  return newMatriz;
};

function Closest12(matriz) { // Função solicitada no exercicio para busca do menor caminho do número 1 para o 2 dentro de uma matriz
  const matrizSplit = matriz.map((line) => line.split('')); // Separa a matriz, transformado a linha de string em uma array
  const matrizRotate = rotateMatriz(matrizSplit); // Cria uma matriz rotacionada

  if(verifyMatrizNumbers(matrizSplit)) throw new Error('Matriz inválida! A matriz não pode possuir somente o número 0'); // Verificação da matriz

  const lineAndColNumbers = { // Mapeamento de números, em sua linha e coluna especifica
    '1': {
      col: [],
      line: [],
    },
    '2': {
      col: [],
      line: [],
    },
  };


  matrizSplit.filter((line, index) => { // Preenche o mapeamento de linhas e colunas dos números
    line.forEach((number, i) => {
      const numberFilter =  (number === '1' || number === '2')
      if (numberFilter) {
        lineAndColNumbers[number].col.push(i + 1);
        lineAndColNumbers[number].line.push(index + 1)
      };
    });

    return line.some((number) => (number === '1' || number === '2'));
  });

  const numbersColsCounter = lineAndColNumbers['2'].col.map((position) => ( // Realiza a contagem das posições pelas colunas
    matrizSplit.filter((line) => numberMoves(line ,(position - 1)))
      .map((line) => numberMoves(line, (position - 1)))
  ));


  const numbersLinesCounter = lineAndColNumbers['2'].line.map((position) => ( // Realiza a contagem das posições pelas linhas
    matrizRotate.filter((line) => numberMoves(line ,(position - 1)))
      .map((line) => numberMoves(line, (position - 1)))
  ));

  const [calculateColsAndLines] = lineAndColNumbers['1'].line.map((number1, index1) => ( // Realiza o calculo sem movimentar pelo mapeamento de linhas e colunas
    lineAndColNumbers['2'].line.map((number2, index2) => {
      const n1 = number1 - number2;
      const n2 = lineAndColNumbers['1'].col[index1] - lineAndColNumbers['2'].col[index2];
      return Math.abs(n1 + n2);
    })
  ))[0].filter((n) => n !== 0).sort((a, b) => a - b);
  
  const inLines = ([].concat.apply([], numbersLinesCounter).length === 0 ? [0] // Concatena os arrays em um só
  :[].concat.apply([], numbersLinesCounter));
  
  const inCols = ([].concat.apply([], numbersColsCounter).length === 0 ? [0] // Concatena os arrays em um só
  :[].concat.apply([], numbersColsCounter));

  const inLinesCalculate = inLines.map((number, index) => number + (inCols[index] || 0)).sort((a, b) => a - b)[0]; // Realiza o calculo dos valores de linhas e colunas feitas pelo movimento do array
  
  return inLinesCalculate < calculateColsAndLines ? inLinesCalculate : calculateColsAndLines; // Volta o menor valor entre o mapeamento e o movimento pelo array
};


// Exemplos dados no exercicio
Closest12(["000", "100", "200"]);
Closest12(["0000", "2010", "0000", "2002"]);
Closest12(["2000", "0001", "1000", "0200"]);
Closest12(["10000", "00200", "00000", "02000", "00000"]);
Closest12(["10000", "01000", "00000", "00020", "00200"]);
// Closest12(["00000", "00000", "00000", "00000", "00000"]);
