export default function Navbar({ nom = 'Ma Garderie' }) {
  return (
    <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: '#ff9f43', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '2rem' }}>🧸</span>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{nom}</h1>
      </div>
      <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><a href="#accueil" style={{ color: '#fff' }}>Accueil</a></li>
        <li><a href="#services" style={{ color: '#fff' }}>Services</a></li>
        <li><a href="#contact" style={{ color: '#fff' }}>Contact</a></li>
      </ul>
    </nav>
  );
}