/**
 * Escuta as notificações de pagamento (IPN) do CryptoBot e libera o acesso VIP.
 * * @param {Object} request - Requisição POST recebida do Webhook.
 * @param {Object} env - Ambiente contendo segredos e variáveis do canal.
 * @returns {Promise<Response>} Resposta de sucesso para o gateway.
 */
async function handleCryptoWebhook(request, env) {
  const body = await request.json();

  if (body.update_type === 'invoice_paid') {
    const invoice = body.payload;
    const metadata = JSON.parse(invoice.payload);
    const userId = metadata.user_id;

    // Criar link de convite único para o canal VIP
    const inviteResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/createChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.CHANNEL_ID,
        member_limit: 1
      })
    });

    const invite = await inviteResponse.json();

    // Notificar o usuário com o link de acesso
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId,
        text: `✅ Pagamento Confirmado!\n\nAcesse o canal aqui: ${invite.result.invite_link}`,
        parse_mode: 'Markdown'
      })
    });
  }

  return new Response('OK', { status: 200 });
}

export { handleCryptoWebhook };