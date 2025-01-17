var cnvWidth = 1, cnvHeight = 1;
var t = 0;
var N = 2;
var M = 1500;
var deltaT = 0.001;

function setup() {
  cnv = createCanvas(windowWidth*cnvWidth, windowHeight*cnvHeight);
  cnv.position(0.5*(1 - cnvWidth)*windowWidth, 0.5*(1 - cnvHeight)*windowHeight);

  drawing = false;
  done = false;

  c = [];
  mycurve = new Curve();
  approxCurve = new Curve();
}

function mouseWheel(event) {
  deltaT = deltaT*exp(-event.delta/1000);
}

function draw() {

  update();

  // reposition canvas
  cnv.position(0.5*(1 - cnvWidth)*windowWidth, 0.5*(1 - cnvHeight)*windowHeight);
  resizeCanvas(windowWidth*cnvWidth, windowHeight*cnvHeight);

  // background color
  background(0, 0, 0);

  // draw curve
  if (done) {
    stroke(40);
    mycurve.draw();
    stroke(85);
    approxCurve.draw();

    // draw circles
    noFill();
    stroke(200, 0, 0);

    s = createVector(0, 0);
    s.add(c[N]);
    for (var i = 1; i <= N; i++) {

      r = p5.Vector.rotate(c[N+i],-2*PI*i*t);
      circle(s.x, s.y, 2*r.mag());
      s1 = p5.Vector.add(s,r);
      line(s.x, s.y, s1.x, s1.y);
      s.add(r);

      r = p5.Vector.rotate(c[N-i],2*PI*i*t);
      circle(s.x, s.y, 2*r.mag());
      s1 = p5.Vector.add(s,r);
      line(s.x, s.y, s1.x, s1.y);
      s.add(r);
    }
  }
  else {
    stroke(150);
    mycurve.draw();
  }

}

function keyPressed() {
  if ((keyCode === 73 || keyCode === 85) && !drawing) {

    // change value of N
    if (keyCode === 85 && N > 1) {
      N = N - pow(10, ceil(log(N)/log(10)) - 1);
      if (done)
        getApproximation();
    }
    if (keyCode === 73 && N < 1000) {
      N = N + pow(10, ceil(log(N + 1)/log(10)) - 1);
      if (done)
        getApproximation();
    }

    console.log(N);
  }
}

function update() {

  t = t + deltaT;

  // start darwing curve
  if (mouseIsPressed && !drawing) {
    drawing = true;
    done = false;
    mycurve = new Curve();
  }

  // stop drawing curve
  if (!mouseIsPressed && drawing) {
    mycurve.finishCurve();
    drawing = false;
    done = true;

    getApproximation();
  }

  if (drawing) {
    mycurve.addPoint(createVector(mouseX, mouseY));
  }
}

function getApproximation() {
  c = [];
  samples = mycurve.sample(M);

  if (mycurve.points.length > 1) {
    for (var i = 0; i < 2*N + 1; i++) {
      c.push(computeCn(samples, i-N, M));
    }

    approxCurve = new Curve();
    for (var i = 0; i < M; i++) {
      approxCurve.addPoint(computeApprox(c, N, i/M));
    }
    approxCurve.finishCurve();
  }
  else {
    mycurve = new Curve();
    drawing = false;
    done = false;
  }
}
