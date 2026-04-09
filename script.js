document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. 메인 화면 타이핑 효과 (톤앤매너 완벽 일치)
    // ==========================================================================
    const typingContainer = document.getElementById('typing-container');
    if (typingContainer) {
        const textToType = "기획자 진주형 입니다.";
        let charIndex = 0;
        
        typingContainer.innerHTML = '';
        
        function typeWriter() {
            if (charIndex < textToType.length) {
                let htmlOutput = "";
                
                for (let i = 0; i <= charIndex; i++) {
                    let char = textToType[i];
                    
                    if (i >= 4 && i <= 6) { 
                        htmlOutput += `<span class="text-big colored-name">${char}</span>`;
                    } else {
                        htmlOutput += `<span class="text-small">${char}</span>`;
                    }
                }
                
                typingContainer.innerHTML = htmlOutput;
                charIndex++;
                setTimeout(typeWriter, 120);
            }
        }
        setTimeout(typeWriter, 800);
    }

    // ==========================================================================
    // 1. 다크모드/라이트모드 토글 (무조건 라이트모드로 시작 고정)
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    localStorage.removeItem('theme'); 
    htmlElement.removeAttribute('data-theme');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.removeAttribute('data-theme');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
            }
        });
    }

    // ==========================================================================
    // 2. 부드러운 스크롤 이동 (Smooth Scrolling)
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // ==========================================================================
        // 3. 상단 메뉴 및 우측 별 메뉴 스크롤 연동 밑줄 효과
        // ==========================================================================
        const sections = document.querySelectorAll('section');
        const sideNavLinks = document.querySelectorAll('.side-star');
        const topNavLinks = document.querySelectorAll('header nav ul li a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            sideNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            topNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // ==========================================================================
        // 4. My Skills 섹션 게이지 차오르는 애니메이션
        // ==========================================================================
        const progressCircles = document.querySelectorAll('.progress-circle');
        const skillPercents = document.querySelectorAll('.skill-percent');
        
        if (progressCircles.length > 0) {
            ScrollTrigger.create({
                trigger: "#experience",
                start: "top 75%", 
                onEnter: () => {
                    progressCircles.forEach((circle, index) => {
                        const target = parseInt(circle.getAttribute('data-target'));
                        const offset = 283 - (283 * target) / 100;
                        
                        gsap.to(circle, {
                            strokeDashoffset: offset,
                            duration: 1.5,
                            ease: "power3.out",
                            delay: index * 0.05
                        });

                        let percentObj = { val: 0 };
                        gsap.to(percentObj, {
                            val: target,
                            duration: 1.5,
                            ease: "power3.out",
                            delay: index * 0.05,
                            onUpdate: () => {
                                if (skillPercents[index]) {
                                    skillPercents[index].innerText = Math.floor(percentObj.val) + "%";
                                }
                            }
                        });
                    });
                },
                once: true 
            });
        }

        // ==========================================================================
        // 5. GSAP 요소들 스크롤 시 스르륵 나타나기
        // ==========================================================================
        const revealElements = document.querySelectorAll('.gsap-reveal');
        revealElements.forEach((el) => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", 
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    }

    // ==========================================================================
    // 6. 이메일 & 전화번호 원클릭 복사 기능
    // ==========================================================================
    const copyToast = document.getElementById('copy-toast');
    let toastTimeout;

    function showToast(message) {
        if (!copyToast) return;
        copyToast.innerText = message; 
        copyToast.classList.add('show');
        
        clearTimeout(toastTimeout);
        
        toastTimeout = setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2500);
    }

    const emailBox = document.getElementById('email-box');
    const userEmail = document.getElementById('user-email');
    if (emailBox && userEmail) {
        emailBox.addEventListener('click', () => {
            navigator.clipboard.writeText(userEmail.innerText).then(() => {
                showToast('이메일이 복사되었습니다!');
            });
        });
    }

    const phoneBox = document.getElementById('phone-box');
    const userPhone = document.getElementById('user-phone');
    if (phoneBox && userPhone) {
        phoneBox.addEventListener('click', () => {
            navigator.clipboard.writeText(userPhone.innerText).then(() => {
                showToast('연락처가 복사되었습니다!');
            });
        });
    }

    // ==========================================================================
    // 🔥 7. 상단 스크롤 진행률 바 (Scroll Progress)
    // ==========================================================================
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

});