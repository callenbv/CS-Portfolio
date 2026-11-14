document.querySelectorAll('#navbar a').forEach(link => {
  if (link.getAttribute('href') === (location.pathname.split('/').pop() || 'index.html')) {
    link.setAttribute('aria-current', 'page');
  }
});
document.querySelectorAll('a[target="_blank"]').forEach(link => { link.rel = 'noopener noreferrer'; });

function revealPage() {
  document.body.classList.add('fade-in');
}
// Start after the first paint without waiting for embedded video players.
requestAnimationFrame(() => requestAnimationFrame(revealPage));

function formatProjectDetails(project) {
  let details = `${project.role} - ${project.genre}`;
  if (project.year && project.year !== 'undefined') details += ` (${project.year})`;
  if (project.engine && project.engine !== 'undefined') details += `, ${project.engine}`;
  return details;
}

const homepageProjects = document.querySelectorAll('[data-project]');
if (homepageProjects.length) {
  fetch('Data/projects.json', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Unable to load project content');
      return response.json();
    })
    .then(projects => {
      homepageProjects.forEach(section => {
        const project = projects.find(item => item.title === section.dataset.project);
        if (!project) return;
        section.querySelector('.project-title-link').textContent = project.title;
        section.querySelector('[data-project-details]').textContent = formatProjectDetails(project);
        section.querySelector('[data-project-premise]').textContent = project.premise;
      });
    })
    .catch(error => console.error(error));
}
