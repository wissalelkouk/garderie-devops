const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const garderie = {
  nom: 'Ma Garderie',
  description: "Un lieu chaleureux et sécurisé où chaque enfant s'épanouit.",
  adresse: '12 Rue des Enfants, Tunis',
  telephone: '+216 12 345 678',
  horaires: 'Lundi - Vendredi : 7h30 - 18h00',
};

const services = [
  { id: 1, titre: 'Garde à la journée', description: 'Accueil des enfants de 3 mois à 6 ans.' },
  { id: 2, titre: 'Repas équilibrés', description: 'Repas préparés sur place chaque jour.' },
  { id: 3, titre: 'Éveil et éducation', description: 'Activités pédagogiques adaptées à chaque âge.' },
  { id: 4, titre: 'Sieste surveillée', description: 'Espace calme et sécurisé.' },
];

const activites = [
  { id: 1, nom: 'Peinture', horaire: '9h00' },
  { id: 2, nom: 'Chants et comptines', horaire: '10h30' },
  { id: 3, nom: 'Jeux en plein air', horaire: '15h00' },
  { id: 4, nom: 'Lecture de contes', horaire: '16h30' },
];

app.get('/api/garderie', (req, res) => res.json(garderie));
app.get('/api/services', (req, res) => res.json(services));
app.get('/api/activites', (req, res) => res.json(activites));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend sur le port ${PORT}`));