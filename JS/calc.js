// Primeiro vamos pegar algumas variaveis importantes que usaremos no codigo.
// Primeiro pegamos todas as possiveis teclas que o usuario irá digitar no campo de operação, que na verdade são as teclas presentes no teclado da calculadora.
const keys = [`(`, `)`, `+`, `-`, `.`, `/`, `*`, `%`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]

const switchTheme = document.getElementById(`switchTheme`)
const operation = document.getElementById(`operation`)
const resultInput = document.getElementById(`result`)
const copyToClipboard = document.getElementById(`copy`)
const body = document.querySelector(`body`)
const equal = document.getElementById(`equal`)

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

operation.addEventListener(`keydown`, function (ev) {
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
})

// Botão de igual
document.getElementById(`equal`).addEventListener(`click`, function () {
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
})

// Função de mais importante, função para calcular a operação
function calculate () {
    // Removemos a classe de error, se ouver
    resultInput.classList.remove(`error`)  

    // Fazemos tecnicamente a mesma coisa que anteriormente, verificamos se não contem espaços na operation, caso não vai dar um erro
    if (!operation.value.trim()) {
        resultInput.value = "Digite uma operação";
        resultInput.classList.add('error');
        return;
    }
    
    /* O try e catch são blocos para lidar com erros que podem acontecer no código
    try: Tenta executar o código dentro do bloco 
    catch: Captura qualquer erro que acontecer no try */
    /* Já o replace substitui partes de uma string */
    try {
        /* Entendimento do regex:
        / = delimitador, defini o inicio e o fim da operação, funciona como aspas de strings no padrão regex
        g (no final) = modificador
        a seguir da virgula = substituto
        -> Nesse exemplo mais básico da multiplicação e divisão: Entra no codigo atravez do delimitador, encontra o operador de multiplicação, sai apos
        encontrar, define uma substituição, substitui pelas strings. */
        let expression = operation.value
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

        /* Exemplo mais complexo para as porcentagens.
        Entendimento do regex (caracteres especiais):
        \ = "Escapa" caracteres especiais, tornando-os literais, dá significado especial a caracteres comuns, enquanto a / procura por qualquer caractere
        a contra barra procura por aquele especifico.
        \d = Significa "qualquer dígito (0-9)", Equivalente a [0-9].
        \. = O ponto normalmente significa "qualquer caractere" em regex, Quando escapado com \, significa o caractere ponto literal (.)
        + = Significa "uma ou mais ocorrências" do padrão anterior
        [] = Define uma classe de caracteres (qualquer um dentro dos colchetes)
        () = Cria um grupo de captura (podemos referenciar depois com 1, 2, etc.)
        | = Significa "OU" lógico */

        // Caso 1:
        /* -> Nesse caso: ([\d\.]+) → captura: [\d\.] → qualquer dígito OU ponto | + → um ou mais desses | Os parênteses criam o grupo $1 |
        Substitui por ($1/100) → converte "50%" em "(50/100)" */
        expression = expression.replace(/([\d\.]+)%/g, '($1/100)');
        // Caso 2:
        /* -> Nesse caso: ([\*\/\+\-]) → captura um operador (+, -, *, /) como grupo $1 | ([\d\.]+) → captura número como grupo $2 |
        % → seguido de % | Substitui por $1($2/100) → mantém o operador e converte a porcentagem. Exemplo de como fica: "100+20%" → "100+(20/100)" ou
        "50*10%" → "50*(10/100)" */
        expression = expression.replace(/([\*\/\+\-])([\d\.]+)%/g, '$1($2/100)');

        /* Verificamos uma expressão matematica nesse caso, fazemos dois tipos de verificação.
        -> Está verificando dois padrões separados por | (OU):
        1. \d+\.\d*\. → Número com múltiplos pontos no final (ex: "123.45.")
        2. \d*\.\d+\. → Número com múltiplos pontos no início (ex: ".123.45")

        Padrão 1: \d+\.\d*\.
        \d+ → Um ou mais dígitos
        \. → Um ponto decimal
        \d* → Zero ou mais dígitos
        \. → Outro ponto (aqui está o problema!)
        
        Padrão 2: \d*\.\d+\.
        \d* → Zero ou mais dígitos
        \. → Um ponto decimal
        \d+ → Um ou mais dígitos
        \. → Outro ponto (problema)*/
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