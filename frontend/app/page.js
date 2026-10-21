'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';

export default function Home() {
  const [garderie, setGarderie] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/garderie').then((r) => r.json()).then(setGarderie).catch(console.error);
    fetch('/api/services').then((r) => r.json()).then(setServices).catch(console.error);
  }, []);

  return (
    <main>
      <Navbar nom={garderie?.nom} />
      <Hero garderie={garderie} />
      <Services services={services} />
    </main>
  );
}