// content.js

// Function to create the navbar
function createNavbar(prompts) {
  // Remove any existing navbar to avoid duplicates
  const existingNavbar = document.getElementById('prompt-navbar');
  if (existingNavbar) {
    existingNavbar.remove();
  }

  // Create navbar container
  const navbar = document.createElement('div');
  navbar.id = 'prompt-navbar';

  // Style the navbar (if styles.css isn't enough)
  navbar.style.position = 'fixed';
  navbar.style.top = '0';
  navbar.style.left = '0';
  navbar.style.width = '100%';
  navbar.style.backgroundColor = '#2d2d2d';
  navbar.style.color = '#ffffff';
  navbar.style.padding = '10px';
  navbar.style.zIndex = '1000';
  navbar.style.overflowX = 'auto';
  navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  navbar.style.fontFamily = 'Arial, sans-serif';

  // Create the list of links
  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.display = 'flex';
  list.style.gap = '15px';
  list.style.margin = '0';
  list.style.padding = '0';

  prompts.forEach((prompt, index) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#prompt-${index}`;
    link.textContent = `Prompt ${index + 1}`;
    link.style.color = '#61dafb';
    link.style.textDecoration = 'none';
    link.style.fontSize = '14px';

    // Add hover effect
    link.addEventListener('mouseover', () => {
      link.style.textDecoration = 'underline';
    });
    link.addEventListener('mouseout', () => {
      link.style.textDecoration = 'none';
    });

    listItem.appendChild(link);
    list.appendChild(listItem);

    // Assign an ID to the prompt element for navigation
    prompt.element.id = `prompt-${index}`;
  });

  navbar.appendChild(list);
  document.body.prepend(navbar);
}

// Function to extract prompts from the page
function extractPrompts() {
  try {
    // Modify the selector based on ChatGPT's DOM structure
    const promptElements = document.querySelectorAll('div.whitespace-pre-wrap');
    const prompts = [];

    promptElements.forEach(element => {
      // Optionally, add checks to ensure it's a user prompt
      prompts.push({ text: element.innerText, element });
    });

    return prompts;
  } catch (error) {
    console.error('Error extracting prompts:', error);
    return [];
  }
}

// Function to initialize the navbar
function initNavbar() {
  const prompts = extractPrompts();
  if (prompts.length > 0) {
    createNavbar(prompts);
  }
}

// Debounce function to improve performance
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Initialize the navbar on page load
window.addEventListener('load', initNavbar);

// Observe DOM changes for dynamic content loading
const observer = new MutationObserver(
  debounce(() => {
    initNavbar();
  }, 300) // Adjust debounce delay as needed
);

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });
