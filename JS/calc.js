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

document.getElementById(`equal`).addEventListener(`click`, calculate)

function calculate () {
    resultInput.value = `ERROR`
    resultInput.classList.add(`error`)

    const result = eval(operation.value)
    resultInput.value = result
    
    resultInput.classList.remove(`error`)
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