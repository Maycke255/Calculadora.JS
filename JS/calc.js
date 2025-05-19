const keys = [`(`, `)`, `+`, `-`, `.`, `/`, `*`, `%`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]

const switchTheme = document.getElementById(`switchTheme`)
const operation = document.getElementById(`operation`)
const resultInput = document.getElementById(`result`)
const copyToClipboard = document.getElementById(`copy`)
const body = document.querySelector(`body`)
const equal = document.getElementById(`equal`)

function checkPreferesTheme (ev) {
    ev.preventDefault()

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const body = document.body

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
    if (!operation.value.trim()) {
        resultInput.value = "Digite uma operação";
        resultInput.classList.add('error');
        return;
    }
    
    try {
        let expression = operation.value
        .replace(/%/g, '/100*');

        expression = expression.replace(/(\d+)%/g, '($1/100)')
        .replace(/(\d+)%/g, '($1/100)');

        if (expression.match(/\..*\./)) {
            throw new Error("Ponto decimal inválido");
        }

        const result = eval(operation.value)

        if (isNaN(result)) {
            throw new Error("Operação inválida");
        }

        resultInput.value = result

        resultInput.classList.remove('error');
    } catch (error) {
        resultInput.value = `ERROR`
        resultInput.classList.add(`error`)
    
        resultInput.classList.remove(`error`)

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