export default function Services({ services = [] }) {
  return (
    <section id="services" style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Nos services</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {services.map((s) => (
          <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: '1rem' }}>
            <h3>{s.titre}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}