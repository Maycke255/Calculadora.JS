/* Modularizando uma Aplicação
Para esse exercício você irá utilizar o código do projeto **Calc.js**, desenvolvido nas aulas Projeto Prático Guiado do módulo anterior, 
**Javascript II - DOM**. Você deverá modularizar o código javascript da aplicação, dividindo o conteúdo do arquivo index.js em diferentes 
módulos utilizando a sintaxe dos ES Modules. Seu projeto deve conter **pelo menos 3 módulos**. */

//Importanto as variaveis a serem usadas nas funções
import { resultInput, operation } from './elements.js';

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

//Exportando a função principal
export default calculate;