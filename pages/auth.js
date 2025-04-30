import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Auth() {
  const router = useRouter();
  const [authType, setAuthType] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id || name]: value
    }));
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }
      
      // Redirecionar para a página inicial após login bem-sucedido
      router.push('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validar se a senha tem pelo menos 6 caracteres
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name || formData.username, // Usar username como nome se nome não for fornecido
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }
      
      // Redirecionar para a página inicial após cadastro bem-sucedido
      router.push('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      {/* Coluna do Formulário */}
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '1.5rem' 
        }}>
          {authType === 'login' ? 'Entre na sua Conta' : 'Crie sua Conta'}
        </h1>
        
        {/* Alternar entre login e cadastro */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '2rem', 
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setAuthType('login')}
            style={{ 
              flex: 1, 
              padding: '0.75rem 0',
              background: authType === 'login' ? '#3b82f6' : 'white',
              color: authType === 'login' ? 'white' : '#4b5563',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setAuthType('register')}
            style={{ 
              flex: 1, 
              padding: '0.75rem 0',
              background: authType === 'register' ? '#3b82f6' : 'white',
              color: authType === 'register' ? 'white' : '#4b5563',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cadastrar
          </button>
        </div>
        
        {/* Exibir mensagem de erro se houver */}
        {error && (
          <div style={{ 
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '0.375rem'
          }}>
            {error}
          </div>
        )}
        
        {/* Formulário de Login */}
        {authType === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="Digite seu email"
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="Digite sua senha"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}
        
        {/* Formulário de Cadastro */}
        {authType === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="Digite seu nome completo"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="username" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Nome de Usuário
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="Escolha um nome de usuário"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="Digite seu email"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{ 
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="Crie uma senha (mínimo 6 caracteres)"
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Tipo de Conta
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span>Cliente</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="role"
                    value="professional"
                    checked={formData.role === 'professional'}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span>Profissional</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
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
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
        )}
        
        {/* Rodapé do Formulário */}
        <div style={{ 
          marginTop: '1rem', 
          textAlign: 'center',
          color: '#4b5563'
        }}>
          {authType === 'login' ? (
            <p>
              Não tem uma conta?{' '}
              <button
                onClick={() => setAuthType('register')}
                style={{ 
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cadastre-se aqui
              </button>
            </p>
          ) : (
            <p>
              Já tem uma conta?{' '}
              <button
                onClick={() => setAuthType('login')}
                style={{ 
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Entre aqui
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
