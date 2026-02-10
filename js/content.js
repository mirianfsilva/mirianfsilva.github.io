document.addEventListener('DOMContentLoaded', () => {
  const contentRoot = document.getElementById('content-root');
  
  if (!contentRoot) {
    console.error('Content root element not found!');
    return;
  }
  
  if (typeof marked === 'undefined') {
    console.error('Marked library not loaded!');
    contentRoot.innerHTML = '<p style="padding: 20px;">Marked library failed to load. Please refresh the page.</p>';
    return;
  }

  const idOverrides = {
    'about me': 'about-me',
    'research interest': 'research',
    'tldr: academic and professional background': 'stuff',
    'facts about me :)': 'facts',
    'research': 'oral-presentations-talks',
  };

  const toId = (title) => {
    const key = title.toLowerCase().trim();
    if (idOverrides[key]) {
      return idOverrides[key];
    }
    return key
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const toTitle = (title) => title.trim();

  const parseBibTeX = (bibtexString) => {
    const entries = [];
    const entryRegex = /@(\w+)\{([^,]+),\s*([\s\S]*?)\n\}/g;
    let match;

    while ((match = entryRegex.exec(bibtexString)) !== null) {
      const [, type, key, fields] = match;
      const entry = { type, key, fields: {} };

      const fieldRegex = /(\w+)\s*=\s*\{([^}]+)\}|(\w+)\s*=\s*"([^"]+)"/g;
      let fieldMatch;

      while ((fieldMatch = fieldRegex.exec(fields)) !== null) {
        const fieldName = fieldMatch[1] || fieldMatch[3];
        const fieldValue = fieldMatch[2] || fieldMatch[4];
        entry.fields[fieldName] = fieldValue;
      }

      entries.push(entry);
    }

    return entries;
  };

  const formatBibTeXEntry = (entry) => {
    const { type, fields } = entry;
    let formatted = '';

    // Author names
    if (fields.author) {
      formatted += `<span class="bib-authors">${fields.author}</span>. `;
    }

    // Year
    if (fields.year) {
      formatted += `<span class="bib-year">(${fields.year})</span>. `;
    }

    // Title
    if (fields.title) {
      formatted += `<span class="bib-title">${fields.title}</span>. `;
    }

    // Journal/Booktitle/HowPublished based on entry type
    if (type === 'article' && fields.journal) {
      formatted += `<span class="bib-venue"><em>${fields.journal}</em></span>`;
      if (fields.volume) formatted += `, ${fields.volume}`;
      if (fields.number) formatted += `(${fields.number})`;
      if (fields.pages) formatted += `, pp. ${fields.pages}`;
      formatted += '. ';
    } else if (type === 'inproceedings' && fields.booktitle) {
      formatted += `In <span class="bib-venue"><em>${fields.booktitle}</em></span>. `;
    } else if (type === 'misc' && fields.howpublished) {
      formatted += `<span class="bib-venue">${fields.howpublished}</span>. `;
    }

    // Publisher
    if (fields.publisher) {
      formatted += `${fields.publisher}. `;
    }

    // DOI
    if (fields.doi) {
      formatted += `<a href="https://doi.org/${fields.doi}" target="_blank" rel="noopener noreferrer" class="bib-link">DOI: ${fields.doi}</a>. `;
    }

    // URL
    if (fields.url) {
      formatted += `<a href="${fields.url}" target="_blank" rel="noopener noreferrer" class="bib-link">Link</a>. `;
    }

    return formatted.trim();
  };

  const processBibTeXInContent = (htmlString) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlString;

    // Find all code blocks with bibtex language
    const codeBlocks = wrapper.querySelectorAll('pre code.language-bibtex, pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const bibtexContent = codeBlock.textContent;
      
      // Check if it looks like BibTeX
      if (bibtexContent.includes('@') && bibtexContent.includes('{')) {
        const entries = parseBibTeX(bibtexContent);
        
        if (entries.length > 0) {
          const listEl = document.createElement('ol');
          listEl.classList.add('bib-list');

          entries.forEach((entry) => {
            const li = document.createElement('li');
            li.classList.add('bib-entry');
            li.innerHTML = formatBibTeXEntry(entry);
            listEl.appendChild(li);
          });

          // Replace the pre/code block with the formatted list
          const preEl = codeBlock.closest('pre');
          if (preEl) {
            preEl.replaceWith(listEl);
          }
        }
      }
    });

    return wrapper.innerHTML;
  };

  const buildSection = (section, index) => {
    const sectionEl = document.createElement('section');
    sectionEl.classList.add('markdown-section', 'paragraph');
    if (index > 0) {
      sectionEl.classList.add('divider');
    }
    const sectionId = toId(section.title);
    if (sectionId) {
      sectionEl.id = sectionId;
    }

    if (section.title) {
      const titleEl = document.createElement('p');
      titleEl.innerHTML = `<b>${toTitle(section.title)}</b>`;
      sectionEl.appendChild(titleEl);
    }

    section.nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^H[1-3]$/)) {
        return;
      }
      sectionEl.appendChild(node);
    });

    if (sectionId === 'research' || sectionId === 'stuff') {
      const listEl = sectionEl.querySelector('ul');
      if (listEl) {
        listEl.classList.add('my-stuff');
      }
    }

    return sectionEl;
  };

  const buildMainTabs = (homeSections, researchSection) => {
    const tabsEl = document.createElement('div');
    tabsEl.classList.add('main-tabs');
    tabsEl.setAttribute('role', 'tablist');

    const homeButton = document.createElement('button');
    homeButton.classList.add('main-tab-button', 'active');
    homeButton.setAttribute('role', 'tab');
    homeButton.setAttribute('aria-selected', 'true');
    homeButton.setAttribute('aria-controls', 'main-tab-home');
    homeButton.id = 'main-tab-home-button';
    homeButton.textContent = 'Home';

    const researchButton = document.createElement('button');
    researchButton.classList.add('main-tab-button');
    researchButton.setAttribute('role', 'tab');
    researchButton.setAttribute('aria-selected', 'false');
    researchButton.setAttribute('aria-controls', 'main-tab-research');
    researchButton.id = 'main-tab-research-button';
    researchButton.textContent = 'Research Works & Talks';

    tabsEl.appendChild(homeButton);
    tabsEl.appendChild(researchButton);

    const panelsEl = document.createElement('div');
    panelsEl.classList.add('main-tab-panels');

    // Home panel
    const homePanel = document.createElement('div');
    homePanel.classList.add('main-tab-panel', 'active');
    homePanel.id = 'main-tab-home';
    homePanel.setAttribute('role', 'tabpanel');
    homePanel.setAttribute('aria-labelledby', 'main-tab-home-button');

    homeSections.forEach((section, index) => {
      if (!section.title) {
        return;
      }
      const sectionEl = buildSection(section, index);
      homePanel.appendChild(sectionEl);
    });


    // Research Works & Talks panel
    const researchPanel = document.createElement('div');
    researchPanel.classList.add('main-tab-panel');
    researchPanel.id = 'main-tab-research';
    researchPanel.setAttribute('role', 'tabpanel');
    researchPanel.setAttribute('aria-labelledby', 'main-tab-research-button');

    if (researchSection) {
      researchSection.forEach((section, index) => {
        if (!section.title) {
            return;
            }
        const sectionEl = buildSection(section, index);
        researchPanel.appendChild(sectionEl);
      });
    } else {
      const placeholder = document.createElement('p');
      placeholder.textContent = 'Add your research works and talks here.';
      researchPanel.appendChild(placeholder);
    }

    panelsEl.appendChild(homePanel);
    panelsEl.appendChild(researchPanel);

    const setActiveMainTab = (button, panel) => {
      tabsEl.querySelectorAll('.main-tab-button').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      panelsEl.querySelectorAll('.main-tab-panel').forEach((tabPanel) => {
        tabPanel.classList.remove('active');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      panel.classList.add('active');
    };

    homeButton.addEventListener('click', () => setActiveMainTab(homeButton, homePanel));
    researchButton.addEventListener('click', () => setActiveMainTab(researchButton, researchPanel));

    const wrapper = document.createElement('div');
    wrapper.appendChild(tabsEl);
    wrapper.appendChild(panelsEl);

    return wrapper;
  };

  // Fetch all content files
  console.log('Starting to fetch content files...');
  Promise.all([
    fetch('content/home.md').then(r => {
      if (!r.ok) throw new Error('Failed to load home.md');
      console.log('home.md loaded successfully');
      return r.text();
    }).catch((err) => {
      console.error('Error loading home.md:', err);
      return '## About me\nContent is being loaded...';
    }),
    fetch('content/research.md').then(r => {
      if (!r.ok) throw new Error('Failed to load research.md');
      console.log('research.md loaded successfully');
      return r.text();
    }).catch((err) => {
      console.error('Error loading research.md:', err);
      return 'Add your research works and talks here.';
    })
  ])
    .then(([homeMarkdown, researchMarkdown]) => {
      console.log('All files loaded, starting to parse...');
      // Parse home sections
      const homeHtml = marked.parse(homeMarkdown);
      console.log('Home markdown parsed');
      const homeWrapper = document.createElement('div');
      homeWrapper.innerHTML = homeHtml;

      const homeSections = [];
      let current = null;

      Array.from(homeWrapper.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^H[1-3]$/)) {
          if (current) {
            homeSections.push(current);
          }
          current = { title: node.textContent.trim(), nodes: [] };
        } else {
          if (!current) {
            current = { title: '', nodes: [] };
          }
          current.nodes.push(node);
        }
      });

      if (current) {
        homeSections.push(current);
      }

      // Parse research sections
      const researchHtml = marked.parse(researchMarkdown);
      console.log('Research markdown parsed');
      const researchWrapper = document.createElement('div');
      researchWrapper.innerHTML = researchHtml;

      const researchSections = [];
      current = null;

      Array.from(researchWrapper.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^H[1-3]$/)) {
          if (current) {
            researchSections.push(current);
          }
          current = { title: node.textContent.trim(), nodes: [] };
        } else {
          if (!current) {
            current = { title: '', nodes: [] };
          }
          current.nodes.push(node);
        }
      });

      if (current) {
        researchSections.push(current);
      }

      contentRoot.innerHTML = '';
      console.log('Building tabs...');

      const mainTabsWrapper = buildMainTabs(homeSections, researchSections);
      contentRoot.appendChild(mainTabsWrapper);
      console.log('Content loaded successfully!');
    })
    .catch((error) => {
      console.error('Failed to load markdown content', error);
      contentRoot.innerHTML = '<p style="padding: 20px;">Error loading content. Please check the browser console for details.</p>';
    });
});
