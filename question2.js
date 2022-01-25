const checkSamePlane = (queen1, queen2, queens) => { // Verifica se a rainha está no mesmo plano em uma reta
  const verify = queen1.filter((position, index) => position === queen2[index]); //Realiza a verificação comparando se 2 valores possuem o mesmo valor e posição

  const verify2 = queens.some((array) => (array[0] === queen2 && array[1] === queen1)
    || (array[0] === queen1 && array[1] === queen2)); // Verifica se as 2 peças já foram comparadas;

  if(verify2) return false; // Caso já tenham sido comparadas retorna false

  if(verify.length === 2) return true; // Caso o filtro ache 2 peças com 2 valores e posições iguais, retorna true
  return false;
}

const checkSameDiagonal = (queen1, queen2, queens) => { // Verifica se a rainha está na mesma diagonal de um plano
  const queenOnePosition = queen1.filter((position, index) => position !== queen2[index])
    .reduce((acc, value) => acc + value, 0);  // Remove o valor igualitario da posição e soma os 2 diferentes.
  const queenTwoPosition = queen2.filter((position, index) => position !== queen1[index])
    .reduce((acc, value) => acc + value, 0); // Remove o valor igualitario da posição e soma os 2 diferentes.
  
  const verify = queens.some((array) => (array[0] === queen2 && array[1] === queen1)
    || (array[0] === queen1 && array[1] === queen2)); // Verifica se as 2 peças já foram comparadas;

  if(verify) return false; // Caso já tenham sido comparadas retorna false

  return queenOnePosition === queenTwoPosition; // Retorna se os valores somados são iguais, caso sejam estão na mesma diagonal
}

const checkSamePlaneOrDiagonal = (queen1, queen2, queens) => { // Verifica se as rainhas estão em 1, 2 ou nenhum plano igual
  const verify = queen1.filter((position, index) => position === queen2[index]);

  if(verify.length === 2) return checkSamePlane(queen1, queen2, queens);
  if(verify.length === 1) return checkSameDiagonal(queen1, queen2, queens);
  return false;
}

function Queens3D(queens) { // Função solicitado pelo exercicio, em um xadrez em 3D, quantas rainhas podem se atacar em uma reta ou diagonal
  const QUEENS = queens.map((queen) => queen.replace('(', '')
    .replace(')', '').split(',').map((n) => Number(n))); // Re-cria o array, com os valores das posições da rainha, dentro de um outro array

    const DONE_VERIFY_QUEENS = []; // Array onde será armazenado as rainhas que podem se atacar.
  QUEENS.filter((array1, index1) => { // Realiza a verificação de todas as rainhas e adiciona ao array de armazenamento.
    let array2 = [];
    const verify = QUEENS
      .filter((array, index2) => {
        const verify2 = index1 !== index2 && checkSamePlaneOrDiagonal(array1, array, DONE_VERIFY_QUEENS);
        if(verify2) array2 = array;
        return verify2;
      });
    if(verify) DONE_VERIFY_QUEENS.push([array1, array2]);
    return verify;
  });

  const results = DONE_VERIFY_QUEENS // Re-cria o array, para o formato inicial, com os pares que podem se atacar juntos nas posições.
    .filter((array) => array[0].length !== 0 && array[1].length !== 0)
    .map((array) => {
      return (`(${array[0].toString()})(${array[1].toString()})`);
    });
  return results;
};

// Exemplos dados no exercicio
Queens3D(["(2,1,5)","(4,3,3)","(6,3,1)","(8,4,2)",
"(3,4,7)","(1,6,2)","(7,7,7)","(5,8,1)"]);
Queens3D(["(2,1,5)","(5,4,3)","(2,2,2)","(1,8,4)",
"(3,4,5)","(1,8,3)","(7,7,7)","(1,5,8)"]);
Queens3D(["(2,1,2)","(4,2,8)","(6,3,1)","(8,4,5)",
"(3,5,7)","(1,6,5)","(7,7,3)","(5,8,2)"])

// OBS: As respostas trazem os mesmos resultados do exemplo do exercicio, porém não na mesma ordem do exemplo.