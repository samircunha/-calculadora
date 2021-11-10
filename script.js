const primaryDisplay = document.querySelector('.js-calculator-body__panel__display--primary');
const secundaryDisplay = document.querySelector('.js-calculator-body__panel__display--secondary');
let numbers = [];
let numbersInOperation = [];
let joinNumbers = 0;

const mainFunctions = {
    writeNumber: (number) => {
        auxiliaryFunctions.writeNumberAssistant.checkProprietiesAfterCalculation();
        numbers.push(number);
        auxiliaryFunctions.writeNumberAssistant.checkComma();
        if (numbers.length <= 15){
            auxiliaryFunctions.writeNumberAssistant.writeOnPrimaryDisplay();
        }else{
            return;
        }
    },
    takeOperation: (operator) =>{
        if(numbersInOperation.length == 2 && primaryDisplay.firstChild != null && numbers.length > 0){
            auxiliaryFunctions.calculateResultAssistant.calulateResult();
        }
        if(numbersInOperation[1]){
            auxiliaryFunctions.operatingAssistant.changeOperator(operator);
            return;
        }
        auxiliaryFunctions.operatingAssistant.transformaNum(operator);
        auxiliaryFunctions.calculateOperationsAssistant.clearElements();
    },
    showResult: () =>{
        primaryDisplay.innerHTML = auxiliaryFunctions.calculateResultAssistant.calulateResult();
    },
    ce: () =>{
        numbers = [];
        auxiliaryFunctions.calculateOperationsAssistant.checkResult();
    },
    c: () =>{
        numbers = [];
        numbersInOperation = [];
        secundaryDisplay.innerHTML = '';
        auxiliaryFunctions.calculateOperationsAssistant.checkResult();
    },
    delete: () =>{
        numbers.pop();
        joinNumbers = numbers.join('');
        primaryDisplay.innerHTML = joinNumbers;
    },
    changeSignal: () =>{
        if (numbers[0] == "-"){
            numbers.shift();
        }else{
            numbers.splice(0, 0, "-");
        }
        auxiliaryFunctions.writeNumberAssistant.writeOnPrimaryDisplay();
    }
}

// --------------------------------------------------------------------------------------------------------
// funções auxiliares:

const auxiliaryFunctions = {
    writeNumberAssistant: {
        checkComma: () => {
            let virgulaPrincipal = numbers.indexOf(',')+1;
            let virgulaParaConferir = numbers.indexOf(',', virgulaPrincipal);
            if(virgulaParaConferir > 0){
                numbers.splice(virgulaParaConferir, 1);
            }
            if(numbers[0] == ","){
                numbers.splice(0, 0, 0);
            }
        },
        writeOnPrimaryDisplay: () => {
            joinNumbers = numbers.join('');
            primaryDisplay.innerHTML = joinNumbers;
        },
        checkProprietiesAfterCalculation: () => {
            if(numbersInOperation.length == 1){
                secundaryDisplay.innerHTML = '';
                numbersInOperation = [];
                joinNumbers = 0;
            }
        }
    },
    operatingAssistant: {
        transformaNum: (operator) => {
            if (numbersInOperation.length == 1){
                numbersInOperation.push(operator);
                auxiliaryFunctions.calculateOperationsAssistant.writeOnSecondaryDisplay();
                return;
            } 
            if(joinNumbers == 0){
                inOperation(joinNumbers, operator);
                return;
            }
            let transformToNumber = +(joinNumbers.replace(/,/,'.'));
            auxiliaryFunctions.operatingAssistant.inOperation(transformToNumber, operator);
        },
        inOperation: (number, operator) =>{
            if(numbersInOperation.length == 0){
                numbersInOperation.push(number, operator);
            }else if(numbersInOperation.length == 2){
                numbersInOperation.push(number);
                return;
            }
            auxiliaryFunctions.calculateOperationsAssistant.writeOnSecondaryDisplay();
        },
        changeOperator: (operator) => {
            numbersInOperation.pop();
            numbersInOperation.push(operator);
            auxiliaryFunctions.calculateOperationsAssistant.writeOnSecondaryDisplay();
        }
    },
    calculateResultAssistant: {
        calulateResult: ()=>{
            const {operations, checkResultLength} = auxiliaryFunctions.calculateResultAssistant;
            const haveOperator = numbersInOperation[1];
            if (!haveOperator){
                alert("Escolha um Operação");
                return joinNumbers;
            }
            auxiliaryFunctions.operatingAssistant.transformaNum();

            const [first, second, third] = numbersInOperation;
    
            let result = operations(second, first, third);
    
            auxiliaryFunctions.calculateOperationsAssistant.clearElements(checkResultLength(result));
            return checkResultLength(result);
        },
        operations: (string, number1, number2)=>{
            switch(string){
                case "+": return number1 + number2;
                case "-": return number1 - number2;
                case "*": return number1 * number2;
                case "/": return number1 / number2;
            }
        },
        checkResultLength: (number) => {
            let numberInCheck = number.toString();
            if (numberInCheck.length > 15){
                numberInCheck = numberInCheck.slice(0, 10);
                return +(numberInCheck)
            }else{
                return number
            }
        }
    },
    calculateOperationsAssistant: {
        clearElements: (number) =>{
            numbers = [];
            if(numbersInOperation.length == 3){
                numbersInOperation.splice(0, 3, number);
                primaryDisplay.innerHTML = number;
                auxiliaryFunctions.calculateOperationsAssistant.writeOnSecondaryDisplay();
            }
        },
        writeOnSecondaryDisplay: () =>{
            secundaryDisplay.innerHTML = numbersInOperation.join(' ');
        },
        checkResult: () =>{
            if (primaryDisplay != ''){
                primaryDisplay.innerHTML = '';
            }
        }
    }
}

// --------------------------------------------------------------------------------------------------------------
// Usando teclas:

document.addEventListener("keydown", ({key})=>{
    const typedNumber = Number.parseInt(key);
    const validInteger = !isNaN(typedNumber)

    if (validInteger){
        mainFunctions.writeNumber(typedNumber)
    }

    switch(key){
        case "+": 
        case "-": 
        case "*": 
        case "/": 
            mainFunctions.takeOperation(key);
            break;
        case ",": mainFunctions.writeNumber(','); break;
        case "Enter": mainFunctions.showResult(); break;
        case "Backspace": mainFunctions.delete(); break;
        case "Escape": mainFunctions.c(); break;
    }
})
