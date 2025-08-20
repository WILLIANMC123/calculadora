// Obtém o elemento de exibição da calculadora
const display = document.getElementById('display');
// Obtém todos os botões da calculadora
const buttons = document.querySelectorAll('.calculator-button');

// Variáveis para armazenar o valor atual, o valor anterior e o operador
let currentExpression = ''; // Expressão que está sendo construída
let history = ''; // Histórico da expressão para depuração, se necessário
let lastResult = null; // Armazena o último resultado para encadeamento de operações

// Adiciona um listener de evento de clique a cada botão
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value; // Obtém o valor do atributo 'data-value' do botão

        // Lida com diferentes tipos de botões
        switch (value) {
            case 'clear':
                // Limpa a tela e reseta as variáveis
                currentExpression = '';
                display.value = '0';
                lastResult = null;
                break;
            case 'delete':
                // Remove o último caractere da expressão
                currentExpression = currentExpression.slice(0, -1);
                display.value = currentExpression || '0'; // Exibe '0' se a expressão estiver vazia
                break;
            case '=':
                // Tenta calcular o resultado da expressão
                try {
                    // Substitui 'log' por 'Math.log10' e 'ln' por 'Math.log'
                    // Substitui 'pow' por '**'
                    // Substitui 'sqrt' por 'Math.sqrt()'
                    // Substitui 'sin', 'cos', 'tan' por 'Math.sin()', 'Math.cos()', 'Math.tan()' (convertendo para radianos)
                    let expressionToEvaluate = currentExpression
                        .replace(/π/g, 'Math.PI')
                        .replace(/e/g, 'Math.E')
                        .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
                        .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
                        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
                        .replace(/pow\(([^,]+),([^)]+)\)/g, 'Math.pow($1,$2)') // lidar com x^y como pow(x,y)
                        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1 * Math.PI / 180)') // Assume graus para input
                        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1 * Math.PI / 180)') // Assume graus para input
                        .replace(/tan\(([^)]+)\)/g, 'Math.tan($1 * Math.PI / 180)') // Assume graus para input
                        .replace(/%/g, '/100'); // Trata % como divisão por 100

                    // Lida com o fatorial (x!)
                    if (expressionToEvaluate.includes('!')) {
                        const parts = expressionToEvaluate.split('!');
                        if (parts.length > 1) {
                            const num = parseFloat(parts[0]);
                            if (!isNaN(num) && Number.isInteger(num) && num >= 0) {
                                expressionToEvaluate = factorial(num).toString();
                            } else {
                                throw new Error('Entrada inválida para fatorial.');
                            }
                        }
                    }

                    // Avalia a expressão. Usar eval() é perigoso, mas para uma calculadora simples é comum.
                    // Em um ambiente de produção, seria necessário um parser de expressões seguro.
                    lastResult = eval(expressionToEvaluate);
                    display.value = lastResult;
                    currentExpression = lastResult.toString(); // Define a expressão atual para o resultado para encadeamento
                } catch (error) {
                    display.value = 'Erro'; // Exibe 'Erro' em caso de falha no cálculo
                    currentExpression = ''; // Limpa a expressão após um erro
                    lastResult = null;
                    console.error('Erro de cálculo:', error);
                }
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'sqrt':
                // Adiciona a função com um parêntese de abertura para o usuário preencher
                currentExpression += value + '(';
                display.value = currentExpression;
                break;
            case 'pow':
                // Adiciona a função de potência com parênteses e vírgula
                currentExpression += '^'; // Exibir '^' na tela, mas internamente será 'Math.pow'
                display.value = currentExpression;
                break;
            case 'pi':
                // Adiciona o valor de PI
                currentExpression += 'π';
                display.value = currentExpression;
                break;
            case 'e':
                // Adiciona o valor de Euler (e)
                currentExpression += 'e';
                display.value = currentExpression;
                break;
            case '!':
                // Adiciona o símbolo de fatorial
                currentExpression += '!';
                display.value = currentExpression;
                break;
            default:
                // Adiciona números e operadores normais
                if (display.value === '0' && value !== '.') {
                    display.value = value;
                } else {
                    display.value += value;
                }
                currentExpression += value; // Adiciona o valor à expressão atual
                break;
        }
    });
});

// Função para calcular o fatorial de um número
function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    if (n < 0) {
        throw new Error('Fatorial não definido para números negativos.');
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

