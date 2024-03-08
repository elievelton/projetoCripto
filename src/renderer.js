const axios = require('axios');

const symbol = 'BTCUSD';
const alertPercentage = 0.01; // Porcentagem para o alerta de queda ou de alta
const intervalSeconds = 2; // Intervalo de atualização em segundos
const alertIntervalSeconds = 1; // Intervalo para verificar a porcentagem de mudança em segundos
let previousPrice = 0; // Armazena o preço anterior
let startTime = Date.now(); // Tempo inicial

function getLatestPrice() {
    axios.get(`https://api.bybit.com/v2/public/tickers?symbol=${symbol}`)
        .then(response => {
            console.log('Dados recebidos:', response.data);
            const data = response.data;
            if (data.ret_code === 0 && data.result.length > 0) {
                const price = parseFloat(data.result[0].last_price);
                updatePriceUI(price);
                checkPriceChange(previousPrice, price);
                previousPrice = price;
            } else {
                console.error('Erro ao obter o preço da criptomoeda');
                updateErrorUI('Erro ao obter o preço da criptomoeda');
            }
        })
        .catch(error => {
            console.error('Erro ao conectar à API da Bybit:', error.message);
            updateErrorUI('Erro ao conectar à API da Bybit');
        });
}

function updatePriceUI(price) {
    if (typeof document !== 'undefined') {
        const priceElement = document.getElementById('price');
        priceElement.innerText = `O preço atual de ${symbol} é: ${price.toFixed(2)}`;
    }
}

function updateErrorUI(message) {
    if (typeof document !== 'undefined') {
        const errorElement = document.getElementById('price');
        errorElement.innerText = message;
    }
}

function checkPriceChange(previousPrice, currentPrice) {
    const elapsedTime = (Date.now() - startTime) / 1000; // Tempo decorrido em segundos
    if (elapsedTime >= alertIntervalSeconds) {
        const priceChange = currentPrice - previousPrice;
        const priceChangePercentage = (priceChange / previousPrice) * 100;

        if (Math.abs(priceChangePercentage) >= alertPercentage) {
            if (priceChangePercentage > 0) {
                console.log(`Alerta: O preço de ${symbol} subiu mais de ${alertPercentage}% em 1 minuto`);
                showNotification(`Alerta: O preço de ${symbol} subiu mais de ${alertPercentage}% em 1 minuto`);
                updatePriceColor('green');
            } else {
                console.log(`Alerta: O preço de ${symbol} caiu mais de ${alertPercentage}% em 1 minuto`);
                showNotification(`Alerta: O preço de ${symbol} caiu mais de ${alertPercentage}% em 1 minuto`);
                updatePriceColor('red');
            }
            // Reinicia o intervalo de tempo e o preço anterior para a próxima verificação
            startTime = Date.now();
            previousPrice = currentPrice;
        }
    }
}

function showNotification(message) {
    const notification = new Notification('Crypto Price Alert', {
        body: message
    });

    notification.onclick = () => {
        console.log('Notification clicked');
    };
}

function updatePriceColor(color) {
    if (typeof document !== 'undefined') {
        const priceElement = document.getElementById('price');
        priceElement.style.color = color;
    }
}

// Chamando a função inicialmente
getLatestPrice();

// Configurando um intervalo para chamar a função repetidamente
setInterval(getLatestPrice, intervalSeconds * 1000);
