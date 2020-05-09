import sim from "./render/sim";
import { Observable } from "rxjs";
import { scan, concatAll } from 'rxjs/operators';
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

    const states$ = animationFrames()
        .pipe(scan<Seconds, State[]>((lastStates, delta) => {
            let lastState = lastStates[lastStates.length - 1];
            if(lastState === undefined) throw new Error(`Invalid states`);
            const initialTime = lastState.time;

            let nextStates = [];
            while(lastState.time < initialTime + delta) {
                const state = step(lastState, delta);
                nextStates.push(state);
                lastState = state;
            }

            if(nextStates.length === 0)
                return lastStates;

            return nextStates;
        }, [initialState]));

    const state$ = states$.pipe(concatAll());

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
