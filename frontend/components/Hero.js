export default function Hero({ garderie }) {
  return (
    <section id="accueil" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <img src="/heros.jpg" alt="Enfants qui jouent" style={{ maxWidth: '100%', width: 500, borderRadius: 16 }} />
      <h2 style={{ fontSize: '2rem' }}>Bienvenue à {garderie ? garderie.nom : 'Ma Garderie'}</h2>
      <p>{garderie ? garderie.description : 'Chargement...'}</p>
      {garderie && <p id="contact">📍 {garderie.adresse} | 📞 {garderie.telephone} | 🕐 {garderie.horaires}</p>}
    </section>
  );
}