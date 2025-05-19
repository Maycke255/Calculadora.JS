// Primeiro vamos pegar algumas variaveis importantes que usaremos no codigo
// Primeiro pegamos todas as possiveis teclas que o usuario irá digitar no campo de operação, que na verdade são as teclas presentes no teclado da calculadora
const keys = [`(`, `)`, `+`, `-`, `.`, `/`, `*`, `%`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]

const switchTheme = document.getElementById(`switchTheme`)
const operation = document.getElementById(`operation`)
const resultInput = document.getElementById(`result`)
const copyToClipboard = document.getElementById(`copy`)
const body = document.querySelector(`body`)
const equal = document.getElementById(`equal`)

/* Após isso, verificamos a preferencia do usuario, verificamos a preferencia que esta implantada no navegador e no seu dispositivo, para alterar o dataset
 para facilitar o reconhecimento do botão de troca de tema na pagina */
function checkPreferesTheme (ev) {
    ev.preventDefault()

    /* Primeiro verificamos a preferencia do tema do usuario, window refere-se a janale/navegador do usuario, matchMedia e uma API uqe verifica as condições
    da midia do navegador, matches retorna true se a condição for verdadeira */
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches;
    const body = document.body

    // Por fim, fazemos uma alteração, caso a preferencia do usuario seja dark, ele irá mudar para dark e virse versa
    if (prefersDark) {
        body.dataset.theme = `dark`
    } else {
        body.dataset.theme = `light`
    }
}

document.addEventListener(`DOMContentLoaded`, checkPreferesTheme);

switchTheme.addEventListener(`click`, function () {
    const icon = switchTheme.querySelector(`.theme-icon`);
    icon.textContent = body.dataset.theme === `dark` ? `☀️` : `🌙`

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

document.querySelectorAll(`.character`).forEach (function (charKeys){
    charKeys.addEventListener(`click`, function () {
        const value = charKeys.dataset.key
        operation.value += value
    })
})

document.getElementById(`clear`).addEventListener(`click`, function () {
    operation.value = ``
    resultInput.value = ``
    resultInput.classList.remove(`error`)

    document.getElementById(`copy`).innerText = `Copy`
    document.getElementById(`copy`).classList.remove(`copied`)

    operation.focus()
})

operation.addEventListener(`keydown`, function (ev) {
    //ev.key não e nada mais nada menos que a tecla que foi precionada, no caso "evento tecla", ou tecla a ser precionada
    ev.preventDefault()

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
})

document.getElementById(`equal`).addEventListener(`click`, function () {
        if (!operation.value.trim()) {
            operation.focus();
            operation.classList.add('error');

            setTimeout(function () { 
                operation.classList.remove('error')}, 1000);
        return;
    }
    calculate()
})

function calculate () {
        resultInput.classList.remove(`error`)  

    if (!operation.value.trim()) {
        resultInput.value = "Digite uma operação";
        resultInput.classList.add('error');
        return;
    }
    
    try {
        let expression = operation.value
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

        expression = expression.replace(/([\d\.]+)%/g, '($1/100)');
        expression = expression.replace(/([\*\/\+\-])([\d\.]+)%/g, '$1($2/100)');

        if (expression.match(/(\d+\.\d*\.|\d*\.\d+\.)/)) {
            throw new Error("Ponto decimal inválido");
        }

        const parentesesAbertos = (expression.match(/\(/g) || []).length;
        const parentesesFechados = (expression.match(/\)/g) || []).length;
        if (parentesesAbertos !== parentesesFechados) {
            throw new Error("Parênteses desbalanceados");
        }

        const result = eval(expression)

        if (isNaN(result)) {
            throw new Error("Operação inválida");
        }

        resultInput.value = result

        resultInput.classList.remove('error');
    } catch (error) {
        resultInput.value = `ERROR`
        resultInput.classList.add(`error`)  

        console.error("Erro de cálculo:", error);
    }
}

document.getElementById(`copy`).addEventListener(`click`, function (ev) {
    const button = ev.currentTarget

    if (button.innerText === `Copy`) {
        button.innerText = `Copied!`
        button.classList.add(`copied`)
        navigator.clipboard.writeText(resultInput.value)
    } else {
        button.innerText = `Copy`
        button.classList.remove(`copied`)
    }
})