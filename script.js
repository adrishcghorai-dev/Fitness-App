<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
            from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
        import { getFirestore, doc, setDoc } 
            from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

        // Firebase Configuration
        const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "fitnessapp-9e628.firebaseapp.com",
  projectId: "fitnessapp-9e628",
  storageBucket: "fitnessapp-9e628.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Make auth and db available globally
        window.firebaseAuth = auth;
        window.firebaseDB = db;
        window.firebaseInitialized = true;
        
        // Import functions to window for global access
        window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
        window.signInWithEmailAndPassword = signInWithEmailAndPassword;
        window.setDoc = setDoc;
        window.doc = doc;
    </script>
        // Slide Navigation Logic
        let currentSlide = 1;
        const totalSlides = 6;
        
        // Audio Context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Sound effect functions
        function playNavigateSound() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
        
        function playHoverSound() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 1000;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        }
        
        function playClickSound() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1500, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        }
        
        function playSuccessSound() {
            // Three ascending notes
            [800, 1000, 1200].forEach((freq, i) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                const startTime = audioContext.currentTime + (i * 0.1);
                gainNode.gain.setValueAtTime(0.15, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.2);
            });
        }
        
        // Update slide display
        function updateSlide() {
            document.querySelectorAll('.slide').forEach(slide => {
                slide.classList.remove('active');
            });
            document.querySelector(`[data-slide="${currentSlide}"]`).classList.add('active');
            
            // Update dots
            document.querySelectorAll('.dot').forEach(dot => {
                dot.classList.remove('active');
            });
            document.querySelector(`.dot[data-slide="${currentSlide}"]`).classList.add('active');
            
            // Update buttons
            document.getElementById('prevBtn').disabled = currentSlide === 1;
            
            if (currentSlide === 5) {
                document.getElementById('nextBtn').style.display = 'none';
                document.getElementById('getStartedBtn').style.display = 'block';
            } else if (currentSlide === 6) {
                document.getElementById('nextBtn').style.display = 'none';
                document.getElementById('getStartedBtn').style.display = 'none';
            } else {
                document.getElementById('nextBtn').style.display = 'block';
                document.getElementById('getStartedBtn').style.display = 'none';
            }
        }
        
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlide();
                playNavigateSound();
            }
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlide();
                playNavigateSound();
            }
        });
        
        document.getElementById('getStartedBtn').addEventListener('click', () => {
            playSuccessSound();
            currentSlide = 6;
            updateSlide();
        });
        
        // Dot navigation
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.dataset.slide);
                updateSlide();
                playNavigateSound();
            });
        });
        
        // Add hover sounds to all interactive elements
        document.querySelectorAll('.feature-card, .list-item, .advanced-card, .dot, .nav-btn, .sound-btn-login').forEach(element => {
            element.addEventListener('mouseenter', () => {
                playHoverSound();
            });
            
            element.addEventListener('click', () => {
                playClickSound();
            });
        });
        
        // Initialize audio context on first interaction
        document.addEventListener('click', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }, { once: true });

        // Firebase Authentication Logic
        document.addEventListener('DOMContentLoaded', function() {
            const showSignupBtn = document.getElementById('showSignupForm');
            const showLoginBtn = document.getElementById('showLoginForm');
            const loginForm = document.getElementById('loginFormSlide');
            const signupForm = document.getElementById('signupFormSlide');

            // Toggle between Login and Signup forms
            if (showSignupBtn) {
                showSignupBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'block';
                    playClickSound();
                });
            }

            if (showLoginBtn) {
                showLoginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    signupForm.style.display = 'none';
                    loginForm.style.display = 'block';
                    playClickSound();
                });
            }

            // Login Button Handler
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', async () => {
                    const email = document.getElementById('loginEmail').value.trim();
                    const password = document.getElementById('loginPassword').value;

                    if (!email || !password) {
                        alert('Please enter email and password');
                        return;
                    }

                    // Wait for Firebase to initialize
                    if (!window.firebaseInitialized) {
                        alert('Firebase is still loading. Please wait a moment.');
                        return;
                    }

                    try {
                        playSuccessSound();
                        loginBtn.innerHTML = '<span>Logging in...</span>';
                        loginBtn.disabled = true;

                        await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
                        
                        // Success! Redirect to dashboard
                        setTimeout(() => {
                            window.location.href = 'DASH.html';
                        }, 500);

                    } catch (error) {
                        loginBtn.innerHTML = '<span>Log In</span>';
                        loginBtn.disabled = false;
                        
                        let errorMsg = 'Login failed. ';
                        if (error.code === 'auth/invalid-email') {
                            errorMsg += 'Invalid email address.';
                        } else if (error.code === 'auth/user-not-found') {
                            errorMsg += 'No account found with this email.';
                        } else if (error.code === 'auth/wrong-password') {
                            errorMsg += 'Incorrect password.';
                        } else if (error.code === 'auth/invalid-credential') {
                            errorMsg += 'Invalid email or password.';
                        } else {
                            errorMsg += error.message;
                        }
                        alert(errorMsg);
                    }
                });
            }

            // Signup Button Handler
            const signupBtn = document.getElementById('signupBtn');
            if (signupBtn) {
                signupBtn.addEventListener('click', async () => {
                    const name = document.getElementById('signupName').value.trim();
                    const email = document.getElementById('signupEmail').value.trim();
                    const password = document.getElementById('signupPassword').value;
                    const age = document.getElementById('signupAge').value;
                    const gender = document.getElementById('signupGender').value;
                    const height = document.getElementById('signupHeight').value;
                    const weight = document.getElementById('signupWeight').value;
                    const goal = document.getElementById('signupGoal').value;

                    if (!name || !email || !password || !age || !gender || !height || !weight || !goal) {
                        alert('Please fill all fields');
                        return;
                    }

                    if (password.length < 6) {
                        alert('Password must be at least 6 characters');
                        return;
                    }

                    if (!window.firebaseInitialized) {
                        alert('Firebase is still loading. Please wait a moment.');
                        return;
                    }

                    try {
                        playSuccessSound();
                        signupBtn.innerHTML = '<span>Creating Account...</span>';
                        signupBtn.disabled = true;

                        const userCredential = await window.createUserWithEmailAndPassword(
                            window.firebaseAuth, email, password
                        );
                        const user = userCredential.user;

                        // Save user data to Firestore
                        await window.setDoc(window.doc(window.firebaseDB, "users", user.uid), {
                            name,
                            email,
                            age: parseInt(age),
                            gender,
                            height: parseInt(height),
                            weight: parseInt(weight),
                            goal,
                            createdAt: new Date()
                        });

                        // Success! Redirect to dashboard
                        setTimeout(() => {
                            window.location.href = 'DASH.html';
                        }, 500);

                    } catch (error) {
                        signupBtn.innerHTML = '<span>Create Account</span>';
                        signupBtn.disabled = false;
                        
                        let errorMsg = 'Signup failed. ';
                        if (error.code === 'auth/email-already-in-use') {
                            errorMsg += 'This email is already registered.';
                        } else if (error.code === 'auth/weak-password') {
                            errorMsg += 'Password should be at least 6 characters.';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMsg += 'Invalid email address.';
                        } else {
                            errorMsg += error.message;
                        }
                        alert(errorMsg);
                    }
                });
            }

            // Enter key navigation for Login form
            const loginEmail = document.getElementById('loginEmail');
            const loginPassword = document.getElementById('loginPassword');

            if (loginEmail) {
                loginEmail.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        loginPassword.focus();
                        playClickSound();
                    }
                });
            }

            if (loginPassword) {
                loginPassword.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('loginBtn').click();
                    }
                });
            }

            // Enter key navigation for Signup form
            const signupInputs = [
                document.getElementById('signupName'),
                document.getElementById('signupEmail'),
                document.getElementById('signupPassword'),
                document.getElementById('signupAge'),
                document.getElementById('signupGender'),
                document.getElementById('signupHeight'),
                document.getElementById('signupWeight'),
                document.getElementById('signupGoal')
            ];

            signupInputs.forEach((input, index) => {
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (index < signupInputs.length - 1) {
                                signupInputs[index + 1].focus();
                            } else {
                                document.getElementById('signupBtn').click();
                            }
                            playClickSound();
                        }
                    });
                }
            });
        });
   
