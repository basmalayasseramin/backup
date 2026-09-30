/* =========================================================
   NEXUS 2050
   INTERACTIVE CLIMATE EXPERIENCE
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);


/* =========================================================
   PAGE READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initLoader();

    initNavigation();

    initParticles();

    initScrollReveal();

    initCounters();

    initMission();

    initTechButton();

    initFinalButton();

    initMouseParallax();

    initKeyboardNavigation();

});


/* =========================================================
   01 — FUTURE LOADER
   ========================================================= */

function initLoader() {

    const loader = $(".preloader");

    if (!loader) return;

    const progress = $(".loader-progress div");
    const percent = $(".loader-percent");
    const status = $(".loader-status");

    let value = 0;

    const statuses = [
        "INITIALIZING CLIMATE CORE",
        "LOADING PLANETARY DATA",
        "CALIBRATING ATMOSPHERE",
        "CONNECTING FUTURE NETWORK",
        "ANALYZING GLOBAL SYSTEMS",
        "SYSTEM READY"
    ];

    let statusIndex = 0;

    const interval = setInterval(() => {

        value += Math.floor(Math.random() * 7) + 2;

        if (value >= 100) {
            value = 100;
            clearInterval(interval);
        }

        if (progress) {
            progress.style.width = `${value}%`;
        }

        if (percent) {
            percent.textContent = `${value}%`;
        }

        const newIndex = Math.min(
            Math.floor(value / 18),
            statuses.length - 1
        );

        if (newIndex !== statusIndex) {
            statusIndex = newIndex;

            if (status) {
                status.textContent = statuses[statusIndex];
            }
        }

        if (value === 100) {

            setTimeout(() => {

                loader.classList.add("hide");

                document.body.classList.add("loaded");

                revealHero();

            }, 500);
        }

    }, 80);
}


/* =========================================================
   HERO REVEAL
   ========================================================= */

function revealHero() {

    const hero = $(".hero");

    if (!hero) return;

    setTimeout(() => {
        hero.classList.add("visible");
    }, 100);
}


/* =========================================================
   02 — NAVIGATION
   ========================================================= */

function initNavigation() {

    const links = $$(".nav-link");

    if (!links.length) return;

    links.forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            const target = $(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    const sections = $$("section[id]");

    if (!sections.length) return;

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                links.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${id}`
                    );

                });

            });

        },
        {
            threshold: 0.25
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });
}


/* =========================================================
   03 — PARTICLE SYSTEM
   ========================================================= */

function initParticles() {

    const canvas = $("#particleCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;

    let particles = [];

    const mouse = {
        x: null,
        y: null,
        radius: 140
    };


    function resize() {

        const ratio =
            Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );

        createParticles();
    }


    function createParticles() {

        const count =
            width < 700 ? 45 : 90;

        particles = [];

        for (let i = 0; i < count; i++) {

            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,

                vx:
                    (Math.random() - 0.5)
                    * 0.25,

                vy:
                    (Math.random() - 0.5)
                    * 0.25,

                size:
                    Math.random() * 1.7 + 0.4,

                alpha:
                    Math.random() * 0.55 + 0.1
            });
        }
    }


    function connectParticles() {

        const maxDistance = 115;

        for (let i = 0; i < particles.length; i++) {

            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {

                const a = particles[i];
                const b = particles[j];

                const dx = a.x - b.x;
                const dy = a.y - b.y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if (distance > maxDistance) continue;

                const opacity =
                    (1 - distance / maxDistance)
                    * 0.09;

                ctx.beginPath();

                ctx.strokeStyle =
                    `rgba(0,245,160,${opacity})`;

                ctx.lineWidth = 0.5;

                ctx.moveTo(a.x, a.y);

                ctx.lineTo(b.x, b.y);

                ctx.stroke();
            }
        }
    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        particles.forEach(p => {

            p.x += p.vx;
            p.y += p.vy;


            if (p.x < -10) p.x = width + 10;

            if (p.x > width + 10) p.x = -10;

            if (p.y < -10) p.y = height + 10;

            if (p.y > height + 10) p.y = -10;


            if (mouse.x !== null) {

                const dx =
                    p.x - mouse.x;

                const dy =
                    p.y - mouse.y;

                const distance =
                    Math.sqrt(
                        dx * dx + dy * dy
                    );

                if (
                    distance < mouse.radius &&
                    distance > 0
                ) {

                    const force =
                        (mouse.radius - distance)
                        / mouse.radius;

                    p.x +=
                        (dx / distance)
                        * force
                        * 0.7;

                    p.y +=
                        (dy / distance)
                        * force
                        * 0.7;
                }
            }


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(0,245,160,${p.alpha})`;

            ctx.fill();
        });

        connectParticles();

        requestAnimationFrame(animate);
    }


    window.addEventListener(
        "resize",
        resize
    );


    window.addEventListener(
        "mousemove",
        event => {

            mouse.x = event.clientX;
            mouse.y = event.clientY;

        }
    );


    window.addEventListener(
        "mouseleave",
        () => {

            mouse.x = null;
            mouse.y = null;

        }
    );


    resize();

    animate();
}


/* =========================================================
   04 — SCROLL REVEAL
   ========================================================= */

function initScrollReveal() {

    const elements = $$(
        ".section, .final-section, .sources"
    );

    if (!elements.length) return;


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {
            element.classList.add("visible");
        });

        return;
    }


    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );
                }

            });

        },
        {
            threshold: 0.12
        }
    );


    elements.forEach(element => {
        observer.observe(element);
    });
}


/* =========================================================
   05 — ANIMATED STATISTICS
   ========================================================= */

function initCounters() {

    const cards = $$(".stat-card");

    if (!cards.length) return;


    const animateNumber = (
        element,
        target,
        decimals = 0
    ) => {

        if (!element) return;

        const duration = 1700;

        const startTime = performance.now();

        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                clamp(
                    elapsed / duration,
                    0,
                    1
                );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const value =
                target * eased;

            element.textContent =
                decimals > 0
                    ? value.toFixed(decimals)
                    : Math.round(value);

            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            } else {

                element.textContent =
                    decimals > 0
                        ? target.toFixed(decimals)
                        : target;
            }
        }

        requestAnimationFrame(update);
    };


    cards.forEach(card => {

        const number =
            $(".stat-number", card);

        if (!number) return;


        const raw =
            number.dataset.value ||
            number.textContent
                .replace(/[^\d.]/g, "");


        const target =
            parseFloat(raw);


        if (!Number.isFinite(target)) return;


        const decimals =
            raw.includes(".")
                ? raw.split(".")[1].length
                : 0;


        number.dataset.value = target;

        number.textContent = "0";


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            animateNumber(
                                number,
                                target,
                                decimals
                            );

                            observer.unobserve(
                                card
                            );
                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );


        observer.observe(card);

    });
}


/* =========================================================
   06 — FUTURE CITY MISSION
   ========================================================= */

function initMission() {

    const options =
        $$(".mission-option");

    if (!options.length) return;


    const scoreElement =
        $(".mission-score strong");

    const scoreBar =
        $(".score-track span");

    const budgetElement =
        $(".mission-budget strong");

    const budgetBar =
        $(".budget-bar span");

    const city =
        $(".future-city");

    const resetButton =
        $(".mission-reset");


    let budget = 100;

    let score = 32;


    const selected = new Set();


    const saved =
        loadMission();


    if (saved) {

        budget = saved.budget;
        score = saved.score;

        saved.selected.forEach(
            item => selected.add(item)
        );

    }


    function updateUI() {

        if (budgetElement) {

            budgetElement.textContent =
                `${Math.round(budget)}%`;
        }


        if (budgetBar) {

            budgetBar.style.width =
                `${clamp(budget, 0, 100)}%`;
        }


        if (scoreElement) {

            scoreElement.textContent =
                `${Math.round(score)}`;
        }


        if (scoreBar) {

            scoreBar.style.width =
                `${clamp(score, 0, 100)}%`;
        }


        options.forEach(option => {

            const id =
                option.dataset.id;

            option.classList.toggle(
                "selected",
                selected.has(id)
            );

        });


        updateCity();

        saveMission();
    }


    options.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const id =
                    option.dataset.id ||
                    option.textContent.trim();


                const cost =
                    parseInt(
                        option.dataset.cost || "15",
                        10
                    );


                const impact =
                    parseInt(
                        option.dataset.impact || "10",
                        10
                    );


                if (selected.has(id)) {

                    selected.delete(id);

                    budget += cost;

                    score -= impact;

                } else {

                    if (budget < cost) {

                        showMissionMessage(
                            "ENERGY BUDGET EXCEEDED"
                        );

                        shakeElement(option);

                        return;
                    }


                    selected.add(id);

                    budget -= cost;

                    score += impact;
                }


                score =
                    clamp(score, 0, 100);

                budget =
                    clamp(budget, 0, 100);


                updateUI();

                showMissionMessage(
                    selected.has(id)
                        ? "SOLUTION ACTIVATED"
                        : "SOLUTION DEACTIVATED"
                );

            }
        );

    });


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                selected.clear();

                budget = 100;

                score = 32;

                updateUI();

                showMissionMessage(
                    "CITY SYSTEM RESET"
                );
            }
        );
    }


    updateUI();


    function updateCity() {

        if (!city) return;


        const selectedCount =
            selected.size;


        const buildings =
            $$(".building", city);


        const trees =
            $$(".tree", city);


        const progress =
            clamp(
                selectedCount / Math.max(options.length, 1),
                0,
                1
            );


        buildings.forEach(
            (building, index) => {

                const intensity =
                    progress *
                    (0.3 + index * 0.12);


                building.style.boxShadow =
                    `0 0 ${Math.round(
                        intensity * 35
                    )}px rgba(0,245,160,.35)`;

                building.style.borderColor =
                    `rgba(
                        0,
                        245,
                        160,
                        ${0.15 + progress * .35}
                    )`;
            }
        );


        trees.forEach(
            tree => {

                tree.style.transform =
                    `scale(${1 + progress * .45})`;

                tree.style.background =
                    `rgba(
                        ${Math.round(8 - progress * 4)},
                        ${Math.round(60 + progress * 110)},
                        ${Math.round(50 + progress * 60)},
                        1
                    )`;

            }
        );


        if (progress > .55) {

            city.style.filter =
                "saturate(1.25) brightness(1.08)";

        } else {

            city.style.filter =
                "saturate(1) brightness(1)";
        }
    }
}


/* =========================================================
   MISSION MESSAGE
   ========================================================= */

function showMissionMessage(message) {

    let notification =
        $(".mission-notification");


    if (!notification) {

        notification =
            document.createElement("div");

        notification.className =
            "mission-notification";


        notification.innerHTML = `
            <span class="mission-notification-dot"></span>
            <span class="mission-notification-text"></span>
        `;


        Object.assign(
            notification.style,
            {
                position: "fixed",
                left: "25px",
                bottom: "25px",
                zIndex: "9999",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "13px 18px",
                color: "#00f5a0",
                background: "rgba(2,9,10,.9)",
                border: "1px solid rgba(0,245,160,.25)",
                backdropFilter: "blur(15px)",
                fontFamily: "Orbitron, sans-serif",
                fontSize: "8px",
                letterSpacing: "1px",
                transform: "translateY(20px)",
                opacity: "0",
                transition: ".35s"
            }
        );


        const dot =
            $(".mission-notification-dot", notification);


        Object.assign(
            dot.style,
            {
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00f5a0",
                boxShadow: "0 0 10px #00f5a0"
            }
        );


        document.body.appendChild(
            notification
        );
    }


    const text =
        $(".mission-notification-text", notification);


    if (text) {
        text.textContent = message;
    }


    requestAnimationFrame(() => {

        notification.style.opacity = "1";

        notification.style.transform =
            "translateY(0)";
    });


    clearTimeout(
        notification._timer
    );


    notification._timer =
        setTimeout(() => {

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateY(20px)";

        }, 1800);
}


/* =========================================================
   MISSION STORAGE
   ========================================================= */

function saveMission() {

    const options =
        $$(".mission-option");

    if (!options.length) return;


    const selected = options
        .filter(option =>
            option.classList.contains("selected")
        )
        .map(option =>
            option.dataset.id ||
            option.textContent.trim()
        );


    const scoreElement =
        $(".mission-score strong");

    const budgetElement =
        $(".mission-budget strong");


    const score =
        scoreElement
            ? parseInt(
                scoreElement.textContent,
                10
            )
            : 32;


    const budget =
        budgetElement
            ? parseInt(
                budgetElement.textContent,
                10
            )
            : 100;


    try {

        localStorage.setItem(
            "nexus2050-mission",
            JSON.stringify({
                selected,
                score,
                budget
            })
        );

    } catch (error) {

        /*
         * الموقع يظل يعمل حتى لو كان
         * التخزين المحلي غير متاح.
         */

    }
}


function loadMission() {

    try {

        const data =
            localStorage.getItem(
                "nexus2050-mission"
            );


        if (!data) return null;


        const parsed =
            JSON.parse(data);


        if (
            !parsed ||
            !Array.isArray(parsed.selected)
        ) {
            return null;
        }


        return parsed;

    } catch (error) {

        return null;
    }
}


/* =========================================================
   SHAKE EFFECT
   ========================================================= */

function shakeElement(element) {

    if (!element) return;

    element.animate(
        [
            {
                transform: "translateX(0)"
            },
            {
                transform: "translateX(-7px)"
            },
            {
                transform: "translateX(7px)"
            },
            {
                transform: "translateX(-5px)"
            },
            {
                transform: "translateX(5px)"
            },
            {
                transform: "translateX(0)"
            }
        ],
        {
            duration: 350,
            easing: "ease-out"
        }
    );
}


/* =========================================================
   07 — TECHNOLOGY BUTTON
   ========================================================= */

function initTechButton() {

    const button =
        $(".tech-message button");

    if (!button) return;


    let active = false;


    button.addEventListener(
        "click",
        () => {

            active = !active;


            document.body.classList.toggle(
                "tech-mode",
                active
            );


            if (active) {

                button.textContent =
                    "◉ DEACTIVATE FUTURE MODE";

                activateTechMode();

            } else {

                button.textContent =
                    "ACTIVATE FUTURE MODE";

                deactivateTechMode();

            }

        }
    );
}


function activateTechMode() {

    document.documentElement.style
        .setProperty(
            "--green",
            "#00d9ff"
        );


    document.documentElement.style
        .setProperty(
            "--green-2",
            "#277cff"
        );


    showMissionMessage(
        "FUTURE TECHNOLOGY MODE ONLINE"
    );
}


function deactivateTechMode() {

    document.documentElement.style
        .setProperty(
            "--green",
            "#00f5a0"
        );


    document.documentElement.style
        .setProperty(
            "--green-2",
            "#00c97d"
        );


    showMissionMessage(
        "STANDARD CLIMATE MODE RESTORED"
    );
}


/* =========================================================
   08 — FINAL BUTTON
   ========================================================= */

function initFinalButton() {

    const button =
        $(".final-button");

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const mission =
                $(".mission");

            if (!mission) return;


            mission.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            setTimeout(() => {

                showMissionMessage(
                    "YOUR MISSION STARTS NOW"
                );

            }, 800);

        }
    );
}


/* =========================================================
   09 — MOUSE PARALLAX
   ========================================================= */

function initMouseParallax() {

    const planet =
        $(".earth");

    const orbit =
        $(".planet-orbit");

    if (!planet) return;


    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;


    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                (event.clientX /
                    window.innerWidth -
                    0.5) * 2;


            mouseY =
                (event.clientY /
                    window.innerHeight -
                    0.5) * 2;

        }
    );


    function animate() {

        currentX +=
            (mouseX * 8 - currentX)
            * 0.03;

        currentY +=
            (mouseY * 8 - currentY)
            * 0.03;


        planet.style.transform =
            `translate(${currentX}px, ${currentY}px)`;


        if (orbit) {

            orbit.style.marginLeft =
                `${currentX * .7}px`;

            orbit.style.marginTop =
                `${currentY * .7}px`;
        }


        requestAnimationFrame(
            animate
        );
    }


    animate();
}


/* =========================================================
   10 — KEYBOARD EXPERIENCE
   ========================================================= */

function initKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                const notification =
                    $(".mission-notification");

                if (notification) {

                    notification.style.opacity =
                        "0";
                }
            }


            if (
                event.key === "r" &&
                event.ctrlKey
            ) {

                event.preventDefault();

                location.reload();
            }

        }
    );
}


/* =========================================================
   11 — IMAGE ERROR PROTECTION
   ========================================================= */

$$("img").forEach(image => {

    image.addEventListener(
        "error",
        () => {

            image.style.opacity = "0.25";

        }
    );

});


/* =========================================================
   12 — PERFORMANCE / VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            document.body.classList.add(
                "page-hidden"
            );

        } else {

            document.body.classList.remove(
                "page-hidden"
            );

        }

    }
);


/* =========================================================
   NEXUS SYSTEM READY
   ========================================================= */

console.log(
`
╔══════════════════════════════════════╗
║          NEXUS 2050 ONLINE           ║
║                                      ║
║  Climate Intelligence System         ║
║  Interactive Mission: READY          ║
║  Particle Engine: ONLINE             ║
║  Data Visualization: ONLINE          ║
║  Future City: ONLINE                 ║
║                                      ║
║       BUILD THE FUTURE.              ║
╚══════════════════════════════════════╝
`
);
