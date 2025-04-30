import Stripe from 'stripe';

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Email do administrador para receber a comissão (7%)
const ADMIN_PAYPAL_EMAIL = 'jesseprofitableinvestor@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { amount, description, professionalPaypalEmail } = req.body;

    if (!amount || !professionalPaypalEmail) {
      return res.status(400).json({ error: 'Valor e email do profissional são obrigatórios' });
    }

    // Converte para centavos (Stripe trabalha com a menor unidade monetária)
    const amountInCents = Math.round(amount * 100);
    
    // Calcula a comissão da plataforma (7%)
    const platformFeeAmount = Math.round(amountInCents * 0.07);
    
    // Calcula o valor que o profissional receberá (93%)
    const professionalAmount = amountInCents - platformFeeAmount;

    // Cria um PaymentIntent 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'brl', 
      automatic_payment_methods: {
        enabled: true,
      },
      description: description || 'Pagamento de serviço na Rede Freelancer',
      metadata: {
        professionalPaypalEmail,
        platformFeeAmount,
        professionalAmount,
        adminPaypalEmail: ADMIN_PAYPAL_EMAIL
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    res.status(500).json({ error: error.message });
  }
}