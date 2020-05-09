import sim from "./render/sim";
import { from, Observable } from "rxjs";
import { scan } from 'rxjs/operators';
import { State, Seconds, step } from "./sim/sim";

async function start() {
    await contentLoaded;

    const initialTimer = performance.now();

    const initialState: State = {
        time: 0,
        ball: {
            pos: [-1, 1.8],
            vel: [-0.1, 0]
        }
    };

    const state$ = animationFrames()
        .pipe(scan<Seconds, State>((state, delta) => {
            const initialTime = state.time;
            while(state.time < initialTime + delta)
                state = step(state, delta);
            return state;
        }, initialState));

    const svg = sim(state$);

    document.body.appendChild(svg);
}

const contentLoaded = new Promise(res => {
    if(document.readyState === 'complete' || document.readyState === 'interactive')
        res();
    else
        document.addEventListener('DOMContentLoaded', res);
});

function animationFrames(): Observable<Seconds> {
    return new Observable((res) => {
        let lastTime: undefined | number;

        function handleAF(time: number) {
            if(!res.closed) {
                const delta = lastTime !== undefined ? time - lastTime : 0;
                lastTime = time;
                res.next(delta / 1000);
                window.requestAnimationFrame(handleAF);
            }
        }

        window.requestAnimationFrame(handleAF)
    });
}

start();
