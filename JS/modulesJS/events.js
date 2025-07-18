/* Divisão do arquivo JS em três partes, uma ra função principal calculate, e esse aqui para os demais events */
//Importando as variaveis a serem usadas
import { keys, operation, resultInput } from './elements.js';
//Importando a função principal
import calculate from './operations.js';

/* Após isso, verificamos a preferencia do usuario, verificamos a preferencia que esta implantada no navegador e no seu dispositivo, para alterar o dataset
 para facilitar o reconhecimento do botão de troca de tema na pagina. */
function checkPreferesTheme (ev) {
    ev.preventDefault()

    /* Primeiro verificamos a preferencia do tema do usuario, window refere-se a janale/navegador do usuario, matchMedia e uma API uqe verifica as condições
    da midia do navegador, matches retorna true se a condição for verdadeira. */
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches;
    const body = document.body

    // Por fim, fazemos uma alteração, caso a preferencia do usuario seja dark, ele irá mudar para dark e virse versa.
    if (prefersDark) {
        body.dataset.theme = `dark`
    } else {
        body.dataset.theme = `light`
    }
}

//Função de realizar uma operação para a calculadora funcionar:
function menuCalculate (ev) {
    //ev.key não e nada mais nada menos que a tecla que foi precionada, no caso "evento tecla", ou tecla a ser precionada
    ev.preventDefault()

    /* Essas são as verificações servem para verificar as teclas pressionadas pelo usuario
    A primeira serve para impedir que o usuario digite qualquer coisa dentro da operation, como letras, simbolos, entre outros. Usamos o includes, um me-
    todo de array, para verificar se a tecla pressionada pelo usuario existe naquele array, se existir, ela reatribui a tecla a operation.

    A segunda verificação e para exclusão de algum item da operation, caso o usario pressione a tecla de backspace o valor presente na propria operation
    vai ser igual a propria operation -1 caractere.
    
    A terceira e caso ele pressione a tecla enter vai chamar a função calculate.*/
    if (keys.includes(ev.key)) {
        operation.value += ev.key
        return;
    }

    if (ev.key === "Backspace") {
        operation.value = operation.value.slice(0, -1);
        return;
    }

    if (ev.key === "Enter") {
        calculate();
        return;
    }
}

//Função para o botão de igual
function equalBtn () {
    /* Verificação para ver se há espaços no value do operation, o operador de negação retorna um resultado booleano invertido, ele inverte o resultado
    strings vazias são falsy e strings não vazias são truthy, caso haja vai dar um erro */
    if (!operation.value.trim()) {
        operation.focus();
        operation.classList.add('error');

        /* Setamos um tempo para remover a classe, ou seja ela aparece e em seguida e removida apos 1000 (1000ms = 1 segundo), setTimeout e uma função
        que precisa se uma função callBack logo em seguida para funcionar, ditamos primeiro o que queremos remover e em seguida removemos apos o tempo
        definido */
        setTimeout(function () { 
            operation.classList.remove('error')
        }, 1000);
        return;
    }
    calculate()
}

//Função para o botão de copiar:
function copyToClipboardBtn (ev) {
    // ev.currentTarget → refere-se ao elemento que disparou o evento (o botão)
    const button = ev.currentTarget

    // resumo, se for igual a copy ele copia o texto e muda a classe para copied, caso esteja copied, muda para copy novamente e remove a classe, funciona como um interruptor
    if (button.innerText === `Copy`) {
        button.innerText = `Copied!`
        button.classList.add(`copied`)
        // navigator.clipboard.writeText() → API moderna para copiar texto
        navigator.clipboard.writeText(resultInput.value)
    } else {
        button.innerText = `Copy`
        button.classList.remove(`copied`)
    }
}

//Exportando as variaveis
export {
    checkPreferesTheme,
    menuCalculate,
    equalBtn,
    copyToClipboardBtn
};