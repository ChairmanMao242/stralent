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


