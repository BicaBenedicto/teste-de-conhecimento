-- (a) Qual ativo possui maior valor total, e qual a sua porcentagem em relação ao total
-- de posições?

SELECT 
  ativo, -- Seleciona a coluna de ativos
  SUM(p.valor) as valor_total, -- Soma o total de valores
  (count(fk) * 100/ (SELECT MAX(fk) FROM Posicoes LIMIT 1)) '% in fk' -- Realiza a porcentagem da quantidades de FK com o Maior número do FK, no caso 25
FROM Posicoes p -- Puxa as informações da tabela Posicoes
GROUP BY ativo -- Agrupa as informações por ativo

--------------------------------------------------------------------------------------------

-- (b) Qual cliente possui maior valor de ativos do tipo Ações (junte todas as Ações
-- diferentes), e qual esse valor?

SELECT 
  c.nome, -- Seleciona a cluna de nome
  COUNT(p.ativo) as 'Quant. Ativos' -- Selecione o valor(quantidade) de ativos do nome
FROM Posicoes AS p -- Puxa as informações de Posicoes
JOIN Investimentos AS i ON i.posicao_fk = p.fk -- Junta a tabela de Investimentos mesclando o i.posicao_fk com o p.fk de Posicoes e Investimentos
JOIN Clientes AS c ON c.id = i.cliente_id -- Junta a tabela de Investimentos mesclando o c.id com o i.cliente_id de Clientes e Investimentos
WHERE posicao_fk = p.fk -- Filtra os resultados pelo FK
AND c.id = i.cliente_id -- E pelo ID do cliente
GROUP BY i.cliente_id, c.nome -- Agrupa as informações pelo ID do cliente e Nome
ORDER BY COUNT(p.ativo) DESC LIMIT 1; -- Organiza a tabela pela quantidade de ativos, do maior para o menor e limita a primeira linha

--------------------------------------------------------------------------------------------

-- (c) Qual cliente possui maior valor total de investimentos, e qual o valor que ele possui
-- em cada ativo?

SELECT 
  c.nome, -- Seleciona a cluna de nome
  SUM(p.valor) AS 'Total valor ativos', -- Selecione a soma total do valor de ativos
  GROUP_CONCAT(p.ativo, ' R$ ', p.valor SEPARATOR ' | ') AS 'Ativos e Valores' -- Concatena em uma coluna todos os ativos e valores separados por |
FROM Posicoes AS p -- Puxa as informações de Posicoes
JOIN Investimentos AS i ON i.posicao_fk = p.fk -- Junta a tabela de Investimentos mesclando o i.posicao_fk com o p.fk de Posicoes e Investimentos
JOIN Clientes AS c ON c.id = i.cliente_id -- Junta a tabela de Investimentos mesclando o c.id com o i.cliente_id de Clientes e Investimentos
WHERE posicao_fk = p.fk -- Filtra os resultados pelo FK
AND c.id = i.cliente_id -- E pelo ID do cliente
GROUP BY c.nome -- Agrupa as informações pelo Nome
ORDER BY SUM(p.valor) DESC LIMIT 1; -- Organiza a tabela pelo valor total dos ativos, do maior para o menor e limita a primeira linha
