/* Modularizando uma Aplicação
Para esse exercício você irá utilizar o código do projeto **Calc.js**, desenvolvido nas aulas Projeto Prático Guiado do módulo anterior, 
**Javascript II - DOM**. Você deverá modularizar o código javascript da aplicação, dividindo o conteúdo do arquivo index.js em diferentes 
módulos utilizando a sintaxe dos ES Modules. Seu projeto deve conter **pelo menos 3 módulos**. */



//Variaveis a serem usadas:
// Primeiro pegamos todas as possiveis teclas que o usuario irá digitar no campo de operação, que na verdade são as teclas presentes no teclado da calculadora.
const keys = [`(`, `)`, `+`, `-`, `.`, `/`, `*`, `%`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
const switchTheme = document.getElementById(`switchTheme`)
const operation = document.getElementById(`operation`)
const resultInput = document.getElementById(`result`)
const copyToClipboard = document.getElementById(`copy`)
const body = document.querySelector(`body`)
const equal = document.getElementById(`equal`)

//Função calculate:
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
        g (no final) = modificador ou global
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

        /* throw new Error -> E um meacanismo para lançar erros personalizados quando algo invalido ou inesperado ocorre
        -> throw → Palavra-chave que "lança" o erro (interrompe o fluxo normal)
        -> new Error() → Cria um novo objeto de erro
        -> "Mensagem" → Descrição do erro (aparece no console) */
        if (expression.match(/(\d+\.\d*\.|\d*\.\d+\.)/)) {
            throw new Error("Ponto decimal inválido");
        }

        /* Contagem de parenteses:
        Nesse caso, ele verifica se a ordem e a contagem de parenteses esta certa, exemplo: armazena o que quer procurar /, transforma o caractere em
        especial \ bsuca apenas ele, inicia a busca pelo caractere (, da o fim /, o g significa global, procura todas as ocorrencias, || [] → Se não
        encontrar nenhum (, retorna array vazio (evita null), .length → Conta quantos foram encontrados, o outro e a mesma logica. Porem, não compara a ordem, 
        VERIFICA APENAS A CONTAGEM, caso a contagem do parenteses ( seja DIFERENTE do parentese ), entra no erro, ex: (1 + (2 - 3)) -> balanceado
        (1 + (2 - 3) -> desbalanceado, falta fechar.*/
        const parentesesAbertos = (expression.match(/\(/g) || []).length;
        const parentesesFechados = (expression.match(/\)/g) || []).length;
        if (parentesesAbertos !== parentesesFechados) {
            throw new Error("Parênteses desbalanceados");
        }

        // Usamos o metodo Eval, e uma função um tanto perigosa do JS, ela avalia e interpreta o que o usuario digita como codigo
        const result = eval(expression)

        if (isNaN(result)) {
            throw new Error("Operação inválida");
        }

        resultInput.value = result

    } catch (error) {
        resultInput.value = `ERROR`
        resultInput.classList.add(`error`)  

        console.error("Erro de cálculo:", error);
    }
}

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

export default calculate()
export { keys, switchTheme, operation, resultInput, copyToClipboard, body, equal, checkPreferesTheme, menuCalculate,
    equalBtn, copyToClipboardBtn
}