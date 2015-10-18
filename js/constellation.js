"use strict";

var points = [];
var pointCount = 200;
var _canRun = true;
var canvas = document.getElementById("constellation");
var context = canvas.getContext("2d");
context.lineWidth = 1;
context.translate(0.5, 0.5); // Fixes lines not being 1px wide

var MAX_DISTANCE = 400;
var MIN_DISTANCE = 50;
var POINT_RADIUS = 3;
var LINE_TRIGGER = 60;

var width = canvas.clientWidth + MAX_DISTANCE;
var height = canvas.clientHeight + MAX_DISTANCE;
function setup(amount)
{
	pointCount = amount || pointCount;
	window.requestAnimationFrame = window.requestAnimationFrame || 
	                               window.mozRequestAnimationFrame || 
	                               window.webkitRequestAnimationFrame || 
	                               window.msRequestAnimationFrame;

	if (window.requestAnimationFrame == "undefined")
	{
		_canRun = false;
		console.log("Couldn't find requestAnimationFrame");
	}

	// Generate points
	// Each point has:
	//  - An origin (cx, cy) that doesn't change
	//  - A rendered position (x, y) that rotates on a circle
	//  - A pair of radius (rx, ry), defining the ellipse around which the point rotates
	//  - A color
	//  - A size modifier, that gets added to the reguler point size
	// x, y Can be generated anywhere between -MAX_DISTANCE/2 and SCREEN_HEIGHT so we can cover the entire screen 

	for (var i = 0; i < pointCount; i++) 
	{
		var x = Math.floor(Math.random() * (width)) - MAX_DISTANCE/2;
		var y = Math.floor(Math.random() * (height)) - MAX_DISTANCE/2;
		points.push({
			x: x,
			y: y,
			cx: x,
			cy: y,
			speed: Math.floor(Math.random() * 6000) + 2000,
			rx: Math.floor(Math.random() * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
			ry: Math.floor(Math.random() * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE),
			sizeModifier: Math.floor(Math.random() * 2) + 1 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
			color: pointColor(),
		});
	}

	resizeCanvas();
	window.addEventListener('resize', function() {
		resizeCanvas();
	}, false);
}

// Resize the canvas according to the window size
// Doesn't change the x,y position of the points
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Gets a random color for a point
function pointColor() {
	return ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.7)"][Math.floor(Math.random() * 5)];
}

// Draw loop
// Draws points, finds out which lines needs to be drawn then draws them
function draw(timestep) {
	// Clear the render target
	context.fillStyle = "#222";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// O(n²), nice.
	// Could apparently be replaced with matrix math to achieve O(n)
	for (var i = 0; i < pointCount; i++) {
		// Points are drawn with a filled circle
		context.fillStyle = points[i].color;
		context.strokeStyle = points[i].color;
		context.beginPath();
		context.arc(points[i].x, points[i].y, POINT_RADIUS + points[i].sizeModifier, 0, Math.PI*2, false);
		context.fill();
		context.closePath();
		for (var j = 0; j < pointCount; j++) {
			// Find out the distance
			var dX = Math.floor(points[i].x - points[j].x);
			var dY = Math.floor(points[i].y - points[j].y);
			var distance = Math.sqrt(dX*dX + dY*dY);

			if (distance < LINE_TRIGGER && i != j) {
				context.beginPath();
				context.moveTo(points[i].x + 0.5, points[i].y);
				context.lineTo(points[j].x + 0.5, points[j].y);
				context.stroke();
				context.closePath();
			}
		}
	}
}

// Animation loop
// Moves points around
function animate(timestep) {
	for (var i = 0; i < pointCount; i++) {
		points[i].x = points[i].cx + points[i].rx * Math.cos(timestep / points[i].speed);
		points[i].y = points[i].cy + points[i].ry * Math.sin(timestep / points[i].speed);
	}
}

function renderLoop(timestep) {
	draw(timestep);
	animate(timestep); // Prepare for the next render

	requestAnimationFrame(renderLoop);
}
setup(500)

if (_canRun)
	requestAnimationFrame(renderLoop);