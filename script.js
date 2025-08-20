document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const keys = document.querySelector('.grid');

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
     * Lida com a entrada de dígitos.
     * @param {string} digit - O dígito a ser inserido.
     */
    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculatorState;

        // Se um erro for exibido, resete antes de inserir o novo dígito.
        if (displayValue === 'Erro') {
            resetCalculator();
            calculatorState.displayValue = digit;
            return;
        }

        if (waitingForSecondOperand) {
            calculatorState.displayValue = digit;
            calculatorState.waitingForSecondOperand = false;
        } else {
            calculatorState.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    /**
     * Insere o ponto decimal.
     */
    function inputDecimal() {
        if (calculatorState.waitingForSecondOperand) {
            calculatorState.displayValue = '0.';
            calculatorState.waitingForSecondOperand = false;
            return;
        }
        if (!calculatorState.displayValue.includes('.')) {
            calculatorState.displayValue += '.';
        }
    }

    /**
     * Lida com a seleção de um operador.
     * @param {string} nextOperator - O operador selecionado.
     */
    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculatorState;
        const inputValue = parseFloat(displayValue);

        if (operator && calculatorState.waitingForSecondOperand) {
            calculatorState.operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            calculatorState.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            
            if (result === 'Erro') {
                calculatorState.displayValue = 'Erro';
            } else {
                calculatorState.displayValue = `${parseFloat(result.toFixed(7))}`;
                calculatorState.firstOperand = result;
            }
        }

        calculatorState.waitingForSecondOperand = true;
        calculatorState.operator = nextOperator;
    }

    /**
     * Realiza o cálculo.
     * @param {number} firstOperand - O primeiro número.
     * @param {number} secondOperand - O segundo número.
     * @param {string} operator - O operador.
     * @returns {number|string} O resultado do cálculo ou 'Erro'.
     */
    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                if (secondOperand === 0) return 'Erro';
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }
    
    /**
     * Inverte o sinal do número no display.
     */
    function negateValue() {
        if (calculatorState.displayValue !== '0' && calculatorState.displayValue !== 'Erro') {
            calculatorState.displayValue = (parseFloat(calculatorState.displayValue) * -1).toString();
        }
    }

    /**
     * Converte o número no display para porcentagem.
     */
    function convertToPercentage() {
        if (calculatorState.displayValue !== 'Erro') {
            calculatorState.displayValue = (parseFloat(calculatorState.displayValue) / 100).toString();
        }
    }
    
    /**
     * Apaga o último dígito inserido.
     */
    function backspace() {
        if (calculatorState.displayValue === 'Erro') return;
        if (calculatorState.displayValue.length > 1) {
            calculatorState.displayValue = calculatorState.displayValue.slice(0, -1);
        } else {
            calculatorState.displayValue = '0';
        }
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

    // Mapeia ações a funções
    const actions = {
        'decimal': inputDecimal,
        'clear': resetCalculator,
        'negate': negateValue,
        'percentage': convertToPercentage,
        'backspace': backspace,
        'calculate': () => {
            const { firstOperand, displayValue, operator } = calculatorState;
            if (firstOperand == null || operator == null || calculatorState.waitingForSecondOperand) return;
            const result = calculate(firstOperand, parseFloat(displayValue), operator);
            if (result === 'Erro') {
                calculatorState.displayValue = 'Erro';
            } else {
                calculatorState.displayValue = `${parseFloat(result.toFixed(7))}`;
            }
            calculatorState.operator = null;
            calculatorState.firstOperand = null; // Reset for new calculations
            calculatorState.waitingForSecondOperand = true;
        }
    };

    // Lida com cliques nos botões
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        const { action } = target.dataset;
        const keyContent = target.textContent;
        
        if (!action) { // É um número
            inputDigit(keyContent);
        } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
            handleOperator(action);
        } else if (actions[action]) { // Outras ações
            actions[action]();
        }

        updateDisplay();
    });
    
    // Lida com entradas do teclado
    window.addEventListener('keydown', (event) => {
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': 'decimal', ',': 'decimal',
            '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide',
            '%': 'percentage',
            'Enter': 'calculate', '=': 'calculate',
            'Escape': 'clear', 'c': 'clear', 'C': 'clear',
            'Backspace': 'backspace'
        };
        
        const action = keyMap[event.key];
        if (action) {
            event.preventDefault(); // Impede ações padrão do navegador
            const button = document.querySelector(`[data-action="${action}"]`) || Array.from(document.querySelectorAll('.btn')).find(btn => btn.textContent === event.key);
            if (button) {
                button.click();
                // Adiciona um efeito visual para o pressionamento da tecla
                button.classList.add('is-depressed');
                setTimeout(() => button.classList.remove('is-depressed'), 150);
            }
        }
    });
});
