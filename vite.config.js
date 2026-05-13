import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const caseStudyDevPlugin = () => {
  return {
    name: 'case-study-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/projects/') && !req.url.includes('.')) {
          // Temporarily set VITE_DEV_SERVER so prerender.mjs exports the function and doesn't run build logic
          process.env.VITE_DEV_SERVER = 'true';
          try {
            const { renderProjectPage } = await import('./scripts/prerender.mjs');
            const { projects, buildProjectPath } = await import('./src/data.js');
            
            const pathname = req.url.split('?')[0];
            const slug = pathname.split('/').filter(Boolean)[1];
            const project = projects.find(p => p.slug === slug || buildProjectPath(p) === pathname);
            
            if (project) {
              const html = renderProjectPage(project);
              res.setHeader('Content-Type', 'text/html');
              res.end(html);
              return;
            }
          } catch (e) {
            console.error("Error serving case study page:", e);
          }
        }
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), caseStudyDevPlugin()]
});

