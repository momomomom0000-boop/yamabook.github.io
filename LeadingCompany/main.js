const translations = {
    en: {
        heroTitle: 'Architecting enduring systems<br>for the next century.',
        heroDescription: 'Empowering core enterprise infrastructure with rigorous engineering, timeless architecture, and uncompromising quality since 2001.',
        visionTitle: 'Engineering the backbone of tomorrow, with absolute clarity.',
        visionQuote: '"We are not merely executing specifications. We serve as a trusted engineering partner addressing the core of enterprise challenges."',

        home: 'Home',
        company: 'Company',
        members: 'Team',
        cases: 'Selected Work',
        careers: 'Careers',
        contact: 'Contact',
        navigation: 'Navigation',
        support: 'Support & Contact',
        language: 'Language',

        companyTitle: 'Corporate Profile',
        caseTitle: 'Selected Case Studies',
        caseIntro: 'A selection of engineering engagements shaped around the core of each business challenge and designed for reliable, long-term operation.',
        membersTitle: 'Expert Team',
        inquiryTitle: 'Get in Touch',

        nameLabel: 'Full Name',
        organizationLabel: 'Company / Organization',
        emailLabel: 'Email Address',
        messageLabel: 'Inquiry Details',
        send: 'Submit Inquiry',
        namePlaceholder: 'Jane Doe',
        organizationPlaceholder: 'Company name',
        emailPlaceholder: 'jane@example.com',
        messagePlaceholder: 'Please describe your project scope, technical requirements, or timeline.'
    }
};

function applyTranslations(language) {
    const dictionary = translations[language];
    const isJapanese = language === 'ja' || !dictionary;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        if (!Object.prototype.hasOwnProperty.call(element.dataset, 'i18nOriginal')) {
            element.dataset.i18nOriginal = element.innerHTML;
        }

        const translation = dictionary && dictionary[element.dataset.i18n];
        element.innerHTML = translation || element.dataset.i18nOriginal;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        if (!Object.prototype.hasOwnProperty.call(element.dataset, 'i18nPlaceholderOriginal')) {
            element.dataset.i18nPlaceholderOriginal = element.getAttribute('placeholder') || '';
        }

        const translation = dictionary && dictionary[element.dataset.i18nPlaceholder];
        element.setAttribute('placeholder', translation || element.dataset.i18nPlaceholderOriginal);
    });

    document.documentElement.lang = isJapanese ? 'ja' : language;
}

document.addEventListener('DOMContentLoaded', () => {
    const languageSelects = document.querySelectorAll('[data-language-select]');
    languageSelects.forEach((select) => {
        select.addEventListener('change', () => applyTranslations(select.value));
    });
    applyTranslations(languageSelects[0] ? languageSelects[0].value : 'ja');

    // 1. Lenis Smooth Scroll の初期化
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. ページロード時のフェードイン制御（初期表示のちらつき防止）
    requestAnimationFrame(() => {
        document.body.classList.add('fade-in');
    });

    // 3. モバイルハンバーガーメニューの制御
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // メニュー内リンククリック時に閉じる
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('open');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // 4. アンカーリンク（#）の Lenis 連携スムーズスクロール
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetElement, {
                        offset: -80,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ※不要なページ間フェードアウト処理（setTimeoutによる強制遅延）は完全撤廃し、
    // ブラウザ本来の高速で快適なページ遷移にネイティブ対応させました。
});