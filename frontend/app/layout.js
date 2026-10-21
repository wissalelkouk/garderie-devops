export const metadata = {
  title: 'Ma Garderie',
  description: 'Landing page de la garderie Ma Garderie',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>{children}</body>
    </html>
  );
}