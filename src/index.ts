import sim from "./render/sim";

async function start() {
    await contentLoaded;

    const svg = sim();

    document.body.appendChild(svg);
}

const contentLoaded = new Promise(res => {
    if(document.readyState === 'complete' || document.readyState === 'interactive')
        res();
    else
        document.addEventListener('DOMContentLoaded', res);
});

start();
