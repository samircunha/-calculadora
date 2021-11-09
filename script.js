const result = document.querySelector('.result');
const mostrador = document.querySelector('.mostrador');
let numbers = [];
let numbersInOperation = [];
let concatNum = 0;

const mainFunctions = {
    writeNumber: (number) => {
        auxiliaryFunctions.auxWriteNumber.checkResult();
        numbers.push(number);
        auxiliaryFunctions.auxWriteNumber.confereVirgulas();
        if (numbers.length < 10){
            auxiliaryFunctions.auxWriteNumber.writeOnScreen();
        }else{
            return;
        }
    },
    takeOperation: (operator) =>{
        if(numbersInOperation.length == 2 && result.firstChild != null && numbers.length > 0){
            auxiliaryFunctions.auxCalcResult.calculaResult();
        }
        if(numbersInOperation[1]){
            auxiliaryFunctions.auxOperation.alteraOperador(operator);
            return;
        }
        auxiliaryFunctions.auxOperation.transformaNum(operator);
        auxiliaryFunctions.auxCalcOperations.clearElements();
    },
    showResult: () =>{
        result.innerHTML = auxiliaryFunctions.auxCalcResult.calculaResult();
    },
    ce: () =>{
        numbers = [];
        auxiliaryFunctions.auxCalcOperations.confereResult();
    },
    c: () =>{
        numbers = [];
        numbersInOperation = [];
        mostrador.innerHTML = '';
        auxiliaryFunctions.auxCalcOperations.confereResult();
    },
    delete: () =>{
        numbers.pop();
        concatNum = numbers.join('');
        result.innerHTML = concatNum;
    },
    changeValue: () =>{
        if (numbers[0] == "-"){
            numbers.shift();
        }else{
            numbers.splice(0, 0, "-");
        }
        auxiliaryFunctions.auxWriteNumber.writeOnScreen();
    }
}

// --------------------------------------------------------------------------------------------------------
// funções auxiliares:

const auxiliaryFunctions = {
    auxWriteNumber: {
        confereVirgulas: () => {
            let virgulaPrincipal = numbers.indexOf(',')+1;
            let virgulaParaConferir = numbers.indexOf(',', virgulaPrincipal);
            if(virgulaParaConferir > 0){
                numbers.splice(virgulaParaConferir, 1);
            }
            if(numbers[0] == ","){
                numbers.splice(0, 0, 0);
            }
        },
        writeOnScreen: () => {
            concatNum = numbers.join('');
            result.innerHTML = concatNum;
        },
        checkResult: () => {
            if(numbersInOperation.length == 1){
                mostrador.innerHTML = '';
                numbersInOperation = [];
                concatNum = 0;
            }
        }
    },
    auxOperation: {
        transformaNum: (operator) => {
            if (numbersInOperation.length == 1){
                numbersInOperation.push(operator);
                auxiliaryFunctions.auxCalcOperations.showElements();
                return;
            }
            if(concatNum == 0){
                inOperation(concatNum, operator);
                return;
            }
            let transform = +(concatNum.replace(/,/,'.'));
            auxiliaryFunctions.auxOperation.inOperation(transform, operator);
        },
    
        inOperation: (number, operador) =>{
            if(numbersInOperation.length == 0){
                numbersInOperation.push(number, operador);
            }else if(numbersInOperation.length == 2){
                numbersInOperation.push(number);
                return;
            }
            auxiliaryFunctions.auxCalcOperations.showElements();
        },
    
        alteraOperador: (operador) => {
            numbersInOperation.pop();
            numbersInOperation.push(operador);
            auxiliaryFunctions.auxCalcOperations.showElements();
        }
    },
    auxCalcResult: {
        calculaResult: ()=>{
            auxiliaryFunctions.auxOperation.transformaNum();
    
            let resultado = auxiliaryFunctions.auxCalcResult.operacoes(numbersInOperation[1], numbersInOperation[0], numbersInOperation[2])
    
            auxiliaryFunctions.auxCalcOperations.clearElements(resultado);
            return resultado;
        },
    
        operacoes: (string, number1, number2)=>{
            switch(string){
                case "+": return number1 + number2;
                case "-": return number1 - number2;
                case "*": return number1 * number2;
                case "x": return number1 * number2;
                case "/": return number1 / number2;
            }
        }
    },
    auxCalcOperations: {
        clearElements: (number) =>{
            numbers = [];
            if(numbersInOperation.length == 3){
                numbersInOperation.splice(0, 3, number);
                result.innerHTML = number;
                auxiliaryFunctions.auxCalcOperations.showElements();
            }
        },
    
        showElements: () =>{
            mostrador.innerHTML = numbersInOperation.join(' ');
        },
    
        confereResult: () =>{
            if (result != ''){
                result.innerHTML = '';
            }
        }
    }
}

// --------------------------------------------------------------------------------------------------------------
// Usando teclas:

document.addEventListener("keydown", (e)=>{
    if (e.code == "Numpad0" || e.code == "Digit0"){
        mainFunctions.writeNumber(0)
    }
    if (Number(+(e.key))){
        mainFunctions.writeNumber(+(e.key))
    }
    let expr = e.key;
    switch(expr){
        case "+": mainFunctions.takeOperation('+'); break;
        case "-": mainFunctions.takeOperation('-'); break;
        case "*": mainFunctions.takeOperation('*'); break;
        case "/": mainFunctions.takeOperation('/'); break;
        case ",": mainFunctions.writeNumber(','); break;
        case "Enter": mainFunctions.showResult(); break;
        case "Backspace": mainFunctions.delete(); break;
        case "Escape": mainFunctions.c(); break;
    }
})
