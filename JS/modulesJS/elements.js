/* Variaveis do DOM */ 
//Variaveis a serem usadas:
// Primeiro pegamos todas as possiveis teclas que o usuario irá digitar no campo de operação, que na verdade são as teclas presentes no teclado da calculadora.
const keys = [`(`, `)`, `+`, `-`, `.`, `/`, `*`, `%`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
const switchTheme = document.getElementById(`switchTheme`)
const operation = document.getElementById(`operation`)
const resultInput = document.getElementById(`result`)
const copyToClipboard = document.getElementById(`copy`)
const body = document.querySelector(`body`)
const equal = document.getElementById(`equal`)

//Exportando as variaveis
export {
  keys,
  switchTheme,
  operation,
  resultInput,
  copyToClipboard,
  body,
  equal
};