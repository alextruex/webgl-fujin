class Input{
    map:Record<string,number>;
    canvas:HTMLCanvasElement;

    constructor(canvas:HTMLCanvasElement){
        document.body.style.touchAction = 'none';

        document.addEventListener('touchstart', (e) => {
            this.map['touch'] = 1;
        });

        document.addEventListener('touchend', (e) => {
            this.map['touch'] = 0;
        });


        this.canvas = canvas;
        this.map = {
            mouseX:0,
            mouseY:0
        };
        document.addEventListener('keydown',(e) => {
            //e.preventDefault();
            this.map[e.keyCode] = 1;
        });
        document.addEventListener('keyup',(e) => {
            this.map[e.keyCode] = 0;
        });
        document.addEventListener('mousemove',(e) => {
            let mouseX = Math.round((e.clientX - this.canvas.offsetLeft) * (this.canvas.width / this.canvas.clientWidth)); 
            let mouseY = Math.round((e.clientY - this.canvas.offsetTop) * (this.canvas.height / this.canvas.clientHeight));
            this.map['mouseX'] = mouseX;
            this.map['mouseY'] = mouseY;
        });
        document.addEventListener('mousedown', (e) => {
            this.map['mouse1'] = 1;
        });
        document.addEventListener('mouseup', (e) => {
            this.map['mouse1'] = 0;
        });
    }

    poll(key:string){
        if(key == 'ArrowLeft') return this.map[37];
        if(key == 'ArrowRight') return this.map[39];
        if(key == 'ArrowUp') return this.map[38];
        if(key == 'ArrowDown') return this.map[40];
        if(key == 'A') return this.map[65];
        if(key == 'S') return this.map[83];
        if(key == 'D') return this.map[68];
        if(key == 'W') return this.map[87];
        if(key == 'Q') return this.map[81];
        if(key == 'E') return this.map[69];
        if(key == 'Z') return this.map[90];
        if(key == 'X') return this.map[88];
        if(key == 'C') return this.map[67];
        return this.map[key];
    }
}

export default Input;