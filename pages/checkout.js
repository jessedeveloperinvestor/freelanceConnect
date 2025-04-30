import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Carrega o Stripe.js fora do componente para evitar recarregar em cada renderização
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLIC_KEY);

// Componente de formulário de pagamento
function CheckoutForm({ amount, description, professionalPaypalEmail }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Criar o PaymentIntent no servidor
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          professionalPaypalEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      const { clientSecret } = await response.json();

      // Confirmar o pagamento com o Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: document.getElementById('name').value,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {!succeeded ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="name" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Nome no cartão
            </label>
            <input
              id="name"
              type="text"
              required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
              placeholder="Nome como está no cartão"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Detalhes do cartão
            </label>
            <div 
              style={{ 
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
            >
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          {errorMessage && (
            <div style={{ 
              padding: '0.75rem',
              marginBottom: '1.5rem',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '0.375rem'
            }}>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
          </button>
        </>
      ) : (
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#047857',
            marginBottom: '1rem'
          }}>
            Pagamento Concluído!
          </h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Seu pagamento de R$ {amount.toFixed(2)} foi processado com sucesso.
          </p>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            7% (R$ {(amount * 0.07).toFixed(2)}) foi para a plataforma (jesseprofitableinvestor@gmail.com).<br />
            93% (R$ {(amount * 0.93).toFixed(2)}) foi para o profissional.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            Voltar para o início
          </Link>
        </div>
      )}
    </form>
  );
}

export default function Checkout() {
  const router = useRouter();
  const { id } = router.query;
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) {
      // Se não há ID, use o primeiro serviço como demonstração
      fetch('/api/services')
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const service = data[0];
            
            // Busca informações do profissional
            return fetch(`/api/user?id=${service.providerId}`)
              .then(resp => resp.json())
              .then(providerData => {
                setServiceDetails({
                  id: service.id,
                  title: service.title,
                  description: service.description,
                  amount: service.price,
                  professionalName: providerData?.name || 'Profissional',
                  professionalPaypalEmail: providerData?.paypalEmail || 'contato@exemplo.com'
                });
                setLoading(false);
              });
          } else {
            // Fallback para uma demonstração se não houver serviços
            setServiceDetails({
              id: 1,
              title: 'Desenvolvimento de Site',
              description: 'Criação de site responsivo com React e Next.js',
              amount: 1500.00,
              professionalName: 'Profissional Exemplo',
              professionalPaypalEmail: 'contato@exemplo.com'
            });
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('Erro ao carregar serviço:', err);
          setError('Erro ao carregar detalhes do serviço');
          setLoading(false);
        });
    } else {
      // Busca o serviço específico pelo ID
      fetch(`/api/services/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Serviço não encontrado');
          }
          return response.json();
        })
        .then(service => {
          // Busca informações do profissional
          return fetch(`/api/user?id=${service.providerId}`)
            .then(resp => resp.json())
            .then(providerData => {
              setServiceDetails({
                id: service.id,
                title: service.title,
                description: service.description,
                amount: service.price,
                professionalName: providerData?.name || 'Profissional',
                professionalPaypalEmail: providerData?.paypalEmail || 'contato@exemplo.com'
              });
              setLoading(false);
            });
        })
        .catch(err => {
          console.error('Erro ao carregar serviço:', err);
          setError('Erro ao carregar detalhes do serviço');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div style={{ 
          border: '4px solid #f3f4f6', 
          borderTopColor: '#3b82f6', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          animation: 'spin 1s linear infinite' 
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#b91c1c'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Erro ao carregar
        </h2>
        <p>{error}</p>
        <Link href="/" style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.375rem',
          textDecoration: 'none'
        }}>
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  if (!serviceDetails) {
    return null;
  }

  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem' 
      }}>
        Checkout
      </h1>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '800px'
      }}>
        {/* Resumo do serviço */}
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            Resumo do Serviço
          </h2>
          
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              {serviceDetails.title}
            </h3>
            <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
              {serviceDetails.description}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>Profissional:</p>
                <p>{serviceDetails.professionalName}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', textAlign: 'right' }}>Valor:</p>
                <p style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#047857',
                  textAlign: 'right'
                }}>
                  R$ {serviceDetails.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de pagamento */}
        <div style={{ 
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem' 
          }}>
            Informações de Pagamento
          </h2>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              amount={serviceDetails.amount} 
              description={serviceDetails.description}
              professionalPaypalEmail={serviceDetails.professionalPaypalEmail}
            />
          </Elements>
        </div>

        {/* Informações adicionais */}
        <div style={{ 
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Informação sobre a taxa:</strong> 7% do valor total será direcionado para a plataforma como taxa de serviço (jesseprofitableinvestor@gmail.com).
          </p>
          <p>
            O restante (93%) será enviado diretamente para a conta PayPal do profissional.
          </p>
        </div>
      </div>
    </div>
  );
}