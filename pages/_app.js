import { useState, useEffect } from 'react';
import { SWRConfig, mutate } from 'swr';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { AuthProvider } from '../hooks/useAuth';
// import '../styles/globals.css';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Ocorreu um erro ao buscar os dados.');
  return res.json();
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  // Garante que estamos renderizando apenas no cliente
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Busca os dados do usuário atual, se estiver autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
    
    fetchUser();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <div style={{ 
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Head>
          <title>Rede Freelancer - Conecte-se com profissionais e encontre projetos</title>
          <meta name="description" content="Rede Freelancer - Uma plataforma para freelancers e clientes se conectarem e criarem projetos incríveis juntos." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        {/* Cabeçalho */}
        <header style={{ 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem',
          backgroundColor: 'white'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#3b82f6',
              textDecoration: 'none'
            }}>
              Rede Freelancer
            </Link>
            
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="/" style={{ color: '#111827', textDecoration: 'none' }}>
                Início
              </Link>
              <Link href="/search" style={{ color: '#111827', textDecoration: 'none' }}>
                Projetos
              </Link>
              
              {user ? (
                <>
                  {user.role === 'client' && (
                    <Link href="/projects/new" style={{ color: '#111827', textDecoration: 'none' }}>
                      Solicitar Serviço
                    </Link>
                  )}
                  
                  {user.role === 'professional' && (
                    <Link href="/projects" style={{ color: '#111827', textDecoration: 'none' }}>
                      Propostas Abertas
                    </Link>
                  )}
                  
                  <Link href="/dashboard" style={{ color: '#111827', textDecoration: 'none' }}>
                    Dashboard
                  </Link>
                  
                  <button 
                    onClick={async () => {
                      await fetch('/api/logout', { method: 'POST' });
                      mutate('/api/user', null);
                      router.push('/');
                    }}
                    style={{ 
                      color: '#dc2626', 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/auth" style={{ color: '#111827', textDecoration: 'none' }}>
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main style={{ 
          flex: '1',
          maxWidth: '1200px', 
          width: '100%',
          margin: '0 auto', 
          padding: '2rem 1rem'
        }}>
          <Component {...pageProps} />
        </main>
        
        {/* Rodapé */}
        <footer style={{ 
          borderTop: '1px solid #e5e7eb',
          padding: '1.5rem 1rem',
          backgroundColor: '#f9fafb',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p>https://jessealvesleite-computerengineer.vercel.app</p>
            <p>© 2025 Rede Freelancer. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </SWRConfig>
  );
}

export default MyApp;
