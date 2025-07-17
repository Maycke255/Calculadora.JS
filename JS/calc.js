// Primeiro vamos pegar algumas variaveis importantes que usaremos no codigo.

/* Inportação das operações */
import calculate, {keys, switchTheme, operation, resultInput, copyToClipboard, body, equal, checkPreferesTheme, 
    menuCalculate, equalBtn, copyToClipboardBtn
} from "./operations.js"

/* Esse aqui e um evento que é disparado quando o navegador terminou de carregar e analisar completamente o documento HTML ele ocorre quando toda a 
estrutura DOM está pronta, mas antes de imagens e outros recursos externos terminarem de carregar, nesse caso garante que a função checkPreresTheme 
só será executada quando o elemento <body> estiver disponível no DOM. */
document.addEventListener(`DOMContentLoaded`, checkPreferesTheme);

// Função do botão de trocar tema
switchTheme.addEventListener(`click`, function () {
    const icon = switchTheme.querySelector(`.theme-icon`);
    /* Operador ternario para trocar os icones do botão, no caso ele pega o conteudo do texto, em seguida acessa o dataset presente no body e verifica
    se e igual a dark, caso seja igual, ele vai deixar uma lua, caso não seja igual a dark, ele deixará um sol. */
    icon.textContent = body.dataset.theme === `dark` ? `☀️` : `🌙`

    /* Verificação do tema da pagina para alterar o tema, no caso, se o dataset for igual a dark no momento, e o usuario clicar no botão, ele vai remover
    o tema dark e adicionar o tema dark e mudar o dataset para light. A mesma coisa para o light, caso o dataset seja light e ele clique no botão. */
    if (body.dataset.theme === `dark`) {
        body.classList.remove(`dark-theme`)
        body.classList.add(`light-theme`)
        body.dataset.theme = `light`
    } else {
        body.classList.remove(`light-theme`)
        body.classList.add(`dark-theme`)
        body.dataset.theme = `dark`
    }
})

/* Essa aqui já e uma função mais simples e direta, fazemos um foreach em todas as teclas que colocamos no HTML, essa função serve para relacionar-mos o 
display de operação com as teclas virtuais da tela, para que as teclas clicadas apareçam no display da calculadora, a forEach nesse caso retorna uma node
list, uma coleção de elementos, chamamos essa coleção de charKeys, e para cada elemento dessa nodeList adicionamos uma função de lick, ou seja, para cada
tecla clicada com o mouse ele vai pegar o valor do dataset no DOM que nada mais é que o valor daquela tecla, e reatribui ao operation.*/
document.querySelectorAll(`.character`).forEach (function (charKeys){
    charKeys.addEventListener(`click`, function () {
        const valueKey = charKeys.dataset.key
        operation.value += valueKey
    })
})

/* Função para o botão clear, limpa o campo da operation e do result, também tiramos a classe error e colocamos o texto copy no botão de copiar para a area
de transferencia e removemos sua classe, e depois damos um focus na operation */
document.getElementById(`clear`).addEventListener(`click`, function () {
    operation.value = ``
    resultInput.value = ``
    resultInput.classList.remove(`error`)

    document.getElementById(`copy`).innerText = `Copy`
    document.getElementById(`copy`).classList.remove(`copied`)

    operation.focus()
})

operation.addEventListener(`keydown`, menuCalculate(ev))

// Botão de igual
document.getElementById(`equal`).addEventListener(`click`, equalBtn)

document.getElementById(`copy`).addEventListener(`click`, copyToClipboardBtn)