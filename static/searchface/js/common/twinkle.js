"use strict";

var canvas = document.querySelector("canvas"),
    gl = canvas.getContext("webgl");

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, "\nprecision mediump float;\n\nuniform mat4 mvp;\n\nattribute vec3 position;\n\nvoid main(void) {\n\n  vec4 finalPosition = mvp * vec4(position, 1.0);\n\n  gl_Position = finalPosition;\n\n  if (gl_Position.w > 0.0) {\n    gl_PointSize = 4.0 / gl_Position.w;\n  } else {\n    gl_PointSize = 0.0;\n  }\n\n}");
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(vertexShader));
}

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, "\nprecision highp float;\n\nconst vec4 begin = vec4(0.1, 0.75, 1.0, 1.0);\nconst vec4 end = vec4(1.0, 1.0, 1.0, 1.0);\n\nvec4 interpolate4f(vec4 a,vec4 b, float p) {\n  return a + (b - a) * p;\n}\n\nvoid main(void) {\n\n  vec2 pc = (gl_PointCoord - 0.5) * 2.0;\n\n  float dist = (1.0 - sqrt(pc.x * pc.x + pc.y * pc.y));\n  vec4 color = interpolate4f(begin, end, dist);\n\n  gl_FragColor = vec4(dist, dist, dist, dist) * color;\n\n}");

gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(fragmentShader));
}

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

var attributes = {
  position: gl.getAttribLocation(program, "position")
},
    uniforms = {
  mvp: gl.getUniformLocation(program, "mvp")
};

var NUM_POINTS = 2500;
var points = [];
for (var index = 0; index < NUM_POINTS; index++) {
  // points.push((Math.random() - 0.5) * 8);
  // points.push((Math.random() - 0.5) * 8);
  // points.push((Math.random() - 0.5) * 8);

  points.push((Math.random() - 0.5) * 2);
  points.push((Math.random() - 0.5) * 2);
  points.push((Math.random() - 0.5) * 2);

  // points.push((Math.random() * 0.5 - 0.3) * 4);
  // points.push((Math.random() * 0.5 - 0.3) * 4);
  // points.push((Math.random() * 0.5 - 0.3) * 4);
}

var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

var pMatrix = mat4.create(),
    vMatrix = mat4.create(),
    ivMatrix = mat4.create(),
    mMatrix = mat4.create(),
    mvMatrix = mat4.create(),
    mvpMatrix = mat4.create(),
    position = vec3.create();

mat4.perspective(pMatrix, Math.PI * 0.35, canvas.width / canvas.height, 0.01, 1000.0);

vec3.set(position, 0.0, 0.0, 0.0);

var angle = 0.0;

function render(now) {

  angle += 0.0002;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, canvas.width, canvas.height);

  // P * V * M
  //mat4.translate(mvpMatrix, mvpMatrix, position);
  mat4.identity(mMatrix);

  position[2] = Math.sin(1);

  mat4.identity(vMatrix);
  // mat4.translate(vMatrix, vMatrix, position);
  mat4.rotateX(vMatrix, vMatrix, angle);
  mat4.rotateY(vMatrix, vMatrix, angle);
  mat4.rotateZ(vMatrix, vMatrix, angle);

  mat4.invert(ivMatrix, vMatrix);

  mat4.multiply(mvMatrix, ivMatrix, mMatrix);
  mat4.multiply(mvpMatrix, pMatrix, mvMatrix);

  gl.useProgram(program);
  gl.enableVertexAttribArray(attributes.position);
  gl.uniformMatrix4fv(uniforms.mvp, false, mvpMatrix);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * 4, 0);
  gl.drawArrays(gl.POINTS, 0, NUM_POINTS);

  //console.count("render");

  window.requestAnimationFrame(render);
  $("body").css({"background":"transparent"});
}

render();
function resize() {

  canvas.width = document.body.scrollWidth;
  canvas.height = document.body.scrollHeight;//document.body.scrollHeight;

  mat4.perspective(pMatrix, Math.PI * 0.35, canvas.width / canvas.height, 0.01, 1000.0);
}

resize();

window.addEventListener("resize", resize);
