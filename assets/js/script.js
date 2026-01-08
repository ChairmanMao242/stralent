function equalHeight(groups) {
    groups.forEach(group => {
        const elements = Array.isArray(group) ? group : Array.from(group);
        let tallest = 0;
        elements.forEach(el => {
            el.style.height = 'auto'; // reset before measuring
            const elHeight = el.offsetHeight;
            if (elHeight > tallest) {
                tallest = elHeight;
            }
        });
        elements.forEach(el => {
            el.style.height = tallest + 'px';
        });
    });
}

window.addEventListener('load', () => {
    equalHeight([
        document.querySelectorAll('.metodo__box'),
    ]);
});

window.addEventListener('resize', () => {
    equalHeight([
        document.querySelectorAll('.metodo__box'),
    ]);
});

// Load header menu template
fetch('./template-parts/header-menu.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header-menu').innerHTML = html;

        // on click on #j-menu-btn toggle class menu--opened on body
        document.getElementById('j-menu-btn').addEventListener('click', () => {
            document.body.classList.toggle('menu--opened');
        });
    });

// Generic template loader
const templates = {};

function loadTemplate(name, templatePath, containerId) {
    fetch(templatePath)
        .then(response => response.text())
        .then(html => {
            templates[name] = html;
            
            // Load into container if present
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
            }
        });
}

// Load templates
loadTemplate('contatti', './template-parts/contatti.html', 'contatti');
loadTemplate('newsletter', './template-parts/newsletter.html', 'newsletter');

// Generic modal manager
function initModal(modalId, templateHTML) {
    if (!document.getElementById(modalId)) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'contatti-modal';
        modal.innerHTML = `
            <div class="contatti-modal__overlay"></div>
            <div class="contatti-modal__content">
                <div class="modal-body"></div>
            </div>
        `;
        const closeBtn = '<button class="contatti-modal__close" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 233.4L59.5 100.9 36.9 123.5 169.4 256 36.9 388.5l22.6 22.6L192 278.6 324.5 411.1l22.6-22.6L214.6 256 347.1 123.5l-22.6-22.6L192 233.4z"/></svg></button>';
        document.body.appendChild(modal);

        // Load template content
        modal.querySelector('.modal-body').innerHTML = templateHTML;
        modal.querySelector('.contatti__form').insertAdjacentHTML('beforeend', closeBtn);
        
        // Move title and text inside form
        const title = modal.querySelector('.contatti__title');
        const text = modal.querySelector('.contatti__text');
        const form = modal.querySelector('.contatti__form');
        if (title && form) {
            form.insertBefore(title, form.firstChild);
        }
        if (text && form) {
            form.insertBefore(text, form.children[1]);
        }
        
        // Bind close events
        modal.querySelector('.contatti-modal__overlay').addEventListener('click', () => closeModal(modalId));
        modal.querySelector('.contatti-modal__close').addEventListener('click', () => closeModal(modalId));
    }
}

function openModal(modalId, templateName) {
    initModal(modalId, templates[templateName]);
    document.getElementById(modalId).classList.add('contatti-modal--open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('contatti-modal--open');
        document.body.style.overflow = '';
    }
}

// Bind modal links
document.addEventListener('click', (e) => {
    if (e.target.closest('a[href="#contatti"]')) {
        e.preventDefault();
        openModal('contatti-modal', 'contatti');
    }
    if (e.target.closest('a[href="#newsletter"]')) {
        e.preventDefault();
        openModal('newsletter-modal', 'newsletter');
    }
});

// Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion__item');
    const alphabetButtons = document.querySelectorAll('.accordion__alphabet button');
    
    const scrollToAccordionItem = (target) => {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 10;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const openAndScrollItem = (item) => {
        // Chiudi tutti
        accordionItems.forEach(otherItem => otherItem.classList.remove('active'));

        // Attendi la chiusura degli altri prima di aprire e scrollare
        setTimeout(() => {
            item.classList.add('active');
            // Attendi il reflow dell'apertura prima di calcolare la posizione
            requestAnimationFrame(() => scrollToAccordionItem(item));
        }, 500);
    };

    // Gestione apertura/chiusura accordion
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (isActive) {
                // Se già aperto, lo chiudiamo e basta
                item.classList.remove('active');
                return;
            }
            openAndScrollItem(item);
        });
    });
    
    // Identifica quali lettere hanno voci
    const availableLetters = new Set();
    accordionItems.forEach(item => {
        const letter = item.getAttribute('data-letter');
        if (letter) {
            availableLetters.add(letter);
        }
    });
    
    // Disabilita le lettere senza voci
    alphabetButtons.forEach(button => {
        const letter = button.getAttribute('data-letter');
        if (!availableLetters.has(letter)) {
            button.disabled = true;
        } else {
            // Aggiungi click handler per le lettere disponibili
            button.addEventListener('click', () => {
                // Rimuovi active da tutti i bottoni
                alphabetButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Trova il primo item con questa lettera
                const firstItem = document.querySelector(`.accordion__item[data-letter="${letter}"]`);
                if (firstItem) {
                    openAndScrollItem(firstItem);
                }
            });
        }
    });

    // Search filter functionality
    const searchInput = document.getElementById('glossary-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            accordionItems.forEach(item => {
                const title = item.querySelector('.accordion__title').textContent.toLowerCase();
                const content = item.querySelector('.accordion__content').textContent.toLowerCase();
                
                if (searchTerm === '' || title.includes(searchTerm) || content.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // Aggiorna le lettere disponibili in base ai risultati filtrati
            const visibleLetters = new Set();
            accordionItems.forEach(item => {
                if (item.style.display !== 'none') {
                    const letter = item.getAttribute('data-letter');
                    if (letter) visibleLetters.add(letter);
                }
            });

            alphabetButtons.forEach(button => {
                const letter = button.getAttribute('data-letter');
                if (!availableLetters.has(letter) || !visibleLetters.has(letter)) {
                    button.disabled = true;
                } else {
                    button.disabled = false;
                }
            });
        });
    }
});
