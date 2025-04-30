import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NewProject() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    category: 'Desenvolvimento Web',
    skills: []
  });
  
  // Categorias disponíveis
  const categories = [
    'Desenvolvimento Web',
    'Design Gráfico',
    'Marketing Digital',
    'Tradução',
    'Redação',
    'Desenvolvimento Mobile',
    'Edição de Vídeo',
    'Suporte Técnico',
    'Outros'
  ];
  
  // Skills comuns (pode ser expandido)
  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'PHP',
    'WordPress', 'Photoshop', 'Illustrator', 'SEO', 'Marketing',
    'HTML', 'CSS', 'UX/UI', 'Mobile', 'Tradução', 'Copywriting'
  ];
  
  // Verifica se o usuário está autenticado e é cliente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          if (userData && userData.role === 'client') {
            setUser(userData);
          } else {
            // Redirecionar se não for cliente
            router.push('/auth');
          }
        } else {
          // Redirecionar se não estiver autenticado
          router.push('/auth');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setError('Erro ao verificar suas credenciais. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Para múltiplos checkboxes (skills)
      const checked = e.target.checked;
      const skill = e.target.value;
      
      if (checked) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skill]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          skills: prev.skills.filter(s => s !== skill)
        }));
      }
    } else {
      // Para outros campos
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    // Validações básicas
    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar projeto');
      }
      
      // Redirecionar para a lista de projetos após sucesso
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      setError(error.message || 'Ocorreu um erro ao criar seu projeto. Por favor, tente novamente.');
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
  
  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem' 
      }}>
        Criar Novo Projeto
      </h1>
      
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
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="title" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Título do Projeto *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
            placeholder="Ex: Desenvolvimento de Website para Minha Empresa"
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="description" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Descrição do Projeto *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              minHeight: '150px'
            }}
            placeholder="Descreva detalhadamente o que você precisa..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label 
              htmlFor="budget" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Orçamento (R$) *
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={formData.budget}
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
          </div>
          
          <div style={{ flex: 1 }}>
            <label 
              htmlFor="deadline" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}
            >
              Prazo de Entrega *
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="category" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Categoria *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Habilidades Necessárias
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '0.5rem'
          }}>
            {commonSkills.map(skill => (
              <label key={skill} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="skills"
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                {skill}
              </label>
            ))}
          </div>
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
            {submitting ? 'Enviando...' : 'Publicar Projeto'}
          </button>
          
          <Link href="/dashboard" style={{
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