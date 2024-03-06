const axios = require('axios');

const symbol = 'BTCUSD';
const alertPercentage = 5; // Porcentagem para o alerta de queda ou de alta
let previousPrice = 0; // Armazena o preço anterior

function getLatestPrice() {
    axios.get(`https://api.bybit.com/v2/public/tickers?symbol=${symbol}`)
        .then(response => {
            console.log('Dados recebidos:', response.data);
            const data = response.data;
            if (data.ret_code === 0 && data.result.length > 0) {
                const price = parseFloat(data.result[0].last_price);

                // Verifica se já existe um preço anterior para calcular a variação percentual
                if (previousPrice !== 0) {
                    const priceChange = price - previousPrice;
                    const priceChangePercentage = (priceChange / previousPrice) * 100;

                    // Fazendo a verificação se a porcentagem de alta ou baixa foi atingida
                    if (priceChangePercentage >= alertPercentage) {
                        console.log(`Alerta: O preço de ${symbol} subiu mais de ${alertPercentage}%`);
                        showNotification(`Alerta: O preço de ${symbol} subiu mais de ${alertPercentage}%`);
                    } else if (priceChangePercentage <= -alertPercentage) {
                        console.log(`Alerta: O preço de ${symbol} caiu mais de ${alertPercentage}%`);
                        showNotification(`Alerta: O preço de ${symbol} caiu mais de ${alertPercentage}%`);
                    }
                }

                // Atualiza o preço anterior
                previousPrice = price;

                // Atualiza o preço na interface
                if (typeof document !== 'undefined') {
                    document.getElementById('price').innerText = `O preço atual de ${symbol} é: ${price.toFixed(2)}`;
                }
            } else {
                console.error('Erro ao obter o preço da criptomoeda');
                if (typeof document !== 'undefined') {
                    document.getElementById('price').innerText = 'Erro ao obter o preço da criptomoeda';
                }
            }
        })
        .catch(error => {
            console.error('Erro ao conectar à API da Bybit:', error.message);
            if (typeof document !== 'undefined') {
                document.getElementById('price').innerText = 'Erro ao conectar à API da Bybit';
            }
        });
}

function showNotification(message) {
    const notification = new Notification('Crypto Price Alert', {
        body: message
    });

    notification.onclick = () => {
        console.log('Notification clicked');
    };
}

// Chamando a função inicialmente
getLatestPrice();

// Configurando um intervalo para chamar a função repetidamente
setInterval(getLatestPrice, 2000);
