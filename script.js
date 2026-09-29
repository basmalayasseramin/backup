/* =====================================================
   NEXUS 2050
   INTERACTIVE ENGINE
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const preloader =
    document.getElementById("preloader");

const loaderProgress =
    document.getElementById("loaderProgress");

const loaderPercent =
    document.getElementById("loaderPercent");

const enterButton =
    document.getElementById("enterButton");

const exploreButton =
    document.getElementById("exploreButton");

const planetSystem =
    document.querySelector(".planet-system");

const canvas =
    document.getElementById("particleCanvas");

const ctx =
    canvas.getContext("2d");


/* =====================================================
   PRELOADER
===================================================== */

let progress = 0;

const loader = setInterval(() => {

    progress += Math.floor(
        Math.random() * 5
    ) + 1;

    if (progress >= 100) {

        progress = 100;

        clearInterval(loader);

        setTimeout(() => {

            preloader.classList.add("hidden");

        }, 400);

    }

    loaderProgress.style.width =
        `${progress}%`;

    loaderPercent.textContent =
        `${progress}%`;

}, 45);


/* =====================================================
   PARTICLE SYSTEM
===================================================== */

let particles = [];

let mouse = {
    x: null,
    y: null
};


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


window.addEventListener(
    "mousemove",
    (event) => {

        mouse.x =
            event.clientX;

        mouse.y =
            event.clientY;

        movePlanet(
            event.clientX,
            event.clientY
        );

    }
);


/* =====================================================
   CREATE PARTICLES
===================================================== */

function createParticles() {

    particles = [];

    const amount =
        Math.min(
            130,
            Math.floor(
                window.innerWidth / 9
            )
        );


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        particles.push({

            x:
                Math.random()
                * canvas.width,

            y:
                Math.random()
                * canvas.height,

            size:
                Math.random()
                * 1.6
                + 0.3,

            speed:
                Math.random()
                * 0.25
                + 0.05,

            opacity:
                Math.random()
                * 0.6
                + 0.1,

            color:
                Math.random() > 0.75
                    ? "#00f5a0"
                    : "#ffffff"

        });

    }

}


createParticles();


/* =====================================================
   DRAW PARTICLES
===================================================== */

function drawParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach(
        (particle) => {

            particle.y -=
                particle.speed;


            if (particle.y < -10) {

                particle.y =
                    canvas.height + 10;

            }


            ctx.beginPath();


            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                particle.color;


            ctx.globalAlpha =
                particle.opacity;


            ctx.fill();

        }
    );


    ctx.globalAlpha = 1;


    requestAnimationFrame(
        drawParticles
    );

}


drawParticles();


/* =====================================================
   PLANET MOUSE PARALLAX
===================================================== */

function movePlanet(x, y) {

    if (
        window.innerWidth < 900 ||
        !planetSystem
    ) {
        return;
    }


    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight / 2;


    const moveX =
        (x - centerX)
        / 80;


    const moveY =
        (y - centerY)
        / 80;


    planetSystem.style.transform =
        `translate(${moveX}px, ${moveY}px)`;

}


/* =====================================================
   BUTTON INTERACTION
===================================================== */

enterButton.addEventListener(
    "click",
    () => {

        document.body.classList.add(
            "mission-started"
        );

        enterButton.innerHTML =
            "<span>MISSION INITIALIZED</span><span>✓</span>";


        setTimeout(() => {

            alert(
                "🌍 تم تفعيل الرحلة.\n\nفي المرحلة التالية سنبدأ باستكشاف مستقبل الأرض."
            );

        }, 500);

    }
);


/* =====================================================
   EXPLORE BUTTON
===================================================== */

exploreButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top:
                window.innerHeight,

            behavior:
                "smooth"

        });

    }
);


/* =====================================================
   RANDOM PARTICLE REBUILD
===================================================== */

window.addEventListener(
    "resize",
    () => {

        createParticles();

    }
);
