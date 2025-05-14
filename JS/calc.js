const keys = [`parentheses1`, `parentheses2`, `division`, `seven`, `eight`, `nine`, `multiplication`, `four`, `five`, `six`, `subtraction`, `one`, `two`, `three`, `sum`, `zero`, `point`, `percentage`, `equal`]

const switchTheme = document.getElementById(`switchTheme`)
const clear = document.getElementById(`clear`)
const operation = document.getElementById(`operation`)
const result = document.getElementById(`result`)
const copyToClipboard = document.getElementById(`copy`)

const body = document.querySelector(`body`)

switchTheme.addEventListener(`click`, function () {
    if (body.dataset.theme = `dark`) {
        body.classList.remove(`dark-theme`)
        body.classList.add(`light-theme`)
        body.dataset.theme = `light`
    } else {
        body.classList.remove(`light-theme`)
        body.classList.add(`dark-theme`)
        body.dataset.theme = `dark`
    }


    switch (switchTheme) {
        case body.dataset.theme = `dark`:
            body.classList.remove(`dark-theme`)
            body.classList.add(`light-theme`)
            body.dataset.theme = `light`
            break;
    
        case body.dataset.theme = `light`:
            body.classList.remove(`light-theme`)
            body.classList.add(`dark-theme`)
            body.dataset.theme = `dark`
            break;
    }
})