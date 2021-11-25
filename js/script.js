//https://api.fastforex.io/convert?from=USD&to=EUR&amount=1&api_key=339ab9170b-dcfd34c79d-r2j1o2
const primeiroSelect = document.getElementById("primeiroValor");
const segundoSelect = document.getElementById("segundoValor");
const btnTrocar = document.getElementById("trocaValorBtn");
const numero = document.getElementById("numero");
import { alerta } from "./Cria_alerta/alerta";
let symbols;
const setSymbols = function() {
    fetch("./Common-Currency.json")
        .then(response => { return response.json(); })
        .then(data => { symbols = data; trocaMoedaSymbol(); })
        .catch(error => { console.log(error); });
}
const criaSessionStorage = function () {
    fetch("https://api.fastforex.io/currencies?api_key=339ab9170b-dcfd34c79d-r2j1o2")
        .then(response => { return response.json(); })
        .then(data => { sessionStorage.setItem("moedas", JSON.stringify(data.currencies)); criaOptions(); })
        .catch(error => { console.log(error); });
}
const criaOptions = function () {
    if (sessionStorage.getItem("moedas") === null) {
        criaSessionStorage();
    }
    else {
        const options1 = [];
        const options2 = [];
        const moedaObjeto = JSON.parse(sessionStorage.getItem("moedas"));
        for (const key in moedaObjeto) {
            const selected = key === "BRL" ? "selected" : "";
            options1.push(`<option value="${key}" ${selected} >${key}</option>`);
        }
        for (const key in moedaObjeto) {
            const selected = key === "USD" ? "selected" : "";
            options2.push(`<option value="${key}" ${selected} >${key}</option>`);
        }
        primeiroSelect.innerHTML = options1.join('');
        segundoSelect.innerHTML = options2.join('');
    }
}
numero.addEventListener("keypress", () => {
    const numeros = /[0-9]/g;
    if (window.event.key === "Enter") {
        if (parseFloat(numero.value) >= 1) {
            chamaStartRequest();
        }
        else{
            alerta();
        }
    }
})
const chamaStartRequest = function () {
    const primeiroValor = primeiroSelect.children[primeiroSelect.selectedIndex].value;
    const segundoValor = segundoSelect.children[segundoSelect.selectedIndex].value;
    startRequest(primeiroValor, segundoValor);
}
const mostraDescricaoMoeda = function () {
    const moedas = JSON.parse(sessionStorage.getItem("moedas"));
    document.getElementById("descricaoPrimeiroValor").innerHTML = moedas[primeiroSelect.children[primeiroSelect.selectedIndex].value];
    document.getElementById("descricaoSegundoValor").innerHTML = moedas[segundoSelect.children[segundoSelect.selectedIndex].value];
}
const trocaMoedaSymbol = function () {
    const primeiroSymbolNativo = typeof symbols[primeiroSelect.children[primeiroSelect.selectedIndex].value] != "undefined" ?
        symbols[primeiroSelect.children[primeiroSelect.selectedIndex].value].symbol_native : "$";
    const segundoSymbolNativo = typeof symbols[segundoSelect.children[segundoSelect.selectedIndex].value] != "undefined" ?
        symbols[segundoSelect.children[segundoSelect.selectedIndex].value].symbol_native : "$";
    document.getElementById("primeiroSimbolo").innerHTML = primeiroSymbolNativo;
    document.getElementById("segundoSimbolo").innerHTML = segundoSymbolNativo;
}
btnTrocar.onclick = function () {
    const optionGuardado = primeiroSelect.selectedIndex;
    primeiroSelect.selectedIndex = segundoSelect.selectedIndex;
    segundoSelect.selectedIndex = optionGuardado;
    const primeiroValor = primeiroSelect.children[primeiroSelect.selectedIndex].value;
    const segundoValor = segundoSelect.children[segundoSelect.selectedIndex].value;
    mostraDescricaoMoeda();
    trocaMoedaSymbol();
    startRequest(primeiroValor, segundoValor);
}
const startRequest = function (primeiroValor, segundoValor) {
    if (numero.value != "" && numero.value >= 1) {
        const url = `https://api.fastforex.io/convert?from=${primeiroValor}&to=${segundoValor}&amount=${numero.value}&api_key=339ab9170b-dcfd34c79d-r2j1o2`;
        request(url, segundoValor);
    }
    else
        return;
}
const request = function (url, segundoValor) {
    fetch(url)
        .then(response => { return response.json(); })
        .then(data => { converteNumero(data, segundoValor); })
        .catch(error => { console.log(error); });
}
const converteNumero = function (data, segundoValor) {
    if (typeof data === "object")
        document.getElementById("numeroConvertido").value = data.result[segundoValor];
}
primeiroSelect.onchange = () => { mostraDescricaoMoeda(); trocaMoedaSymbol(); chamaStartRequest(); };
segundoSelect.onchange = () => { mostraDescricaoMoeda(); trocaMoedaSymbol(); chamaStartRequest(); };
setSymbols();
criaOptions();