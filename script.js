/* ==========================================
   JAVASCRIPT LOGIC FOR ANNIVERSARY WEB APP
   Interactions, Canvas Hearts, Timer, & Typing
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- CONFIGURATION ---
    // Change your anniversary date here (Format: YYYY-MM-DDTHH:MM:SS)
    const anniversaryStartDate = new Date('2024-06-11T00:00:00');
    
    // Love Letter Content (support \n for line breaks)
    const letterText = `Happy Anniversary, Sayang! ❤️

Tidak terasa waktu berjalan begitu cepat, dan hari ini kita kembali merayakan perjalanan kebersamaan kita. Setiap detik yang kulewati bersamamu selalu dipenuhi dengan kehangatan, tawa, dan kebahagiaan yang luar biasa.

Terima kasih telah menjadi pasangan terbaik, pendengar yang paling sabar, dan penyemangat di setiap langkahku. Bersamamu, aku belajar arti mencintai dan dihargai dengan tulus. Aku sangat bersyukur memilikimu di hidupku.

Semoga hubungan kita selalu dirahmati, penuh dengan kedewasaan, rasa saling memahami, dan cinta yang terus bertumbuh setiap harinya. Aku ingin terus menulis bab-bab indah selanjutnya dalam hidupku... bersamamu.

I love you to the moon and back, now and forever.`;
    
    // Typing speed in milliseconds per character
    const typingSpeed = 60;
    // ---------------------

    // 2. DOM Elements
    const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
    const envelopeScreen = document.getElementById('envelopeScreen');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const typingTextEl = document.getElementById('typingText');

    // 3. Envelope opening interaction
    openEnvelopeBtn.addEventListener('click', () => {
        // Play music (audio can only be played after user interaction)
        playMusic();
        
        // Add fade-out animation to splash screen
        envelopeScreen.classList.add('fade-out');
        
        // Show main content
        mainContent.classList.remove('hide');
        
        // Delay typing effect slightly after screen transition
        setTimeout(() => {
            startTypingEffect();
        }, 1200);
        
        // Refresh Lucide icons inside the main content if needed
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // 4. Background Music Control
    function playMusic() {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            updateMusicIcon(true);
        }).catch(err => {
            console.log("Autoplay music was prevented or failed: ", err);
        });
    }

    function toggleMusic() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
            updateMusicIcon(true);
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            updateMusicIcon(false);
        }
    }

    function updateMusicIcon(isPlaying) {
        const iconContainer = musicToggle.querySelector('i');
        if (isPlaying) {
            iconContainer.setAttribute('data-lucide', 'music');
        } else {
            iconContainer.setAttribute('data-lucide', 'music-4');
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // 5. Love Letter Typing Effect
    let charIndex = 0;
    function startTypingEffect() {
        if (charIndex < letterText.length) {
            typingTextEl.textContent += letterText.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingEffect, typingSpeed);
        }
    }

    // 6. Time Count-Up Timer Calculator
    function updateCounter() {
        const now = new Date();
        
        let diffMs = now - anniversaryStartDate;
        if (diffMs < 0) {
            // If date is in the future
            document.getElementById('yearsVal').textContent = '00';
            document.getElementById('monthsVal').textContent = '00';
            document.getElementById('daysVal').textContent = '00';
            document.getElementById('hoursVal').textContent = '00';
            document.getElementById('minutesVal').textContent = '00';
            document.getElementById('secondsVal').textContent = '00';
            return;
        }

        // Exact Date Math for Years, Months, and Days
        let years = now.getFullYear() - anniversaryStartDate.getFullYear();
        let months = now.getMonth() - anniversaryStartDate.getMonth();
        let days = now.getDate() - anniversaryStartDate.getDate();

        if (days < 0) {
            // Borrow days from previous month
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        // Remainder time in Hours, Minutes, Seconds
        let hours = now.getHours() - anniversaryStartDate.getHours();
        let minutes = now.getMinutes() - anniversaryStartDate.getMinutes();
        let seconds = now.getSeconds() - anniversaryStartDate.getSeconds();

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            // Subtract one day since hours wrapped around, 
            // but we already computed exact days using dates so we usually don't need to adjust days here 
            // unless time zone / local hours shift. Let's make it robust:
        }

        // Format single digit with leading zero
        const pad = (num) => String(num).padStart(2, '0');

        document.getElementById('yearsVal').textContent = pad(years);
        document.getElementById('monthsVal').textContent = pad(months);
        document.getElementById('daysVal').textContent = pad(days);
        
        document.getElementById('hoursVal').textContent = pad(hours);
        document.getElementById('minutesVal').textContent = pad(minutes);
        document.getElementById('secondsVal').textContent = pad(seconds);
    }

    // Start timer interval
    updateCounter();
    setInterval(updateCounter, 1000);

    // 7. Floating Hearts Background Animation (Canvas)
    const canvas = document.getElementById('heartsCanvas');
    const ctx = canvas.getContext('2d');

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    window.addEventListener('resize', () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    });

    class Heart {
        constructor() {
            this.reset();
            // Start at random Y positions initially to fill screen
            this.y = Math.random() * canvasHeight;
        }

        reset() {
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + Math.random() * 100;
            this.size = Math.random() * 8 + 6; // Heart scale factor
            this.speed = Math.random() * 1.2 + 0.6; // Upward speed
            this.opacity = Math.random() * 0.4 + 0.15; // Semi-transparent
            this.wiggleSpeed = Math.random() * 0.02 + 0.005;
            this.wiggleRange = Math.random() * 1.5 + 0.5;
            this.angle = Math.random() * Math.PI * 2;
            
            // Variasi warna merah, putih, dan rose gelap romantis
            const colorPalette = [
                'rgba(230, 57, 70, ',  // Crimson Red
                'rgba(155, 34, 38, ',  // Deep Ruby Red
                'rgba(255, 255, 255, ', // Translucent White
                'rgba(224, 36, 62, '   // Soft Pinkish Red
            ];
            this.colorBase = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        }

        update() {
            this.y -= this.speed;
            this.angle += this.wiggleSpeed;
            this.x += Math.sin(this.angle) * this.wiggleRange;

            // Reset when heart goes off screen
            if (this.y < -30 || this.x < -30 || this.x > canvasWidth + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            
            const size = this.size;
            // Draw a beautiful heart vector path using bezier curves
            ctx.moveTo(0, -size / 4);
            ctx.bezierCurveTo(-size / 2, -size * 0.75, -size, -size * 0.3, 0, size);
            ctx.bezierCurveTo(size, -size * 0.3, size / 2, -size * 0.75, 0, -size / 4);
            
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            ctx.fill();
            ctx.restore();
        }
    }

    // Generate pool of hearts
    const hearts = [];
    const heartCount = 35; // Balance performance & aesthetics
    for (let i = 0; i < heartCount; i++) {
        hearts.push(new Heart());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
});
