// Function to request microphone permission first
function requestMicPermission() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Requesting microphone permission...");

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                console.log("Microphone access granted.");
                startBlowDetection(stream); // Start blow detection if permission is granted
            })
            .catch(function (err) {
                console.log("Microphone access denied: " + err);
            });
    } else {
        console.log("getUserMedia not supported on your browser.");
    }
}

// Function to start blow detection after permission is granted
function startBlowDetection(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;

        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const averageVolume = sum / bufferLength;

        if (averageVolume > 40) {  // Threshold can be adjusted
            blowOutCandle();
        }

        requestAnimationFrame(detectBlow);
    }

    detectBlow();
}

// Function to run when the candle is blown out
function blowOutCandle() {
    console.log("Happy birthday Winit!");

    // Stop the flame animation
    const flames = document.querySelectorAll('.fuego');
    flames.forEach(flame => {
        flame.style.animation = 'none';  // Stop the flame animation
        flame.style.opacity = 0;         // Make the flames disappear
    });

    // Play the birthday song
    const audio = document.getElementById('birthday-song');
    audio.play();

    // Start confetti effect
    startConfetti();
}

// Function to create a confetti effect
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const confettiCount = 200; // Number of confetti particles

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate random confetti particles
    const particles = [];
    for (let i = 0; i < confettiCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            velocityX: Math.random() * 6 - 3,
            velocityY: Math.random() * 6 - 3
        });
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            // Update particle position
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.05; // Gravity effect

            // Reset particle if it goes off screen
            if (particle.x > canvas.width || particle.x < 0 || particle.y > canvas.height) {
                particle.x = Math.random() * canvas.width;
                particle.y = 0;
            }
        });

        requestAnimationFrame(animateConfetti);
    }

    animateConfetti();
}

// Request microphone permission and start detection
requestMicPermission();
