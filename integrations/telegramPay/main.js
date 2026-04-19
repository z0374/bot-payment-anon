/**
 * Orquestra o início do pagamento utilizando o segredo "currency".
 * [Licenciado sob GNU GPL v3]
 * @param {Object} env - Ambiente do Cloudflare contendo o secret currency.
 * @param {Object} data - Objeto contendo userId e o valor.
 */
async function processPayment(env, data) {
  // Alterado de env.nexa_pay para env.currency
  const config = JSON.parse(env.currency); 
  
  const amountInUsdt = (data.amount || 50.00) / 5.5;

  return await createCheckout(config.baseUrl, config.crypto_bot_token, {
    userId: data.userId,
    amount: amountInUsdt.toFixed(2),
    asset: 'USDT'
  });
}

export { processPayment };