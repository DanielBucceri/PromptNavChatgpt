(function () {
  'use strict';

  // Configuration
  const CONFIG = {
      targetSelector: 'div.whitespace-pre-wrap', // Selector for prompt elements
      dropdownId: 'chatgpt-prompt-dropdown',
      openBtnId: 'chatgpt-dropdown-open-btn',
      closeBtnId: 'chatgpt-dropdown-close-btn',
      maxPromptLength: 100, // Characters to display in dropdown
      dropdownStyles: {
          position: 'fixed',
          top: '50px',
          right: '10px',
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: '#ffffff', // White background for visibility
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: '10000',
          fontFamily: 'Arial, sans-serif',
          color: '#000000', // Black text for contrast
          display: 'none', // Initially hidden
      },
      promptItemStyles: {
          padding: '10px',
          borderBottom: '1px solid #eee',
          cursor: 'pointer',
          color: '#000000', // Ensure prompt text is black
      },
      promptItemHoverStyles: {
          backgroundColor: '#f5f5f5',
      },
      closeBtnStyles: {
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#555555', // Grey color for the close icon
      },
      openBtnStyles: {
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '40px',
          height: '40px',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: '10000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
      },
      openBtnIcon: '📄', // You can replace this with an SVG or another icon
      promptItemIcon: '🔍', // Icon to indicate clickable items
      log: true, // Enable or disable logging
  };

  // Utility Functions
  function log(message, ...args) {
      if (CONFIG.log) {
          console.log(`[ChatGPT Prompt Tool]: ${message}`, ...args);
      }
  }

  function createElement(tag, styles = {}, attributes = {}) {
      const el = document.createElement(tag);
      Object.assign(el.style, styles);
      for (const attr in attributes) {
          el.setAttribute(attr, attributes[attr]);
      }
      return el;
  }

  function truncateText(text, maxLength) {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  // Main Tool Object
  const ChatGPTPromptTool = {
      prompts: new Map(), // Map to store prompts and their elements
      dropdown: null,
      openBtn: null,

      init: function () {
          try {
              log('Initializing ChatGPT Prompt Tool...');
              this.createDropdown();
              this.createOpenButton();
              this.scanPrompts();
              this.observeMutations();
              log('Initialization complete.');
          } catch (error) {
              console.error('[ChatGPT Prompt Tool] Initialization error:', error);
          }
      },

      createDropdown: function () {
          // Create dropdown container
          this.dropdown = createElement('div', CONFIG.dropdownStyles, { id: CONFIG.dropdownId });

          // Create close button
          const closeBtn = createElement('button', CONFIG.closeBtnStyles, { id: CONFIG.closeBtnId, title: 'Close' });
          closeBtn.innerHTML = '&times;';
          closeBtn.addEventListener('click', () => {
              this.hideDropdown();
          });
          this.dropdown.appendChild(closeBtn);

          // Create dropdown content container
          this.listContainer = createElement('div');
          this.dropdown.appendChild(this.listContainer);

          // Append dropdown to body
          document.body.appendChild(this.dropdown);
          log('Dropdown menu created.');
      },

      createOpenButton: function () {
          // Create open button
          this.openBtn = createElement('button', CONFIG.openBtnStyles, { id: CONFIG.openBtnId, title: 'Open Prompt Menu' });
          this.openBtn.innerHTML = CONFIG.openBtnIcon;
          this.openBtn.addEventListener('click', () => {
              this.toggleDropdown();
          });

          // Append open button to body
          document.body.appendChild(this.openBtn);
          log('Open button created.');
      },

      showDropdown: function () {
          this.dropdown.style.display = 'block';
          log('Dropdown menu shown.');
      },

      hideDropdown: function () {
          this.dropdown.style.display = 'none';
          log('Dropdown menu hidden.');
      },

      toggleDropdown: function () {
          if (this.dropdown.style.display === 'none' || this.dropdown.style.display === '') {
              this.showDropdown();
          } else {
              this.hideDropdown();
          }
      },

      scanPrompts: function () {
          log('Scanning for prompt elements...');
          const elements = document.querySelectorAll(CONFIG.targetSelector);
          elements.forEach((el, index) => {
              if (!this.prompts.has(el)) {
                  const promptText = el.innerText.trim();
                  if (promptText) {
                      this.prompts.set(el, promptText);
                      this.addPromptToDropdown(el, promptText, this.prompts.size);
                      log(`Prompt added: "${truncateText(promptText, 50)}"`);
                  }
              }
          });
          log(`Total prompts detected: ${this.prompts.size}`);
      },

      addPromptToDropdown: function (element, text, index) {
          const item = createElement('div', CONFIG.promptItemStyles);
          item.innerText = `${index}. ${truncateText(text, CONFIG.maxPromptLength)}`;
          item.title = text; // Show full text on hover

          // Optional: Add an icon before the text
          const iconSpan = createElement('span', { marginRight: '5px' });
          iconSpan.innerText = CONFIG.promptItemIcon;
          item.prepend(iconSpan);

          // Hover effect
          item.addEventListener('mouseenter', () => {
              Object.assign(item.style, CONFIG.promptItemHoverStyles);
          });
          item.addEventListener('mouseleave', () => {
              Object.assign(item.style, { backgroundColor: '' });
          });

          // Click to scroll
          item.addEventListener('click', () => {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              log(`Scrolled to prompt: "${truncateText(text, 50)}"`);
              this.hideDropdown(); // Optionally hide dropdown after selection
          });

          this.listContainer.appendChild(item);
      },

      observeMutations: function () {
          const observer = new MutationObserver((mutations) => {
              let promptsAdded = false;
              mutations.forEach((mutation) => {
                  if (mutation.addedNodes.length > 0) {
                      mutation.addedNodes.forEach((node) => {
                          if (node.nodeType === Node.ELEMENT_NODE) {
                              if (node.matches(CONFIG.targetSelector)) {
                                  const promptText = node.innerText.trim();
                                  if (promptText && !this.prompts.has(node)) {
                                      this.prompts.set(node, promptText);
                                      this.addPromptToDropdown(node, promptText, this.prompts.size);
                                      promptsAdded = true;
                                      log(`New prompt detected and added: "${truncateText(promptText, 50)}"`);
                                  }
                              }
                              // Also check within the subtree
                              const subElements = node.querySelectorAll(CONFIG.targetSelector);
                              subElements.forEach((subEl) => {
                                  const promptText = subEl.innerText.trim();
                                  if (promptText && !this.prompts.has(subEl)) {
                                      this.prompts.set(subEl, promptText);
                                      this.addPromptToDropdown(subEl, promptText, this.prompts.size);
                                      promptsAdded = true;
                                      log(`New prompt detected and added: "${truncateText(promptText, 50)}"`);
                                  }
                              });
                          }
                      });
                  }
              });
              if (promptsAdded) {
                  log('New prompts added to the dropdown.');
              }
          });

          // Start observing the document body for changes
          observer.observe(document.body, { childList: true, subtree: true });
          log('MutationObserver set up to monitor dynamic content.');
      },
  };

  // Initialize the tool when the DOM is fully loaded
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => ChatGPTPromptTool.init());
  } else {
      ChatGPTPromptTool.init();
  }
})();
