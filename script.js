document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o container da calculadora e a tela de exibição
    const calculator = document.querySelector('.calculator');
    const display = document.getElementById('display');
    const keys = calculator.querySelector('.grid');

    // Objeto para armazenar o estado da calculadora
    const calculatorState = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    /**
     * Atualiza o valor exibido na tela da calculadora.
     */
    function updateDisplay() {
        display.textContent = calculatorState.displayValue;
    }

    // Inicializa a tela
    updateDisplay();

    /**
     * Lida com o clique nos botões.
     * @param {Event} event - O evento de clique.
     */
    keys.addEventListener('click', (event) => {
        const { target } = event;
        const { textContent } = target;
        const { action } = target.dataset;

        // Ignora cliques que não são em botões
        if (!target.matches('button')) {
            return;
        }

        // Lida com números
        if (!action) {
            inputDigit(textContent);
            updateDisplay();
            return;
        }

        // Lida com o ponto decimal
        if (action === 'decimal') {
            inputDecimal(textContent);
            updateDisplay();
            return;
        }

        // Lida com operadores (+, -, *, /)
        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            handleOperator(textContent);
            updateDisplay();
            return;
        }
        
        // Lida com outras ações (limpar, calcular, etc.)
        switch(action) {
            case 'clear':
                resetCalculator();
                break;
            case 'calculate':
                const result = calculate(calculatorState.firstOperand, calculatorState.displayValue, calculatorState.operator);
                calculatorState.displayValue = `${parseFloat(result.toFixed(7))}`;
                calculatorState.operator = null;
                break;
            case 'negate':
                 calculatorState.displayValue = (parseFloat(calculatorState.displayValue) * -1).toString();
                 break;
            case 'percentage':
                 calculatorState.displayValue = (parseFloat(calculatorState.displayValue) / 100).toString();
                 break;
        }
        updateDisplay();
    });

    /**
     * Insere um dígito na tela.
     * @param {string} digit - O dígito a ser inserido.
     */
    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculatorState;

        if (waitingForSecondOperand === true) {
            calculatorState.displayValue = digit;
            calculatorState.waitingForSecondOperand = false;
        } else {
            calculatorState.displayValue =
                displayValue === '0' ? digit : displayValue + digit;
        }
    }

    /**
     * Insere o ponto decimal.
     * @param {string} dot - O caractere de ponto.
     */
    function inputDecimal(dot) {
        // Se o display já inclui um ponto, não faz nada
        if (!calculatorState.displayValue.includes(dot)) {
            calculatorState.displayValue += dot;
        }
    }

    /**
     * Lida com a seleção de um operador.
     * @param {string} nextOperator - O operador selecionado.
     */
    function handleOperator(nextOperatorSymbol) {
        const { firstOperand, displayValue, operator } = calculatorState;
        const inputValue = parseFloat(displayValue);
        
        // Mapeia símbolos para funções
        const operatorMap = {
            '+': 'add',
            '−': 'subtract',
            '×': 'multiply',
            '÷': 'divide'
        };
        const nextOperator = operatorMap[nextOperatorSymbol] || nextOperatorSymbol;


        if (operator && calculatorState.waitingForSecondOperand) {
            calculatorState.operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            calculatorState.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculatorState.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculatorState.firstOperand = result;
        }

        calculatorState.waitingForSecondOperand = true;
        calculatorState.operator = nextOperator;
    }

    /**
     * Realiza o cálculo.
     * @param {number} firstOperand - O primeiro número.
     * @param {number} secondOperand - O segundo número.
     * @param {string} operator - O operador.
     * @returns {number} O resultado do cálculo.
     */
    function calculate(firstOperand, secondOperand, operator) {
        const secondNum = parseFloat(secondOperand);
        if (operator === 'add') {
            return firstOperand + secondNum;
        }
        if (operator === 'subtract') {
            return firstOperand - secondNum;
        }
        if (operator === 'multiply') {
            return firstOperand * secondNum;
        }
        if (operator === 'divide') {
            // Lida com divisão por zero
            if (secondNum === 0) {
                return 'Erro';
            }
            return firstOperand / secondNum;
        }
        return secondNum; // Retorna o segundo operando se não houver operador
    }

    /**
     * Reseta a calculadora para o estado inicial.
     */
    function resetCalculator() {
        calculatorState.displayValue = '0';
        calculatorState.firstOperand = null;
        calculatorState.waitingForSecondOperand = false;
        calculatorState.operator = null;
    }
});
