import { useAuth } from './auth/auth';

function Home() {
  
  const { nombre, apellido, isAuthenticated } = useAuth();

  return (
    <article>

      {isAuthenticated ? (
        <h1>
          Bienvenido {nombre} {apellido}
        </h1>
      ) : (
        <h1>Hola profe</h1>
      )}
    </article>
  );
}

export default Home;