import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NewProposal() {
  const router = useRouter();
  const { projectId } = router.query;
  
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    price: '',
    deliveryTime: '',
    message: ''
  });
  
  // Verifica se o usuário está autenticado e é profissional
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          if (userData && userData.role === 'professional') {
            setUser(userData);
          } else {
            // Redirecionar se não for profissional
            router.push('/auth');
          }
        } else {
          // Redirecionar se não estiver autenticado
          router.push('/auth');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setError('Erro ao verificar suas credenciais. Por favor, faça login novamente.');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Busca detalhes do projeto quando tiver o ID
  useEffect(() => {
    if (projectId && user) {
      fetchProjectDetails();
    }
  }, [projectId, user]);
  
  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const projectData = await res.json();
        setProject(projectData);
      } else {
        throw new Error('Projeto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do projeto:', error);
      setError('Erro ao carregar detalhes do projeto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    // Validações básicas
    if (!formData.price || !formData.deliveryTime || !formData.message) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          price: parseFloat(formData.price),
          deliveryTime: formData.deliveryTime,
          message: formData.message
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao enviar proposta');
      }
      
      // Redirecionar para o dashboard após sucesso
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      setError(error.message || 'Ocorreu um erro ao enviar sua proposta. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ 
          border: '4px solid #f3f4f6', 
          borderTopColor: '#3b82f6', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          margin: '0 auto',
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
  
  if (!project) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#b91c1c' }}>
          Projeto não encontrado
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          O projeto que você está procurando não existe ou você não tem permissão para acessá-lo.
        </p>
        <Link href="/projects" style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Ver projetos disponíveis
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem' 
      }}>
        Enviar Proposta
      </h1>
      
      {/* Detalhes do projeto */}
      <div style={{ 
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ 
            display: 'inline-block',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            marginRight: '0.5rem'
          }}>
            {project.category}
          </span>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Publicado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem' 
        }}>
          {project.title}
        </h2>
        
        <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
          {project.description}
        </p>
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem',
          marginTop: '0.5rem'
        }}>
          <div>
            <p><strong>Orçamento do cliente:</strong> R$ {project.budget.toFixed(2)}</p>
            <p><strong>Prazo de entrega:</strong> {new Date(project.deadline).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          padding: '0.75rem',
          marginBottom: '1.5rem',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '0.375rem'
        }}>
          {error}
        </div>
      )}
      
      {/* Formulário de proposta */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="price" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Valor da Proposta (R$) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            placeholder="Ex: 1500.00"
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Orçamento do cliente: R$ {project.budget.toFixed(2)}
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="deliveryTime" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Prazo de Entrega Proposto *
          </label>
          <input
            id="deliveryTime"
            name="deliveryTime"
            type="date"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Prazo solicitado pelo cliente: {new Date(project.deadline).toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label 
            htmlFor="message" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Mensagem para o Cliente *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              minHeight: '150px'
            }}
            placeholder="Explique por que você é a pessoa certa para este projeto, sua experiência e como planeja executá-lo..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Enviando...' : 'Enviar Proposta'}
          </button>
          
          <Link href="/projects" style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center'
          }}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}