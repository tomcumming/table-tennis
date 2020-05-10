import sim from "./render/sim";
import { Observable, fromEvent } from "rxjs";
import { scan, concatAll } from 'rxjs/operators';
import { State, Seconds, step } from "./sim/sim";
import { V2 } from "./sim/math";

async function start() {
    await contentLoaded;

    const initialTimer = performance.now();

    const initialState: State = {
        time: 0,
        ball: {
            pos: [-1, 1.8],
            vel: [-0.1, 0]
        },
        bat: [-2, 1]
    };

    let batPos: () => V2;

    const states$ = animationFrames()
        .pipe(scan<Seconds, State[]>((lastStates, delta) => {
            let lastState = lastStates[lastStates.length - 1];
            if(lastState === undefined) throw new Error(`Invalid states`);
            const initialTime = lastState.time;

            let nextStates = [];
            while(lastState.time < initialTime + delta) {
                const state = step(lastState, batPos(), delta);
                nextStates.push(state);
                lastState = state;
            }

            if(nextStates.length === 0)
                return lastStates;

            return nextStates;
        }, [initialState]));

    const state$ = states$.pipe(concatAll());

    const svg = sim(state$);

    batPos = mousePosition(svg);

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

function mousePosition(
    svg: Element
): () => V2 {
    let last: V2 = [0, 0];

    fromEvent<MouseEvent>(svg, 'mousemove')
        .subscribe(e => {
            const svgRect = svg.getBoundingClientRect();
            const px = (e.pageX - svgRect.left) / svgRect.width;
            const py = (e.pageY - svgRect.top) / svgRect.height;
            const svgVB = svg.getAttribute('viewBox');
            if(svgVB === null) throw new Error(`Can't read svg viewbox`);
            const [svgLeft, svgTop, svgWidth, svgHeight] = svgVB.split(' ').map(s => parseFloat(s));
            last = [svgLeft + px * svgWidth, svgHeight - (svgTop + py * svgHeight)];
        });

    return () => last;
}

start();
