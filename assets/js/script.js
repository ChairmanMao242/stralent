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
