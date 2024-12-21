// content.js

// Function to create the drop-down menu
function createDropdownMenu(prompts) {
  // Create menu container
  const menuContainer = document.createElement('div');
  menuContainer.id = 'prompt-dropdown-container';

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.id = 'prompt-toggle-button';
  toggleButton.innerHTML = '☰ Prompts'; // Hamburger icon with text

  // Create dropdown content
  const dropdownContent = document.createElement('div');
  dropdownContent.id = 'prompt-dropdown-content';
  dropdownContent.style.display = 'none'; // Initially hidden

  // Populate dropdown with prompt summaries
  prompts.forEach((prompt, index) => {
    const promptLink = document.createElement('a');
    promptLink.href = `#prompt-${index}`;
    promptLink.className = 'prompt-link';
    promptLink.textContent = summarizePrompt(prompt.text);
    dropdownContent.appendChild(promptLink);

    // Assign an ID to the prompt element for navigation
    prompt.element.id = `prompt-${index}`;
  });

  // Append toggle button and dropdown content to container
  menuContainer.appendChild(toggleButton);
  menuContainer.appendChild(dropdownContent);
  document.body.prepend(menuContainer);

  // Toggle dropdown visibility on button click
  toggleButton.addEventListener('click', () => {
    const isVisible = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isVisible ? 'none' : 'block';
  });
}

// Function to extract prompts from the page
function extractPrompts() {
  // Modify the selector based on ChatGPT's actual DOM structure
  const promptElements = document.querySelectorAll('div.whitespace-pre-wrap');
  const prompts = [];

  promptElements.forEach(element => {
    // Optionally, add checks to ensure it's a user prompt
    prompts.push({ text: element.innerText, element });
  });

  return prompts;
}

// Function to summarize a prompt (e.g., first 50 characters)
function summarizePrompt(text) {
  const maxLength = 50;
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Function to initialize the dropdown menu
function initDropdown() {
  const prompts = extractPrompts();
  if (prompts.length > 0) {
    createDropdownMenu(prompts);
  }
}

// Initialize the dropdown on page load
window.addEventListener('load', initDropdown);

// Optional: Observe DOM changes in case of dynamic content loading
const observer = new MutationObserver(() => {
  // Remove existing dropdown to prevent duplicates
  const existingContainer = document.getElementById('prompt-dropdown-container');
  if (existingContainer) existingContainer.remove();

  // Re-initialize dropdown
  initDropdown();
});
// Function to highlight the target prompt
function highlightPrompt(element) {
  element.style.transition = 'background-color 0.5s';
  const originalColor = element.style.backgroundColor;
  element.style.backgroundColor = '#ffff99'; // Light yellow highlight

  setTimeout(() => {
    element.style.backgroundColor = originalColor || '';
  }, 2000);
}

// Update the click event listener in createDropdownMenu
link.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightPrompt(target);
  }
});
// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

