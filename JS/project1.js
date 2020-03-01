//create the touch pad 

var canvas = document.getElementById("sig-canvas");
var ctx = canvas.getContext('2d');
ctx.strokeStyle = "black";
ctx.lineWidth = 5;

var store_posXi=[];  //arrays for the loop station
var store_posXf=[];
var store_posYi=[];
var store_posYf=[];

var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;
var loopin=0;
canvas.addEventListener("mousedown", function (e) {
        vett_posY=[]; //to store the positions 
        vett_posX=[];
        drawing = true;
  lastPos = getMousePos(canvas, e);
  ctx.moveTo(lastPos.x,lastPos.y)
  ctx.arc(lastPos.x,lastPos.y,0.5,0,2*Math.PI)
  ctx.stroke()
  setTimeout(detect_geom,80)
   if (loopin==1){
  setTimeout(getdrawing_time, 100)
   }
   else {
     console.log("")
   }
}, false);
canvas.addEventListener("mouseup", function (e) {
  drawing = false;
  store_posXi.push(vett_posX[0])
  store_posXf.push(vett_posX[vett_posX.length-1])
  store_posYi.push(vett_posY[0])
  store_posYf.push(vett_posY[vett_posY.length-1])
  setTimeout(clear_realtime, 150)
}, false);
canvas.addEventListener("mousemove", function (e) {
  mousePos = getMousePos(canvas, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimaitonFrame ||
           function (callback) {
        window.setTimeout(callback, 1000/60);
           };
})();

var vett_posY=[];
var vett_posX=[];
// Draw to the canvas
function renderCanvas() {
  if (drawing) {
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    vett_posY.push(lastPos.y);
    vett_posX.push(lastPos.x);
    lastPos = mousePos;
  }
}

// Allow for animation
(function drawLoop () {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();



// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}



// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);

//rubber
function clearCanvas() {
    canvas.width = canvas.width;
    ctx.lineWidth = 4;
    canvas3.width = canvas3.width;
    ctx3.lineWidth = 4;
    vett_posY=[];
    vett_posX=[];
    vett_posY3=[];
    vett_posX3=[];
    store_posXi=[];
    store_posXf=[];
    store_posYi=[];
    store_posYf=[];
    ctx3.arc(30,30,5,0,2*Math.PI)
    ctx3.stroke()
    ctx3.moveTo(72.8,30)
    ctx3.arc(70,30,5,0,2*Math.PI)
    ctx3.stroke()
}

//metronome
const c = new AudioContext();
bpm=document.getElementById("tempo").value;



function play_beats(f, startTime, duration) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  g.gain.value = 0;
  o.frequency.value = f;
  o.start();
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(0.5, startTime + duration/2);
  g.gain.linearRampToValueAtTime(0, startTime + duration)
  canvas.classList.add("hl")
}

//metronome's circles
var pads=document.querySelectorAll(".pad")
var shouldPlay = [false,false] 
function add_pad() {
  if (pads.length < 10) {
   el = document.createElement("div")
   el.classList.add("pad")
   el.ondblclick = remove_on_click
   container.appendChild(el)
   shouldPlay.push(false);
   pads=document.querySelectorAll(".pad")
   pads.forEach(assign_click)
  }
  else {
    console.log("metronome limit!")
  }
}

function remove_on_click(event) {
  event.target.remove()
  shouldPlay.pop()
  pads=document.querySelectorAll(".pad")
}

function hl(pad) {
  pads.forEach(function(p){p.classList.remove("hl")}) //remove hl from all the pads
  pads[pad].classList.add("hl") //ad hl only to the right one
  setTimeout(function(){canvas.classList.remove("hl")},60/bpm*500) //highlight canvas
  
}

function mute_beats(){
  stop_metro();
  time_mute()
  period = 60/bpm*1000;
  canvas.classList.add("hl")
  refreshID = setTimeout(mute_beats, period)
}

var count = 0;
function time(){
  if(shouldPlay[count%(shouldPlay.length)]){play_beats(588,c.currentTime,0.09)}
  else {play_beats(294,c.currentTime,0.09)}
  hl(count++%(shouldPlay.length))
}

function time_mute(){
  hl(count++%(shouldPlay.length))
}


var period = 60/bpm*1000;

function play_metro() {
 bpm=document.getElementById("tempo").value;
 period = 60/bpm*1000;
 time()
 refreshID = setTimeout(play_metro, period)
}


 function sw(event,index) {
  shouldPlay[index] = !shouldPlay[index]
  pads[index].classList.toggle("tbp")
}

function assign_click(pad,index){
  pad.onclick=function(event)      
  {sw(event,index)
 }
}

pads.forEach(assign_click)

function stop_metro() {
  clearTimeout(refreshID)
}

//riconoscimento geometrie 

function detect_geom () {
 
  if (Math.abs(vett_posX[vett_posX.length-1]-vett_posX[0]) < 7 && Math.abs(vett_posY[vett_posY.length-1]-vett_posY[0]) < 7) {
    kick()
    console.log("hai fatto un punto")
  }  
   
  else if (Math.atan(Math.abs((vett_posY[vett_posY.length-1]-vett_posY[0])/(vett_posX[vett_posX.length-1]-vett_posX[0]))) < Math.PI/10){
    charlie()
    console.log("riga orizzontale")
  }
       
  else if (Math.atan(Math.abs((vett_posY[vett_posY.length-1]-vett_posY[0])/(vett_posX[vett_posX.length-1]-vett_posX[0]))) >Math.PI*0.4){
    snare()
    console.log("riga verticale")
   }
  
  else  {
    ride()
    console.log("riga obliqua")}
   
 }

 
function detect_geom_loop (i) {
 
  if (Math.abs(store_posXf[i]-store_posXi[i]) < 7 && Math.abs(store_posYf[i]-store_posYi[i]) < 7) {
    kick()
    console.log("hai fatto un punto")
  }  
   
  else if (Math.atan(Math.abs((store_posYf[i]-store_posYi[i])/(store_posXf[i]-store_posXi[i]))) < Math.PI/10){
    charlie()
    console.log("riga orizzontale")
  }
       
  else if (Math.atan(Math.abs((store_posYf[i]-store_posYi[i])/(store_posXf[i]-store_posXi[i]))) >Math.PI*0.4){
    snare()
    console.log("riga verticale")
   }
  
  else  {
    ride()
    console.log("riga obliqua")}
   
 }


//--------------------------------
//change style

function change_style(){
  if (genre.value=="dubstep") {
    document.getElementById("look").href="CSS/project1_dubstep.css"
    document.getElementById("kick_sample").src="Sounds/Dubstep/XLNT-Riddim Riot Kick 40.wav";
    document.getElementById("snare_sample").src="Sounds/Dubstep/XLNT-Riddim Riot Snare 12.wav";
    document.getElementById("charlie_sample").src="Sounds/Dubstep/Cymatics - Dubstep Toolkit Closed Hihat 2.wav";
    document.getElementById("ride_sample").src="Sounds/Dubstep/Cymatics - Dubstep Toolkit Ride 3.wav";
  }
  if (genre.value=="jazz") {
    document.getElementById("look").href="CSS/project1_jazz.css"
    document.getElementById("kick_sample").src="Sounds/Jazz/JK_BD_02.wav";
    document.getElementById("snare_sample").src="Sounds/Jazz/JK_SNR_02.wav";
    document.getElementById("charlie_sample").src="Sounds/Jazz/JK_HH_02.wav";
    document.getElementById("ride_sample").src="Sounds/Jazz/JK_BRSH_01.wav";

  }
  if (genre.value=="hip-hop") {
    document.getElementById("look").href="CSS/project1_hip-hop.css"
    document.getElementById("kick_sample").src="Sounds/Hip-hop/XLNT-Cartel Kick 20.wav";
    document.getElementById("snare_sample").src="Sounds/Hip-hop/XLNT-Cartel Clap 07.wav";
    document.getElementById("charlie_sample").src="Sounds/Hip-hop/XLNT-Cartel Open Hat 06.wav";
    document.getElementById("ride_sample").src="Sounds/Hip-hop/XLNT-Cartel Ride 03.wav";
  }
  
  if (genre.value=="rock") {
    document.getElementById("look").href="CSS/project1_rock.css"
    document.getElementById("kick_sample").src="Sounds/Rock/Kick bright classic hard.wav"
    document.getElementById("snare_sample").src="Sounds/Rock/Snare ambient punch.wav";
    document.getElementById("charlie_sample").src="Sounds/Rock/Hihat bluesbreak.wav";
    document.getElementById("ride_sample").src="Sounds/Rock/Crash session dry.wav";

  }
  if (genre.value=="trap") {
    document.getElementById("look").href="CSS/project1_trap.css"
    document.getElementById("kick_sample").src="Sounds/Trap/XLNT-Cartel Kick 01.wav";
    document.getElementById("snare_sample").src="Sounds/Trap/XLNT-Cartel Clap 05.wav";
    document.getElementById("charlie_sample").src="Sounds/Trap/XLNT-Cartel Closed Hat 03.wav";
    document.getElementById("ride_sample").src="Sounds/Trap/XLNT-Cartel Baked 808 [ E ].wav";
  }
  
}
  


 

function kick() {
    document.getElementById('kick_sample').play();
    console.log("kick");
  }

function snare() {
    document.getElementById('snare_sample').play();
    console.log("snare");
  }

function charlie() {
    document.getElementById('charlie_sample').play();
    console.log("hi-hat");
  }

function ride() {
    document.getElementById('ride_sample').play();
    console.log("ride");
  }

  
//-----------------------------------------------------------------------------------------------------------
/*
//pitch shifter
actx = new AudioContext();
o2 = actx.createOscillator();
g2 = actx.createGain();
o2.connect(g2);
g2.connect(actx.destination);

g2.gain.setValueAtTime(0.1,actx.currentTime)

o2.frequency.value=440;
o2.start();

o3 = actx.createOscillator();
o3.connect(g2.gain);
o3.frequency.value=0;
o3.start();



document.querySelector("#start").onclick = function() {
  actx.resume()
}

document.querySelector("#stop").onclick = function() {
  o2.stop();
  o3.stop();
}


//canvas 2

var canvas2 = document.getElementById("sig-canvas2");
var ctx2 = canvas2.getContext("2d");
ctx2.strokeStyle = "black";
ctx2.lineWidth = 2;

var drawing2 = false;
var mousePos2 = { x:0, y:0 };
var lastPos2 = mousePos2;
canvas2.addEventListener("mousedown", function (e) {
        vett_posY2=[];
        vett_posX2=[];
        drawing2 = true;
        lastPos2 = getMousePos2(canvas2, e);
}, false);
canvas2.addEventListener("mouseup", function (e) {
  drawing2 = false;   
    o2.detune.value=0;
    o3.frequency.value=0;
    canvas2.width = canvas2.width;
    ctx2.lineWidth = 2;
    vett_posY2=[];
    vett_posX2=[];
}, false);
canvas2.addEventListener("mousemove", function (e) {
  mousePos2 = getMousePos2(canvas2, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos2(canvasDom2, mouseEvent2) {
  var circle = canvasDom2.getBoundingClientRect();
  return {
    x: mouseEvent2.clientX - circle.left,
    y: mouseEvent2.clientY - circle.top
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimaitonFrame ||
           function (callback) {
        window.setTimeout(callback, 1000/60);
           };
})();


function improvizer(){
  if (Math.abs(store_posXf[i]-store_posXi[i]) < 7 && Math.abs(store_posYf[i]-store_posYi[i]) < 7) {
    
    console.log("hai fatto un punto")
  }  
   
  else if (Math.atan(Math.abs((store_posYf[i]-store_posYi[i])/(store_posXf[i]-store_posXi[i]))) < Math.PI/10){
    charlie()
    console.log("riga orizzontale")
  }
       
  else if (Math.atan(Math.abs((store_posYf[i]-store_posYi[i])/(store_posXf[i]-store_posXi[i]))) >Math.PI*0.4){
    snare()
    console.log("riga verticale")
   }
  
  else  {
    ride()
    console.log("riga obliqua")}
}



var vett_posY2=[];
var vett_posX2=[];
var lfo = false;
// Draw to the canvas
function renderCanvas2() {
  if (drawing2) {
    ctx2.moveTo(lastPos2.x, lastPos2.y);
    ctx2.lineTo(mousePos2.x, mousePos2.y);
    ctx2.stroke();
    vett_posY2.push(lastPos2.y);
    vett_posX2.push(lastPos2.x);
    lastPos2 = mousePos2;    
    if (lfo) {
      improvizer();
    }
    else {
      o2.detune.value=lastPos2.x*15-lastPos2.y*15;
    }
  }
}

// Allow for animation
(function drawLoop2 () {
  requestAnimFrame(drawLoop2);
  renderCanvas2();
})();



// Set up touch events for mobile, etc
canvas2.addEventListener("touchstart", function (e) {
        mousePos2 = getTouchPos2(canvas2, e);
  var touch2 = e.touches[0];
  var mouseEvent2 = new MouseEvent2("mousedown", {
    clientX: touch2.clientX,
    clientY: touch2.clientY
  });
  canvas2.dispatchEvent(mouseEvent2);
}, false);
canvas2.addEventListener("touchend", function (e) {
  var mouseEvent2 = new MouseEvent2("mouseup", {});
  canvas2.dispatchEvent(mouseEvent2);
}, false);
canvas2.addEventListener("touchmove", function (e) {
  var touch2 = e.touches[0];
  var mouseEvent2 = new MouseEvent2("mousemove", {
    clientX: touch2.clientX,
    clientY: touch2.clientY
  });
  canvas2.dispatchEvent(mouseEvent2);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos2(canvasDom2, touchEvent2) {
  var circle = canvasDom2.getBoundingClientRect();
  return {
    x: touchEvent2.touches[0].clientX - circle.left,
    y: touchEvent2.touches[0].clientY - circle.top
  };
}



// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas2) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas2) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas2) {
    e.preventDefault();
  }
}, false);

canvas2.ondblclick=function(){
  lfo = !lfo;
  canvas2.classList.toggle("lfo")
}

*/

//---------LOOP-----------
function play_metro_loop() {
  bpm=document.getElementById("tempo").value;
  period = 60/bpm*1000;
  time()
  refreshID2 = setTimeout(play_metro_loop, period)
  firstbeat_time()
  start_memory()
 }

function play_metro_mute() {
  bpm=document.getElementById("tempo").value;
  period = 60/bpm*1000;
  canvas.classList.add("hl")
  time_mute()
  refreshID2 = setTimeout(play_metro_mute, period)
  firstbeat_time()
  start_memory()
 }

function mute_beats_loop(){
  clearTimeout(refreshID2)
  play_metro_mute()
}

function play_loop(){
  loopstart.classList.add("buttonStyle2")
  clearCanvas()
  play_metro_loop();
  loopin=1;
}

function stop_loop() {
  loopstart.classList.remove("buttonStyle2")
  clearTimeout(refreshID2)
  clearCanvas()
  loopin=0;
}


function drawing_memory(i){ 
  ctx.moveTo(store_posXi[i],store_posYi[i])
  ctx.arc(store_posXf[i],store_posYf[i],0.5,0,2*Math.PI)
  ctx.stroke()
  ctx.moveTo(store_posXi[i],store_posYi[i]);
  ctx.lineTo(store_posXf[i],store_posYf[i]);
  ctx.stroke()
  detect_geom_loop(i)
  setTimeout(clear_realtime, 150)
}

function memory() {
for (i=0; i<store_posXf.length; i++){
  setTimeout(drawing_memory, drawing_time_array[i]*1000, i) 
  }
} 

function clear_realtime() {
    canvas.width = canvas.width;
    ctx.lineWidth = 4;
}

var seconds;
var beat_time;
var beat_time_array= [];
var drawing_time_array=[];
function get_time() {
    today= new Date();
    seconds = today.getHours()*3600 + today.getMinutes()*60 + today.getSeconds() + today.getMilliseconds()/1000
    console.log(seconds)
}

function firstbeat_time() {if (pads[0].classList[pads[0].classList.length-1]=="hl"){
  get_time()
  beat_time=seconds
  beat_time_array.push(beat_time)   
  }
}

function start_memory() {
  if (pads[0].classList[pads[0].classList.length-1]=="hl"){
    memory()
  }
}

//relative time 
function getdrawing_time(){
  get_time()
  drawing_time=seconds;
  relative_drawing_time=drawing_time-beat_time_array[beat_time_array.length-1]
  drawing_time_array.push(relative_drawing_time)
  console.log(relative_drawing_time)
}


//------third canvas ----------


var canvas3 = document.getElementById("sig-canvas3");
var ctx3 = canvas3.getContext("2d");
ctx3.strokeStyle = "black";
ctx3.lineWidth = 4;


ctx3.arc(30,30,5,0,2*Math.PI)
ctx3.stroke()
ctx3.moveTo(72.8,30)
ctx3.arc(70,30,5,0,2*Math.PI)
ctx3.stroke()



var drawing3 = false;
var mousePos3 = { x:0, y:0 };
var lastPos3 = mousePos3;
canvas3.addEventListener("mousedown", function (e) {
        vett_posY3=[];
        vett_posX3=[];
        drawing3 = true;
        lastPos3 = getMousePos3(canvas3, e);
        bpm=document.getElementById("tempo").value;
}, false);
canvas3.addEventListener("mouseup", function (e) {
  drawing3 = false;  
  detect_geom_canvas3()  
  setTimeout(clear_realtime_canvas3, 1000)
}, false);
canvas3.addEventListener("mousemove", function (e) {
  mousePos3 = getMousePos3(canvas3, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos3(canvasDom3, mouseEvent3) {
  var circle = canvasDom3.getBoundingClientRect();
  return {
    x: mouseEvent3.clientX - circle.left,
    y: mouseEvent3.clientY - circle.top
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimaitonFrame ||
           function (callback) {
        window.setTimeout(callback, 1000/60);
           };
})();

var vett_posY3=[];
var vett_posX3=[];

// Draw to the canvas
function renderCanvas3() {
  if (drawing3) {
    ctx3.moveTo(lastPos3.x, lastPos3.y);
    ctx3.lineTo(mousePos3.x, mousePos3.y);
    ctx3.stroke();
    vett_posY3.push(lastPos3.y);
    vett_posX3.push(lastPos3.x);
    lastPos3 = mousePos3;    
  }
}


// Allow for animation
(function drawLoop3 () {
  requestAnimFrame(drawLoop3);
  renderCanvas3();
})();



// Set up touch events for mobile, etc
canvas3.addEventListener("touchstart", function (e) {
        mousePos3 = getTouchPos3(canvas3, e);
  var touch3 = e.touches[0];
  var mouseEvent3 = new MouseEvent3("mousedown", {
    clientX: touch3.clientX,
    clientY: touch3.clientY
  });
  canvas3.dispatchEvent(mouseEvent3);
}, false);
canvas3.addEventListener("touchend", function (e) {
  var mouseEvent3 = new MouseEvent3("mouseup", {});
  canvas3.dispatchEvent(mouseEvent3);
}, false);
canvas3.addEventListener("touchmove", function (e) {
  var touch3 = e.touches[0];
  var mouseEvent3 = new MouseEvent3("mousemove", {
    clientX: touch3.clientX,
    clientY: touch3.clientY
  });
  canvas3.dispatchEvent(mouseEvent3);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos3(canvasDom3, touchEvent3) {
  var circle = canvasDom3.getBoundingClientRect();
  return {
    x: touchEvent3.touches[0].clientX - circle.left,
    y: touchEvent3.touches[0].clientY - circle.top
  };
}



// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas3) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas3) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas3) {
    e.preventDefault();
  }
}, false);
    
function clear_realtime_canvas3() {
  canvas3.width = canvas3.width
  ctx3.lineWidth = 4
  ctx3.arc(30,30,5,0,2*Math.PI)
  ctx3.stroke()
  ctx3.moveTo(72.8,30)
  ctx3.arc(70,30,5,0,2*Math.PI)
  ctx3.stroke()
}

//------dubstep progression----

var vol_dub = new Tone.Volume(-10).connect(Tone.Master);

var bit_dub = new Tone.BitCrusher(4);

var eq_dub = new Tone.EQ3(10, 0, -20);     

var dist_dub = new Tone.Distortion(0.5);

var synth_dub = new Tone.PolySynth(6, Tone.Synth, {
    oscillator : {
          type : "sawtooth"
      },
      envelope : {
      attack : 0.1 ,
      decay : 0.1 ,
      sustain : 0.3 ,
      release : 0.1
      }
}).chain(dist_dub, eq_dub, bit_dub, vol_dub);

synth_dub.set("detune", -300);

var x_dub = ["C3","C3","C3", "C3","C3","C3", "C3","C3","C3","C3","C3","C3", "C3","C3","C3", "C3","C3","C3", "C3","C3","C3", "E3","E3","E3"];
var y_dub = ["G2","G2","G2", "G2","G2","G2", "G2","G2","G2", "G2","G2","G2", "G2","G2","G2", "G2","G2","G2", "G2","G2","G2", "B2","B2","B2"];


bpm=document.getElementById("tempo").value;

var i_dub;

function progression_dub(i_dub) {
    synth_dub.triggerAttackRelease([x_dub[i_dub], y_dub[i_dub]], period/1000/5);
} 

var x_dub_sad = ["C3","C3","C3", "C3","C3","C3", "B2", "B2", "B2", "B2", "B2", "B2", "Bb2","Bb2","Bb2", "Bb2","Bb2","Bb2", "A2","A2","A2","A2","A2","A2"];
var y_dub_sad = ["G2","G2","G2","G2","G2","G2","Gb2","Gb2","Gb2","Gb2","Gb2","Gb2", "F2","F2","F2","F2","F2","F2", ,"E2","E2","E2","E2","E2","E2"];




function progression_dub_sad(i_dub) {
    synth_dub.triggerAttackRelease([x_dub_sad[i_dub], y_dub_sad[i_dub]], period/1000/5);
} 

i_dub=0;

function play_progression_dub() {
    period=60/bpm*1000;
    period_prog=period/3;
    progression_dub(i_dub)
    refreshID_dub=setTimeout(play_progression_dub,period_prog)
    i_dub++
    if (i_dub>23) {
        i_dub=0;
    }
} 

function play_progression_dub_sad() {
    period=60/bpm*1000;
    period_prog=period/3;
    progression_dub_sad(i_dub)
    refreshID_dub_sad=setTimeout(play_progression_dub_sad,period_prog)
    i_dub++
    if (i_dub>23) {
        i_dub=0;
    }
} 

//---------------rock progression-------

var vol_rock = new Tone.Volume(-30).connect(Tone.Master);

var reverb_rock = new Tone.JCReverb(0.1);

var eq_rock = new Tone.EQ3(30, 0, -20); 

var dist_rock = new Tone.Distortion(1);

var synth_rock = new Tone.PolySynth(6, Tone.Synth, {
    oscillator : {
          type : "sawtooth"
      },
      envelope : {
      attack : 0.1 ,
      decay : 0.1 ,
      sustain : 0.3 ,
      release : 0.12
      }
}).chain(dist_rock, eq_rock, reverb_rock, vol_rock);

synth_rock.set("detune", +800);

var x_rock= ["C3", "A2", "D3", "G2"];
var y_rock = ["G2", "E2", "A2", "D2"];
var z_rock = ["C2", "A3", "D2", "G3"];

bpm=document.getElementById("tempo").value;
period1=60/bpm*1000;

function progression_rock(i_rock) {
    synth_rock.triggerAttackRelease([x_rock[i_rock], y_rock[i_rock], z_rock[i_rock]], period1/1000*2);
} 

var x_rock_sad= ["C3", "Ab2", "F2", "G2"];
var y_rock_sad = ["G2", "Eb2", "C2", "D2"];
var z_rock_sad= ["C2", "Ab3", "F3", "G3"];

function progression_rock_sad(i_rock) {
    synth_rock.triggerAttackRelease([x_rock_sad[i_rock], y_rock_sad[i_rock], z_rock_sad[i_rock]], period1/1000*2);
} 

var i_rock=0;

function play_progression_rock() {
    period1=60/bpm*1000;
    period_prog=period1*4;
    progression_rock(i_rock)
    refreshID_rock=setTimeout(play_progression_rock,period_prog)
    i_rock++
    if (i_rock>3) {
        i_rock=0;
    }
} 


function play_progression_rock_sad() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_rock_sad(i_rock)
    refreshID_rock_sad=setTimeout(play_progression_rock_sad,period_prog)
    i_rock++
    if (i_rock>3) {
        i_rock=0;
    }
} 

//-------------jazz progression---------

var vol_jazz = new Tone.Volume(-20).connect(Tone.Master);

var synth_jazz = new Tone.PolySynth(4, Tone.Synth, {
    oscillator : {
          type : "sine"
      },
      envelope : {
      attack : 0.1 ,
      decay : 0.1 ,
      sustain : 0.3 ,
      release : 0.1
      }
}).connect(vol_jazz);


var x_jazz_happy1 = ["C3", "Bb2", "F3", "F3"];
var y_jazz_happy1 = ["E3", "D3", "A2", "A2"];
var z_jazz_happy1 = ["G2", "F3", "C2", "C2"];
var w_jazz_happy1 = ["Bb4", "A4", "E4", "E4"];
bpm=document.getElementById("tempo").value;

function progression_jazz_happy1(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_happy1[i_jazz], y_jazz_happy1[i_jazz], z_jazz_happy1[i_jazz], w_jazz_happy1[i_jazz]], period1/1000*4);
}

var x_jazz_happy2 = ["C3", "A2", "D3", "G2"];
var y_jazz_happy2 = ["E3", "C3", "F2", "B2"];
var z_jazz_happy2 = ["G2", "E3", "A2", "D3"];
var w_jazz_happy2 = ["B4", "G4", "C4", "F4"];
bpm=document.getElementById("tempo").value;

function progression_jazz_happy2(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_happy2[i_jazz], y_jazz_happy2[i_jazz], z_jazz_happy2[i_jazz], w_jazz_happy2[i_jazz]], period1/1000*4);
}

var x_jazz_happy3 = ["C3", "C3", "C3", "C3"];
var y_jazz_happy3 = ["E3", "B3", "E2", "B3"];
var z_jazz_happy3 = ["B3", "D4", "B2", "D4"];
var w_jazz_happy3 = ["F#4", "F#4", "F#4", "F#4"];
bpm=document.getElementById("tempo").value;

function progression_jazz_happy3(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_happy3[i_jazz], y_jazz_happy3[i_jazz], z_jazz_happy3[i_jazz], w_jazz_happy3[i_jazz]], period1/1000*4);
}

var x_jazz_happy4 = ["C3", "C3", "C3", "C3"];
var y_jazz_happy4 = ["E3", "F#3", "E3", "F#3"];
var z_jazz_happy4 = ["G2", "A3", "G2", "A3"];
var w_jazz_happy4 = ["C4", "D4", "C4", "D4"];
bpm=document.getElementById("tempo").value;

function progression_jazz_happy4(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_happy4[i_jazz], y_jazz_happy4[i_jazz], z_jazz_happy4[i_jazz], w_jazz_happy4[i_jazz]], period1/1000*4);
}

var x_jazz_sad1 = ["C3", "F2", "C3", "F2"];
var y_jazz_sad1 = ["Eb3", "A2", "Eb3", "A2"];
var z_jazz_sad1 = ["G2", "C3", "G2", "C3"];
var w_jazz_sad1 = ["Bb4", "Eb4", "Bb4", "Eb4"];

function progression_jazz_sad1(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_sad1[i_jazz], y_jazz_sad1[i_jazz], z_jazz_sad1[i_jazz], w_jazz_sad1[i_jazz]], period1/1000*4);
}

var x_jazz_sad2 = ["C3", "Ab2", "D3", "G2"];
var y_jazz_sad2 = ["Eb3", "C3", "F2", "B2"];
var z_jazz_sad2 = ["G2", "Eb3", "Ab2", "D3"];
var w_jazz_sad2 = ["Bb4", "G4", "C4", "F4"];

function progression_jazz_sad2(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_sad2[i_jazz], y_jazz_sad2[i_jazz], z_jazz_sad2[i_jazz], w_jazz_sad2[i_jazz]], period1/1000*4);
}

var x_jazz_sad3 = ["C3", "G2", "C3", "G2"];
var y_jazz_sad3 = ["Eb3", "Bb3", "Eb3", "Bb3"];
var z_jazz_sad3 = ["G2", "Db3", "G2", "Db3"];
var w_jazz_sad3 = ["Bb4", "F4", "Bb4", "F4"];

function progression_jazz_sad3(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_sad3[i_jazz], y_jazz_sad3[i_jazz], z_jazz_sad3[i_jazz], w_jazz_sad3[i_jazz]], period1/1000*4);
}

var x_jazz_sad4 = ["C3", "Bb2", "C3", "Bb2"];
var y_jazz_sad4 = ["Eb3", "Db3", "Eb3", "Db3"];
var z_jazz_sad4 = ["Gb2", "F3", "Gb2", "F3"];
var w_jazz_sad4 = ["Bb4", "Ab4", "Bb4", "Ab4"];

function progression_jazz_sad4(i_jazz) {
    synth_jazz.triggerAttackRelease([x_jazz_sad4[i_jazz], y_jazz_sad4[i_jazz], z_jazz_sad4[i_jazz], w_jazz_sad4[i_jazz]], period1/1000*4);
}

var i_jazz=0;
var fund;
var third;
var fifth;
var seventh;

function play_progression_jazz_happy1() {
  period=60/bpm*1000;
  period_prog=period*4;
  progression_jazz_happy1(i_jazz)
  refreshID_jazz_happy1=setTimeout(play_progression_jazz_happy1,period_prog)
  fund=x_jazz_happy1[i_jazz]
  third=y_jazz_happy1[i_jazz]
  fifth=z_jazz_happy1[i_jazz]
  seventh=w_jazz_happy1[i_jazz]
  i_jazz++
  if (i_jazz>3) {
      i_jazz=0;
  }
} 

function play_progression_jazz_happy2() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_jazz_happy2(i_jazz)
    refreshID_jazz_happy2=setTimeout(play_progression_jazz_happy2,period_prog)
    fund=x_jazz_happy2[i_jazz]
    third=y_jazz_happy2[i_jazz]
    fifth=z_jazz_happy2[i_jazz]
    seventh=w_jazz_happy2[i_jazz]
    i_jazz++
    if (i_jazz>3) {
        i_jazz=0;
    }
} 

function play_progression_jazz_happy3() {
  period=60/bpm*1000;
  period_prog=period*4;
  progression_jazz_happy3(i_jazz)
  refreshID_jazz_happy3=setTimeout(play_progression_jazz_happy3,period_prog)
  fund=x_jazz_happy3[i_jazz]
  third=y_jazz_happy3[i_jazz]
  fifth=z_jazz_happy3[i_jazz]
  seventh=w_jazz_happy3[i_jazz]
  i_jazz++
  if (i_jazz>3) {
      i_jazz=0;
  }
} 

function play_progression_jazz_happy4() {
  period=60/bpm*1000;
  period_prog=period*4;
  progression_jazz_happy4(i_jazz)
  refreshID_jazz_happy4=setTimeout(play_progression_jazz_happy4,period_prog)
  fund=x_jazz_happy4[i_jazz]
  third=y_jazz_happy4[i_jazz]
  fifth=z_jazz_happy4[i_jazz]
  seventh=w_jazz_happy4[i_jazz]
  i_jazz++
  if (i_jazz>3) {
      i_jazz=0;
  }
} 

function play_progression_jazz_sad1() {
  period=60/bpm*1000;
  period_prog=period*4;
  progression_jazz_sad1(i_jazz)
  refreshID_jazz_sad1=setTimeout(play_progression_jazz_sad1,period_prog)
  fund=x_jazz_sad1[i_jazz]
  third=y_jazz_sad1[i_jazz]
  fifth=z_jazz_sad1[i_jazz]
  seventh=w_jazz_sad1[i_jazz]
  i_jazz++
  if (i_jazz>3) {
      i_jazz=0;
  }
} 

function play_progression_jazz_sad2() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_jazz_sad2(i_jazz)
    refreshID_jazz_sad2=setTimeout(play_progression_jazz_sad2,period_prog)
    fund=x_jazz_sad2[i_jazz]
    third=y_jazz_sad2[i_jazz]
    fifth=z_jazz_sad2[i_jazz]
    seventh=w_jazz_sad2[i_jazz]
    i_jazz++
    if (i_jazz>3) {
        i_jazz=0;
    }
} 

function play_progression_jazz_sad3() {
  period=60/bpm*1000;
  period_prog=period*4;
  progression_jazz_sad3(i_jazz)
  refreshID_jazz_sad3=setTimeout(play_progression_jazz_sad3,period_prog)
  fund=x_jazz_sad3[i_jazz]
  third=y_jazz_sad3[i_jazz]
  fifth=z_jazz_sad3[i_jazz]
  seventh=w_jazz_sad3[i_jazz]
  i_jazz++
  if (i_jazz>3) {
      i_jazz=0;
  }
} 

function play_progression_jazz_sad4() {
  period=60/bpm*1000;
  period_prog=period*4;
  progression_jazz_sad4(i_jazz)
  refreshID_jazz_sad4=setTimeout(play_progression_jazz_sad4,period_prog)
  fund=x_jazz_sad4[i_jazz]
  third=y_jazz_sad4[i_jazz]
  fifth=z_jazz_sad4[i_jazz]
  seventh=w_jazz_sad4[i_jazz]
  i_jazz++
  if (i_jazz>3) {
      i_jazz=0;
  }
} 

//----------hiphop progression------------

var vol_hiphop = new Tone.Volume(-30).connect(Tone.Master);

var reverb_hiphop = new Tone.JCReverb(0.8);

var eq_hiphop = new Tone.EQ3(10, -20, 0); 

var synth_hiphop = new Tone.PolySynth(6, Tone.Synth, {
    oscillator : {
          type : "sawtooth"
      },
      envelope : {
      attack : 0.4 ,
      decay : 0.1 ,
      sustain : 0.3 ,
      release : 0.1
      }
}).chain(eq_hiphop, reverb_hiphop, vol_hiphop);

synth_hiphop.set("detune", +1200);

var x_hiphop = ["C3", "D3","C3", "D3"];
var y_hiphop= ["E3", "F#3","E3", "F#3"];
var z_hiphop = ["G2", "A2","G2", "A2"];
var w_hiphop = ["C2", "D2","C2", "D2"];

function progression_hiphop(i_hiphop) {
    synth_hiphop.triggerAttackRelease([x_hiphop[i_hiphop], y_hiphop[i_hiphop], z_hiphop[i_hiphop], w_hiphop[i_hiphop]], period/1000*2);
}

var x_hiphop_sad = ["C3", "A2", "D3"];
var y_hiphop_sad = ["E3", "C3", "F2"];
var z_hiphop_sad = ["G2", "E3", "A2"];
var w_hiphop_sad = ["B2", "G3", "C3"];

function progression_hiphop_sad(i_hiphop) {
    synth_hiphop.triggerAttackRelease([x_hiphop_sad[i_hiphop], y_hiphop_sad[i_hiphop], z_hiphop_sad[i_hiphop], w_hiphop_sad[i_hiphop]], period/1000*2);
}


var i_hiphop=0;

function play_progression_hiphop() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_hiphop(i_hiphop)
    refreshID_hiphop=setTimeout(play_progression_hiphop,period_prog)
    i_hiphop++
    if (i_hiphop>3) {
        i_hiphop=0;
    }
} 

function play_progression_hiphop_sad() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_hiphop_sad(i_hiphop)
    refreshID_hiphop_sad=setTimeout(play_progression_hiphop_sad,period_prog)
    i_hiphop++
    if (i_hiphop>3) {
        i_hiphop=0;
    }
} 

//------------trap progression---------
var vol_trap = new Tone.Volume(0).connect(Tone.Master);

var synth_trap = new Tone.PolySynth(2, Tone.Synth, {
    oscillator : {
          type : "triangle"
      },
      envelope : {
      attack : 0.05 ,
      decay : 0.1 ,
      sustain : 0.3 ,
      release : 0.1
      }
}).connect(vol_trap);

synth_trap.set("detune", +1200);

var x_trap = ["C0", "G0", "C0", "G0"];

function progression_trap(i_trap) {
    synth_trap.triggerAttackRelease([x_trap[i_trap]], period/1000*3);
}

var x_trap_sad = ["C0", "C0", "Eb0", "D0"];

function progression_trap_sad(i_trap) {
    synth_trap.triggerAttackRelease([x_trap_sad[i_trap]], period/1000*3);
}

var i_trap=0;

function play_progression_trap() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_trap(i_trap)
    refreshID_trap=setTimeout(play_progression_trap,period_prog)
    i_trap++
    if (i_trap>3) {
        i_trap=0;
    }
} 

function play_progression_trap_sad() {
    period=60/bpm*1000;
    period_prog=period*4;
    progression_trap_sad(i_trap)
    refreshID_trap_sad=setTimeout(play_progression_trap_sad,period_prog)
    i_trap++
    if (i_trap>3) {
        i_trap=0;
    }
} 


function stop_prog_dub(){
  clearTimeout(refreshID_dub);
  synth_dub.triggerAttackRelease([x_dub[i_dub-1], y_dub[i_dub-1]], 0.00001)
}

function stop_prog_dub_sad(){
  clearTimeout(refreshID_dub_sad);
  synth_dub.triggerAttackRelease([x_dub_sad[i_dub-1], y_dub_sad[i_dub-1]], 0.00001)
}

function stop_prog_rock(){
  clearTimeout(refreshID_rock);
  synth_rock.triggerAttackRelease([x_rock[i_rock-1], y_rock[i_rock-1], z_rock[i_rock-1]], 0.00001 );
}

function stop_prog_rock_sad(){
  clearTimeout(refreshID_rock_sad);
  synth_rock.triggerAttackRelease([x_rock_sad[i_rock-1], y_rock_sad[i_rock-1], z_rock_sad[i_rock-1]], 0.00001 );
}

function stop_prog_hiphop(){
  clearTimeout(refreshID_hiphop);
  synth_hiphop.triggerAttackRelease([x_hiphop[i_hiphop-1], y_hiphop[i_hiphop-1], z_hiphop[i_hiphop-1], w_hiphop[i_hiphop-1]], 0.00001 );
}

function stop_prog_hiphop_sad(){
  clearTimeout(refreshID_hiphop_sad);
  synth_hiphop.triggerAttackRelease([x_hiphop_sad[i_hiphop-1], y_hiphop_sad[i_hiphop-1], z_hiphop_sad[i_hiphop-1], w_hiphop_sad[i_hiphop-1]], 0.00001 );
}

function stop_prog_jazz_happy1(){
  clearTimeout(refreshID_jazz_happy1);
  synth_jazz.triggerAttackRelease([x_jazz_happy1[i_jazz-1], y_jazz_happy1[i_jazz-1], z_jazz_happy1[i_jazz-1], w_jazz_happy1[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_happy2(){
  clearTimeout(refreshID_jazz_happy2);
  synth_jazz.triggerAttackRelease([x_jazz_happy2[i_jazz-1], y_jazz_happy2[i_jazz-1], z_jazz_happy2[i_jazz-1], w_jazz_happy2[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_happy3(){
  clearTimeout(refreshID_jazz_happy3);
  synth_jazz.triggerAttackRelease([x_jazz_happy3[i_jazz-1], y_jazz_happy3[i_jazz-1], z_jazz_happy3[i_jazz-1], w_jazz_happy3[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_happy4(){
  clearTimeout(refreshID_jazz_happy4);
  synth_jazz.triggerAttackRelease([x_jazz_happy4[i_jazz-1], y_jazz_happy4[i_jazz-1], z_jazz_happy4[i_jazz-1], w_jazz_happy4[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_sad1(){
  clearTimeout(refreshID_jazz_sad1);
  synth_jazz.triggerAttackRelease([x_jazz_sad1[i_jazz-1], y_jazz_sad1[i_jazz-1], z_jazz_sad1[i_jazz-1], w_jazz_sad1[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_sad2(){
  clearTimeout(refreshID_jazz_sad2);
  synth_jazz.triggerAttackRelease([x_jazz_sad2[i_jazz-1], y_jazz_sad2[i_jazz-1], z_jazz_sad2[i_jazz-1], w_jazz_sad2[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_sad3(){
  clearTimeout(refreshID_jazz_sad3);
  synth_jazz.triggerAttackRelease([x_jazz_sad3[i_jazz-1], y_jazz_sad3[i_jazz-1], z_jazz_sad3[i_jazz-1], w_jazz_sad3[i_jazz-1]], 0.00001 );
}

function stop_prog_jazz_sad4(){
  clearTimeout(refreshID_jazz_sad4);
  synth_jazz.triggerAttackRelease([x_jazz_sad4[i_jazz-1], y_jazz_sad4[i_jazz-1], z_jazz_sad4[i_jazz-1], w_jazz_sad4[i_jazz-1]], 0.00001 );
}

function stop_prog_trap(){
  clearTimeout(refreshID_trap);
  synth_trap.triggerAttackRelease([x_trap[i_trap-1]], 0.00001);
}

function stop_prog_trap_sad(){
  clearTimeout(refreshID_trap_sad);
  synth_trap.triggerAttackRelease([x_trap_sad[i_trap-1]], 0.00001);
}

var length_vett;
function adjust_length () {
if (vett_posY3.length%2==0) {
 length_vett=vett_posY3.length
  }
else {
    length_vett=vett_posY3.length + 1 
  }
}

function play_progression_jazz_happy(){
  if (happyness.value==1){
    play_progression_jazz_happy1()
   }
   if (happyness.value==2){
    play_progression_jazz_happy2()
   }
   if (happyness.value==3){
    play_progression_jazz_happy3()
   }
   if (happyness.value==4){
    play_progression_jazz_happy4()
   }
}

function progression_happy(){
  if (genre.value=="dubstep"){
    play_progression_dub()
  }
  else if (genre.value=="jazz"){
    play_progression_jazz_happy()
  }
  else if (genre.value=="hip-hop"){
    play_progression_hiphop()
  }
  else if (genre.value=="rock"){
    play_progression_rock()
  }
  else if (genre.value=="trap"){
    play_progression_trap()
  }
}

function play_progression_jazz_sad(){
  if (happyness.value==1){
    play_progression_jazz_sad1()
   }
   if (happyness.value==2){
    play_progression_jazz_sad2()
   }
   if (happyness.value==3){
    play_progression_jazz_sad3()
   }
   if (happyness.value==4){
    play_progression_jazz_sad4()
   }
}


function progression_sad(){
  if (genre.value=="dubstep"){
    play_progression_dub_sad()
  }
  else if (genre.value=="jazz"){
    play_progression_jazz_sad()
  }
  else if (genre.value=="hip-hop"){
    play_progression_hiphop_sad()
  }
  else if (genre.value=="rock"){
    play_progression_rock_sad()
  }
  else if (genre.value=="trap"){
    play_progression_trap_sad()
  }
}

function stop_prog_jazz_happy(){
  if (happyness.value==1){
    stop_prog_jazz_happy1()
   }
  if (happyness.value==2){
    stop_prog_jazz_happy2()
   }
  if (happyness.value==3){
    stop_prog_jazz_happy3()
   }
  if (happyness.value==4){
    stop_prog_jazz_happy4()
   }
}

function stop_progression() {
  if (genre.value=="dubstep"){
    stop_prog_dub()
  }
  else if (genre.value=="jazz"){
    stop_prog_jazz_happy()
  }
  else if (genre.value=="hip-hop"){
    stop_prog_hiphop()
  }
  else if (genre.value=="rock"){
    stop_prog_rock()
  }
  else if (genre.value=="trap"){
    stop_prog_trap()
  }
 
}

function stop_prog_jazz_sad(){
  if (happyness.value==1){
    stop_prog_jazz_sad1()
   }
  if (happyness.value==2){
    stop_prog_jazz_sad2()
   }
  if (happyness.value==3){
    stop_prog_jazz_sad3()
   }
  if (happyness.value==4){
    stop_prog_jazz_sad4()
   }
}

function stop_progression_sad() {
  if (genre.value=="dubstep"){
    stop_prog_dub_sad()
  }
  else if (genre.value=="jazz"){
    stop_prog_jazz_sad()
  }
  else if (genre.value=="hip-hop"){
    stop_prog_hiphop_sad()
  }
  else if (genre.value=="rock"){
    stop_prog_rock_sad()
  }
  else if (genre.value=="trap"){
    stop_prog_trap_sad()
  }
 
}

var mood;

function detect_geom_canvas3() {
  adjust_length()
  if (vett_posY3[vett_posY3.length-1]-vett_posY3[length_vett/2] < 10*(-1)) {    
    Tone.start()
    progression_happy() 
    mood=1;
    console.log("happy")  
  }
  else if (vett_posY3[vett_posY3.length-1]-vett_posY3[length_vett/2] > 10) {
    Tone.start()
    progression_sad()
    mood=0;
    console.log("sad")
  }
  else if(Math.abs(vett_posY3[vett_posY3.length-1]-vett_posY3[length_vett/2]) < 7 && vett_posX3[vett_posX3.length-1]-vett_posX3[0]>25) {
    
     if (mood==1) {
       stop_progression()
     }
     else {
       stop_progression_sad()
     }
   console.log("horizontal line")
  }
}


//------------ometro-----------
document.querySelector("#monitor").innerText = 1;
const happyness = document.querySelector("#ometro")
happyness.oninput = function() {
  document.querySelector("#monitor").innerText = happyness.value;
}

document.querySelector("#monitor2").innerText = "C";
synth_jazz.set("detune", +1200);
const key = document.querySelector("#key")
key.oninput = function() {
  if (key.value==1){
   document.querySelector("#monitor2").innerText = "Gb";
   synth_jazz.set("detune", +1800);
   synth_sax.set("detune", +3000);
  }
  if (key.value==2){
   document.querySelector("#monitor2").innerText = "Db";
   synth_jazz.set("detune", +1300);
   synth_sax.set("detune", +2500);
  }
  if (key.value==3){
   document.querySelector("#monitor2").innerText = "Ab";
   synth_jazz.set("detune", +800);
   synth_sax.set("detune", +2000);
  }
  if (key.value==4){
   document.querySelector("#monitor2").innerText = "Eb";
   synth_jazz.set("detune", +1500);
   synth_sax.set("detune", +2700);
  }
  if (key.value==5){
    document.querySelector("#monitor2").innerText = "Bb";
    synth_jazz.set("detune", +1000);
    synth_sax.set("detune", +2200);
   }
  if (key.value==6){
    document.querySelector("#monitor2").innerText = "F";
    synth_jazz.set("detune", +1700);
    synth_sax.set("detune", +2900);
   }
  if (key.value==7){
    document.querySelector("#monitor2").innerText = "C";
    synth_jazz.set("detune", +1200);
    synth_sax.set("detune", +2400);
   }
   if (key.value==8){
    document.querySelector("#monitor2").innerText = "G";
    synth_jazz.set("detune", +1900);
    synth_sax.set("detune", +3100);
   }
   if (key.value==9){
    document.querySelector("#monitor2").innerText = "D";
    synth_jazz.set("detune", +1400);
    synth_sax.set("detune", +2600);
   }
   if (key.value==10){
    document.querySelector("#monitor2").innerText = "A";
    synth_jazz.set("detune", +900);
    synth_sax.set("detune", +2100);
   }
   if (key.value==11){
    document.querySelector("#monitor2").innerText = "E";
    synth_jazz.set("detune", +1600);
    synth_sax.set("detune", +2800);
   }
   if (key.value==12){
    document.querySelector("#monitor2").innerText = "B";
    synth_jazz.set("detune", +1100);
    synth_sax.set("detune", +2300);
   }
  

}


//----------new canvas2--------------
  
var canvas2 = document.getElementById("sig-canvas2");
var ctx2 = canvas2.getContext("2d");
ctx2.strokeStyle = "black";
ctx2.lineWidth = 4;


var drawing2 = false;
var mousePos2 = { x:0, y:0 };
var lastPos2 = mousePos2;
canvas2.addEventListener("mousedown", function (e) {
        vett_posY2=[];
        vett_posX2=[];
        drawing2 = true;
        lastPos2 = getMousePos2(canvas2, e);
        ctx2.moveTo(lastPos2.x,lastPos2.y)
        ctx2.arc(lastPos2.x,lastPos2.y,0.5,0,2*Math.PI)
        ctx2.stroke()
        bpm=document.getElementById("tempo").value;
}, false);
canvas2.addEventListener("mouseup", function (e) {
  drawing2 = false;  
  detect_geom_canvas2()  
  setTimeout(clear_realtime_canvas2, 500)
}, false);
canvas2.addEventListener("mousemove", function (e) {
  mousePos2 = getMousePos2(canvas2, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos2(canvasDom2, mouseEvent2) {
  var circle = canvasDom2.getBoundingClientRect();
  return {
    x: mouseEvent2.clientX - circle.left,
    y: mouseEvent2.clientY - circle.top
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimaitonFrame ||
           function (callback) {
        window.setTimeout(callback, 1000/60);
           };
})();

var vett_posY2=[];
var vett_posX2=[];

// Draw to the canvas
function renderCanvas2() {
  if (drawing2) {
    ctx2.moveTo(lastPos2.x, lastPos2.y);
    ctx2.lineTo(mousePos2.x, mousePos2.y);
    ctx2.stroke();
    vett_posY2.push(lastPos2.y);
    vett_posX2.push(lastPos2.x);
    lastPos2 = mousePos2;    
  }
}


// Allow for animation
(function drawLoop2 () {
  requestAnimFrame(drawLoop2);
  renderCanvas2();
})();



// Set up touch events for mobile, etc
canvas2.addEventListener("touchstart", function (e) {
        mousePos2 = getTouchPos2(canvas2, e);
  var touch2 = e.touches[0];
  var mouseEvent2 = new MouseEvent2("mousedown", {
    clientX: touch2.clientX,
    clientY: touch2.clientY
  });
  canvas2.dispatchEvent(mouseEvent2);
}, false);
canvas2.addEventListener("touchend", function (e) {
  var mouseEvent2 = new MouseEvent2("mouseup", {});
  canvas2.dispatchEvent(mouseEvent2);
}, false);
canvas2.addEventListener("touchmove", function (e) {
  var touch2 = e.touches[0];
  var mouseEvent2 = new MouseEvent2("mousemove", {
    clientX: touch2.clientX,
    clientY: touch2.clientY
  });
  canvas2.dispatchEvent(mouseEvent2);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos2(canvasDom2, touchEvent2) {
  var circle = canvasDom2.getBoundingClientRect();
  return {
    x: touchEvent2.touches[0].clientX - circle.left,
    y: touchEvent2.touches[0].clientY - circle.top
  };
}



// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas2) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas2) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas2) {
    e.preventDefault();
  }
}, false);
    
function clear_realtime_canvas2() {
  canvas2.width = canvas2.width
  ctx2.lineWidth = 4
}

function detect_geom_canvas2 () {
 
  if (Math.abs(vett_posX2[vett_posX2.length-1]-vett_posX2[0]) < 7 && Math.abs(vett_posY2[vett_posY2.length-1]-vett_posY2[0]) < 7) {
    playfund();
    console.log("hai fatto un punto")
  }  
   
  else if (Math.atan(Math.abs((vett_posY[vett_posY.length-1]-vett_posY[0])/(vett_posX[vett_posX.length-1]-vett_posX[0]))) < Math.PI/10){
    playthird();
    console.log("riga orizzontale")
  }
       
  else if (Math.atan(Math.abs((vett_posY[vett_posY.length-1]-vett_posY[0])/(vett_posX[vett_posX.length-1]-vett_posX[0]))) >Math.PI*0.4){
    playfifth()
    console.log("riga verticale")
   }
  
  else  {
    playseventh()
    console.log("riga obliqua")}
   
 }


 //----------------synth sax-------------
 var reverb = new Tone.JCReverb(0.5).connect(Tone.Master);

 //var delay = new Tone.PingPongDelay (0.1,0.8)
 
 var chorus = new Tone.Chorus(1,1.5,1)
 
 var eq = new Tone.EQ3(-30, -30, -30); 
 
 var synth_sax = new Tone.PolySynth(1, Tone.Synth, {
     oscillator : {
           type : "square"
       },
       envelope : {
       attack : 0.2 ,
       decay : 0.1 ,
       sustain : 0.1 ,
       release : 0.1
       }
 }).chain(eq, chorus,  /*delay,*/ reverb);

synth_sax.set("detune",2400)

function playfund(){
  synth_sax.triggerAttackRelease([fund], 0.5)
}

function playthird(){
  synth_sax.triggerAttackRelease([third], 0.5)
}

function playfifth(){
  synth_sax.triggerAttackRelease([fifth], 0.5)
}

function playseventh(){
  synth_sax.triggerAttackRelease([seventh], 0.5)
}
