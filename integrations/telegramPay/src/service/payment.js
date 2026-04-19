/**
 * Comunica-se com a API do CryptoBot para criar uma fatura parametrizada.
 * * @param {string} baseUrl - URL da API (https://pay.crypt.bot/api).
 * @param {string} token - Token de API da sua aplicação no Crypto Pay.
 * @param {Object} params - Dados da fatura (amount, asset, userId).
 * @returns {Promise<string>} Link direto para o pagamento P2P.
 */
async function createCheckout(baseUrl, token, params) {
  const response = await fetch(`${baseUrl}/createInvoice`, {
    method: 'POST',
    headers: {
      'Crypto-Pay-API-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: params.asset,
      amount: params.amount,
      payload: JSON.stringify({ user_id: params.userId }),
      allow_anonymous: true
    })
  });

  const result = await response.json();
  
  if (!result.ok) {
    throw new Error(`Erro CryptoBot: ${result.error.name}`);
  }

  return result.result.pay_url;
}

export { createCheckout };