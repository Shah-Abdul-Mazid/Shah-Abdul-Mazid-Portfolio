import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');
  
  // All public and admin routes in the application
  const routes = [
    'home',
    'profile',
    'skills',
    'publications',
    'projects',
    'contacts',
    'resume',
    'resume/visual',
    'resume/ats',
    'login/admin',
    'admin/dashboard'
  ];

  routes.forEach(route => {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf-8');
  });

  // Also create a 404.html fallback so any undefined route boots into React Router instead of Vercel error
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf-8');
  
  console.log(`[SPA Route Generator] Successfully generated static entrypoints for ${routes.length} routes + 404.html fallback!`);
} else {
  console.warn(`[SPA Route Generator] dist/index.html not found, skipping route generation.`);
}
