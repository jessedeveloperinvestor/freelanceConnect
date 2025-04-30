import Stripe from 'stripe';
import { buffer } from 'micro';

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Desabilita o bodyParser para que possamos acessar o corpo da requisição como stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Para uso em produção, você deve configurar um webhook secret no dashboard do Stripe
    // e usá-lo aqui para verificar a assinatura
    event = stripe.webhooks.constructEvent(
      buf, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );
  } catch (err) {
    console.error(`Erro de assinatura do webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lidar com o evento de pagamento bem-sucedido
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const {
      professionalPaypalEmail,
      platformFeeAmount,
      professionalAmount,
      adminPaypalEmail
    } = paymentIntent.metadata;

    console.log('Pagamento bem-sucedido! Detalhes:');
    console.log('- ID do pagamento:', paymentIntent.id);
    console.log('- Valor total (centavos):', paymentIntent.amount);
    console.log('- Comissão da plataforma (7%):', platformFeeAmount);
    console.log('- Valor para o profissional (93%):', professionalAmount);
    console.log('- Email PayPal do profissional:', professionalPaypalEmail);
    console.log('- Email PayPal do administrador:', adminPaypalEmail);

    // Aqui, em um ambiente real, você faria:
    // 1. Transferir 7% para o PayPal do administrador (jesse.alves06@protonmail.com)
    // 2. Transferir 93% para o PayPal do profissional
    // Isso requeriria integração com a API do PayPal

    // Em produção, você também pode registrar essas transações no seu banco de dados
  }

  // Retorna uma resposta para confirmar o recebimento do evento
  res.status(200).json({ received: true });
}