import DOMPurify from 'dompurify';

export function biographyHtml(content) {
  const container = document.createElement('div');
  container.innerHTML = DOMPurify.sanitize(content || '');
  container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(element => {
    const heading = document.createElement('h3');
    heading.textContent = element.textContent;
    element.replaceWith(heading);
  });
  container.querySelectorAll('p').forEach(element => {
    const text = element.textContent.trim();
    const bold = element.querySelector('strong, b');
    const isLabel = bold && bold.textContent.trim() === text && text.length <= 100 && !/[.!?]$/.test(text);
    if (isLabel || /^associated institutions:?$/i.test(text)) {
      const heading = document.createElement('h3');
      heading.textContent = text.replace(/:$/, '');
      element.replaceWith(heading);
    }
  });
  // Apply the same list presentation even when the editor wraps the list or
  // places explanatory text between a heading and its list.
  container.querySelectorAll('ul, ol').forEach(list => {
    if (list.closest('li')) return;
    list.classList.add('bio-list-panel');
    list.removeAttribute('style');
    [...list.children].filter(child => child.tagName === 'LI').forEach(item => {
      item.classList.add('bio-list-row');
      item.removeAttribute('style');
    });
  });
  return container.innerHTML;
}
