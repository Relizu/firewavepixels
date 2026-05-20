// @ts-check

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("mainCanvas"));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
const width = window.innerWidth;
const height = window.innerHeight;
let lastFrameTime = 0;
const wait = 150; // milliseconds


function floatToGrayscaleHex(value) {
  // 1. Clamp the value between 0 and 1 to prevent array boundary issues or weird hex strings
  const clamped = Math.max(0, Math.min(1, value));
  
  // 2. Map 0.0-1.0 to an integer from 0-255
  const intensity = Math.floor(clamped * 255);
  
  // 3. Convert to a base-16 string and pad with a leading zero if it's a single digit
  const hex = intensity.toString(16).padStart(2, '0');
  
  // 4. Return standard hex format
  return `#${hex}${hex}${hex}`;
}


let pixels=[]

class pixel{
    constructor(initial=0){
        this.value=initial
        this.neighbors=[]
    }
    set(v){
        if(v.x<0) v.x=-1;
        if(v.y<0) v.y=-1;
        if(v.x>199) v.x=-1;
        if(v.y>199) v.y=-1;
        if(v){
            this.neighbors.push(v);
        }else{
            this.neighbors.push({x:-1,y:-1});
        }
    }
    update() {
        let sum=0;
        for(let i=0;i<this.neighbors.length;i++){
            if(this.neighbors[i].y==-1 || this.neighbors[i].x==-1)continue
            sum+=pixels[this.neighbors[i].y*200+this.neighbors[i].x].value
        }
        /**
         * 0  1  2  3  4
         * 5  6  7  8  9
         * 10 11 x  12 13
         * 14 15 16 17 18
         * 19 20 21 22 23
         */
        const diag=[0,6,17,23,4,8,15,19]
        const cross=[2,7,16,21,10,11,12,13]
        let diagsum=0;
        for(let i=0;i<diag.length;i++){
            if(this.neighbors[diag[i]].y==-1 || this.neighbors[diag[i]].x==-1)continue
            diagsum+=pixels[this.neighbors[diag[i]].y*200+this.neighbors[diag[i]].x].value
        }
        const average=sum/ this.neighbors.length;
        const diagaverage=diagsum/8
        if(diagaverage<0.5 && average>0.5){
            this.value=Math.pow(diagaverage,0)
        }else{
            this.value=Math.pow(diagaverage,1.1)
        }
        
         
    }
}

for(let i =0;i<40000;i++){
    pixels.push(new pixel(Math.random()))
}


function draw(time) {
    requestAnimationFrame(draw);
    if (time - lastFrameTime < wait) {
        return;
    }
    lastFrameTime = time;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i =0;i<40000;i++){
        pixels[i].update()
    }
    updateScreen()
}

function updateScreen(){
    for(let y =0;y<200;y++){
        for(let x =0;x<200;x++){
            ctx.fillStyle= floatToGrayscaleHex(pixels[200*y+x].value)
            ctx.fillRect(x,y,x,y);
        }
    }
}






for(let y =0;y<200;y++){
    for(let x =0;x<200;x++){
        for(let i =y-2; i<=y+2 ;i++){
            for(let j =x-2; j<=x+2 ;j++){
                if(j==x && i==y)continue;
                pixels[y*200+x].set({x:j,y:i})
            }
        }
    }
}


requestAnimationFrame(draw);