let lines = [];

let mesh;

let dir;
let ball;
let prev;

let walker;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(51);
	mesh = new Mesh(1, 25, 5);
	mesh.update();
	walker = new Walker();
	noStroke();
	//colorMode(HSB)
	//ellipse(100, 100, 3, 3);
	//mesh.show();
	ball = createVector(-1, -1);
}

function keyPressed() {

}


function mousePressed() {

}

function mouseMoved() {
	ball.x = mouseX;
	ball.y = mouseY;
	//mesh.move(ball);
	//line.spacing = map(mouseX, 0, width, 1, 100);
	//line.update();
	if (!prev) {
		prev = ball.copy();
	} else {
		dir = p5.Vector.sub(ball, prev);
		//console.log(dir);
		dir.normalize();
		//dir.mult(50);

		mesh.move(ball);

		//dir.mult(10);
	}
	drawBall();
}

function drawBall() {
	if (ball.x >= 0) {
		fill(0, 255, 5);
		ellipse(ball.x, ball.y, 10, 10);
	}
	// push();
	// translate(ball.x, ball.y);
	// if (dir) {
	// 	line(0, 0, dir.x, dir.y);
	// }
	// pop();
}


function draw() {
	//console.log(count);	
	background(51);

	mesh.show();
	walker.move();
	//walker.show();
}

function Walker() {
	this.pos = createVector(random(width), random(height));
	this.tx = 0;
	this.ty = 10000;

	this.move = function() {
		this.pos.x = map(noise(this.tx), 0, 1, 0, width);
		this.pos.y = map(noise(this.ty), 0, 1, 0, height);
		this.tx += 0.01;
		this.ty += 0.01;
		if (!prev) {
			prev = this.pos.copy();
		} else {
			dir = p5.Vector.sub(this.pos, prev);
			//console.log(dir);
			dir.normalize();
			//dir.mult(50);

			mesh.move(this.pos);

			//dir.mult(10);
		}


	}

	this.show = function() {
		fill(51);
		ellipse(this.pos.x, this.pos.y, 1, 1);

	}
}

function Mesh(gradient, offset, spacing) {
	this.gradient = gradient;
	this.offset = offset;
	this.spacing = spacing;
	this.lines = [];
	this.r = 3;

	this.update = function() {
		this.lines = [];
		//var y = 0;

		for (var y = -width; y < height; y += this.offset) {
			var l = new Line(this.gradient, y, this.spacing);
			l.update();
			this.lines.push(l);

		}
	}


	this.move = function(pos) {
		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].move(pos);
		}
	}

	this.show = function() {
		fill(210);

		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].show();
		}
	}

}

function Point(x, y) {
	this.pos = createVector(x, y);
	this.start_pos = createVector(x, y);
	this.R = 75;
	this.maxMove = 50;
	this.maxOther = 100;

	this.move = function(new_pos) {
		var d = this.pos.dist(new_pos);
		var new_dir = p5.Vector.mult(dir, this.R / d);
		new_dir.limit(this.maxOther);
		if (this.pos.dist(this.start_pos) < this.maxMove) {
			//if (d < this.R) {
			//console.log(new_dir);
			//if (new_dir.mag() > 0.04)
				this.pos.add(new_dir);
		}


	}

	this.moveBack = function() {
		var new_dir = p5.Vector.sub(this.start_pos, this.pos);
		//console.log(dir);
		if (new_dir.mag() > 0.5) {
			new_dir.normalize();

			//new_dir.mult(-1);
			this.pos.add(new_dir);

		}


	}
}


function Line(gradient, offset, spacing) {
	this.gradient = gradient;
	this.offset = offset;
	this.spacing = 10;
	this.points = [];
	this.r = 3;

	this.update = function() {
		this.points = [];
		for (var x = 0; x < width; x += this.spacing) {
			y = this.gradient * x + this.offset;

			if (x >= 0 && y >= 0) {
				this.points.push(new Point(x, y));
			}
			//console.log(x,y);
		}

	}

	this.move = function(pos) {
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].move(pos);
		}
	}


	this.show = function() {
		beginShape();
		noFill();
		stroke(210);
		for (var i = 0; i < this.points.length; i++) {
			var point = this.points[i];
			//ellipse(point.x, point.y, this.r, this.r);
			vertex(point.pos.x, point.pos.y);
			point.moveBack();
		}
		endShape();

	}
}