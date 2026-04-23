class KeyMirror {
    constructor(config = {}) {
        this.config = {
            turboIntervalMs: 18,
            burstTapCount: 4,
            burstTapSpacingMs: 14,
            autoPlayEnabled: true,
            autoPlayMinMs: 120,
            autoPlayMaxMs: 260,
            ...config
        };

        this.isArrowPressed = false;
        this.turboTimer = null;
        this.autoPlayTimer = null;
        this.setupControls();
        this.startAutoPlay();
    }

    createKeyboardEvent(type) {
        return new KeyboardEvent(type, {
            key: 'w',
            code: 'KeyW',
            keyCode: 87,
            which: 87,
            bubbles: true,
            cancelable: true
        });
    }

    pressW() {
        document.dispatchEvent(this.createKeyboardEvent('keydown'));
    }

    releaseW() {
        document.dispatchEvent(this.createKeyboardEvent('keyup'));
    }

    tapW() {
        this.pressW();
        requestAnimationFrame(() => this.releaseW());
    }

    runBurst() {
        for (let i = 0; i < this.config.burstTapCount; i++) {
            setTimeout(() => this.tapW(), i * this.config.burstTapSpacingMs);
        }
    }

    startTurbo() {
        if (this.turboTimer) return;
        this.turboTimer = setInterval(() => {
            this.tapW();
        }, this.config.turboIntervalMs);
    }

    stopTurbo() {
        if (!this.turboTimer) return;
        clearInterval(this.turboTimer);
        this.turboTimer = null;
    }

    scheduleAutoPlayTap() {
        if (!this.config.autoPlayEnabled || this.isArrowPressed) return;

        this.tapW();
        const delay =
            this.config.autoPlayMinMs +
            Math.random() * (this.config.autoPlayMaxMs - this.config.autoPlayMinMs);

        this.autoPlayTimer = setTimeout(() => this.scheduleAutoPlayTap(), delay);
    }

    startAutoPlay() {
        if (!this.config.autoPlayEnabled) return;
        this.scheduleAutoPlayTap();
    }

    stopAutoPlay() {
        if (!this.autoPlayTimer) return;
        clearTimeout(this.autoPlayTimer);
        this.autoPlayTimer = null;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code !== 'ArrowUp' || this.isArrowPressed) return;

            this.isArrowPressed = true;
            this.stopAutoPlay();

            this.pressW();
            this.runBurst();
            this.startTurbo();

            console.log('🔥 EXTREME MODE: ArrowUp activó turbo + ráfagas automáticas en W.');
        });

        document.addEventListener('keyup', (e) => {
            if (e.code !== 'ArrowUp' || !this.isArrowPressed) return;

            this.isArrowPressed = false;
            this.stopTurbo();
            this.releaseW();
            this.runBurst();
            this.startAutoPlay();

            console.log('⚡ ArrowUp liberado: reinicio de autoplayer agresivo.');
        });
    }
}

const keyMirror = new KeyMirror();
console.log('✅ BOT EXTREMO LISTO: usa ArrowUp para activar control ultra agresivo en W.');
