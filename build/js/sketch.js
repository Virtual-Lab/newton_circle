var scale = [];
var sdots = [];
var n = 5; // number of circle
var trp = 22;  // transposition interval
var n_tet = 53; // division of the octave
var dr = 20; // distance between circles
var r_0 = 150; // radius of innermost scale
var xM =300, yM = 300; // position of the centre of the circles 
var d_phi = (2*Math.PI)/n_tet;
var anzahl = 7 * n;
var gfreq = 220;
var chooseOsczil = document.getElementById("osc");
var inputFreq = document.getElementById("gfreq");
var submitFreq = document.getElementById("setFreq")

var SDot = class {

  constructor (x, y, p, n, o) {
    this.xPos = x;
    this.yPos = y;
    this.pitch = p; 
    this.n_c = n;
    this.on = o;

    this.freq = Math.pow(2, p/n_tet);

    this.sw_on = function() {
      this.on=1;
    };

    this.sw_off = function() {
      this.on=0;
    };

    this.osc = {};
  }

}

function setupPoints() {
  var phi;
  var r, nc, p;

  scale = [0, 9, 17, 22, 31, 39, 48];
  sdots = new Array(anzahl);

  console.log("n =", n, "trp =", trp, "n-tet = ", n_tet, "dr = ", dr, 
    "r_0 = ",  r_0, "xM =", xM, "yM = ", yM, "d_phi = ", d_phi, "anzahl = ", anzahl);

  for (var k=0; k < anzahl; k++) { 

    nc = int(k / scale.length);
    p = (scale[k % scale.length]+nc*trp) % n_tet; // pitch
    r = r_0 + nc * dr;
    phi = p*d_phi;
    sdots[k] = new SDot(xM + r*Math.sin(phi), yM - r*Math.cos(phi), p, nc, 0);

    sdots[k].osc = new Sound(gfreq * sdots[k].freq);
    //sdots[k].osc.wave.type = chooseOsczil.value;
    //sdots[k].osc.start();

    console.log(nc, p, r);
  };

  
}

function setOsc (event) {

  event.preventDefault();

  for (var k=0; k < anzahl; k++) { 

    //sdots[k].osc.stop();
    sdots[k].osc.setType(chooseOsczil.value);
    //sdots[k].osc.start();

    console.log(chooseOsczil.value);

  }
}

function setFreq(event) {

  event.preventDefault();
  gfreq = inputFreq.value;

  for (var k=0; k < anzahl; k++) { 
    sdots[k].osc.freq(gfreq * sdots[k].freq);
  };
  
}

function setup() {

  var Diagram = createCanvas(600, 600);
  Diagram.parent("diagram");
  Synth.init();

  ellipseMode(RADIUS);

  setupPoints();


  // chooseOsczil.addEventListener('change', setOsc, false);
  // chooseOsczil.selectedindex = "1";

  submitFreq.addEventListener('click', setFreq, false)
  
  console.log(sdots, scale, scale.length);

  /*
  for (int k=0; k < sdots.length; k++) { 
   println(sdots[k].xPos, sdots[k].yPos, sdots[k].pitch);
   }
   */
   

}


function draw() {
  var pt = -1;  // current pitch (initialized as undefined)
  var ft = -1;  // current freq (initialized as undefined)
  background(255);
  noFill();
  for (var k=-1; k<n; k++) {
    ellipse(xM, yM, r_0+ k*dr, r_0+ k*dr);
  }
  for (var k=0; k < n_tet; k++) {
    line(xM+(r_0-dr)*Math.sin(k*d_phi), yM-(r_0-dr)*Math.cos(k*d_phi), xM+(r_0+(n-1)*dr)*Math.sin(k*d_phi), yM-(r_0+(n-1)*dr)*Math.cos(k*d_phi));
  }
  fill(255);
  for (var k=0; k < sdots.length; k++) { 
    if (sdots[k].on == 1) {
      fill(0);
      pt = sdots[k].pitch;
      ft = sdots[k].freq*gfreq;

      text(pt, 50, 50);
      text("Frequenz = " + ft, 70, 50);
      fill(255, 0, 0);

    } else {
      fill(255);
    }
    ellipse(sdots[k].xPos, sdots[k].yPos, 5, 5);
    fill(0);
    ellipse(xM+(r_0-dr)*Math.sin(sdots[k].pitch*d_phi), yM-(r_0-dr)*Math.cos(sdots[k].pitch*d_phi), 5, 5);
  }
  fill(255, 0, 0);
  if (pt != -1) {
    ellipse(xM+(r_0-dr)*Math.sin(pt*d_phi), yM-(r_0-dr)*Math.cos(pt*d_phi), 5, 5);
  }
}

function mousePressed() {
  for (var k=0; k < sdots.length; k++) { 
    if (dist(sdots[k].xPos, sdots[k].yPos, mouseX, mouseY) < 5) {
      
      if (!sdots[k].osc.active) {
        sdots[k].sw_on();
        sdots[k].osc.play();
        console.log(sdots[k].xPos, sdots[k].yPos, sdots[k].pitch)
      }

        
    }
  }
}

function mouseReleased() {
  for (var k=0; k < sdots.length; k++) { 
    if (!sdots[k].osc.hold && sdots[k].osc.active) {
      sdots[k].sw_off();
       sdots[k].osc.stop()
     }
  }
}