document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Hero Canvas: 真鍮パーティクル・アトモスフィア演出
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 45;

        function updateCanvasDimensions() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.3;
                this.speedY = -(Math.random() * 0.3 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
            }

            // ウィンドウサイズ変更時に座標を領域内に収める（クランプ処理）
            clampPosition() {
                if (this.x > canvas.width) this.x = Math.random() * canvas.width;
                if (this.y > canvas.height) this.y = Math.random() * canvas.height;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.opacity -= this.fadeSpeed;

                if (this.opacity <= 0 || this.y < 0) {
                    this.reset();
                    this.y = canvas.height;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        // 軽快な動作を実現するデバウンス（Debounce）関数
        function debounce(func, delay) {
            let timer;
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        }

        // リサイズ時の軽量な画面枠調整
        const handleResize = debounce(() => {
            updateCanvasDimensions();
            particles.forEach(p => p.clampPosition());
        }, 150);

        window.addEventListener('resize', handleResize);

        updateCanvasDimensions();
        initParticles();
        animateParticles();
    }

    /* ==========================================================================
       2. Intersection Observer: スクロール表示アニメーション
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.editorial-section').forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       3. フォーム送信イベント処理 (インライン・サンクスメッセージ切替)
       ========================================================================== */
    const loyaltyForm = document.getElementById('loyalty-form');
    if (loyaltyForm) {
        loyaltyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('loyalty-email');
            
            if (emailInput && emailInput.value) {
                const userEmail = emailInput.value;
                const formParent = loyaltyForm.parentElement;

                // フォームをフェードアウトさせてスムーズに消去
                loyaltyForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                loyaltyForm.style.opacity = '0';
                loyaltyForm.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    loyaltyForm.style.display = 'none';

                    // サンクスメッセージ要素の生成
                    const successMsg = document.createElement('div');
                    successMsg.className = 'loyalty-success-msg';
                    successMsg.innerHTML = `
                        <span class="loyalty-success-title">Welcome to the Secret Circle</span>
                        <span class="loyalty-success-sub">Invitation sent to ${userEmail}</span>
                    `;

                    formParent.appendChild(successMsg);

                    // 次のフレームでクラスを付与してCSS切り替えアニメーションを発動
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            successMsg.classList.add('visible');
                        });
                    });
                }, 400);
            }
        });
    }

});