import sim from "./render/sim";
import { Observable, fromEvent, BehaviorSubject } from "rxjs";
import { scan, concatAll } from 'rxjs/operators';
import { State, Seconds, step, Bat } from "./sim/sim";
import { V2, v2Sub, v2Finite, v2Muls } from "./sim/math";

async function start() {
    await contentLoaded;

    const initialTimer = performance.now();

    const initialState: State = {
        time: 0,
        ball: {
            pos: [-1, 1.8],
            vel: [-0.1, 0]
        },
        bat: { pos: [-2, 1], vel: [0, 0] }
    };

    let currentMousePosition: BehaviorSubject<V2>;
    let lastMousePositions: { time: Seconds; pos: V2}[] = [];

    const states$ = animationFrames()
        .pipe(scan<Seconds, State[]>((lastStates, delta) => {
            let lastState = lastStates[lastStates.length - 1];
            if(lastState === undefined) throw new Error(`Invalid states`);
            const initialTime = lastState.time;

            let nextStates = [];
            while(lastState.time < initialTime + delta) {
                const bat = batInput(lastMousePositions, lastState.time, currentMousePosition.value);

                const state = step(lastState, bat, delta);
                nextStates.push(state);
                lastState = state;
            }

            if(nextStates.length === 0)
                return lastStates;

            return nextStates;
        }, [initialState]));

    const state$ = states$.pipe(concatAll());

    const svg = sim(state$);

    currentMousePosition = mousePosition(svg);

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
): BehaviorSubject<V2> {
    const bs = new BehaviorSubject<V2>([0, 0]);

    fromEvent<MouseEvent>(svg, 'mousemove')
        .subscribe(e => {
            const svgRect = svg.getBoundingClientRect();
            const px = (e.pageX - svgRect.left) / svgRect.width;
            const py = (e.pageY - svgRect.top) / svgRect.height;
            const svgVB = svg.getAttribute('viewBox');
            if(svgVB === null) throw new Error(`Can't read svg viewbox`);
            const [svgLeft, svgTop, svgWidth, svgHeight] = svgVB.split(' ').map(s => parseFloat(s));
            bs.next([svgLeft + px * svgWidth, svgHeight - (svgTop + py * svgHeight)]);
        })

    return bs;
}

function batInput(
    /** Mutates this input value */
    lasts: { time: Seconds; pos: V2 }[],
    currentTime: Seconds,
    pos: V2
): Bat {
    const lagTime: Seconds = 0.1;

    while(lasts[0] && lasts[0].time < currentTime - lagTime)
        lasts.splice(0, 1);

    let bat: undefined | Bat;

    if(lasts[0]) {
        const deltaTime = currentTime - lasts[0].time;
        const vel = v2Muls(v2Sub(pos, lasts[0].pos), 1 / deltaTime);
        if(v2Finite(vel))
            bat = { pos, vel};
    }

    if(!bat)
        bat = { pos, vel: [0, 0] };

    lasts.push({ pos, time: currentTime });

    return bat;
}

start();
