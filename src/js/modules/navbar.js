
export function updateActiveLink() {
  const hash = window.location.hash || "#/";
  const links = document.querySelectorAll('.nav-link');
  
  links.forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.style.backgroundColor = 'var(--verde-principal)';
      link.style.color = 'var(--texto-principal)';
    } else {
      link.style.backgroundColor = 'transparent';
      link.style.color = 'var(--texto-secundario)';
    }
  });
}