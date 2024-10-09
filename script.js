const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function drawLine(x1, y1, x2, y2, color, width = 1) {
  //x2 = x1 + 1;
  //y2 = y1 + 1;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawTriangle(x1, y1, x2, y2, x3, y3, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

function drawRect(x1, y1, x2, y2, x3, y3, x4, y4, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x4, y4);
  ctx.lineTo(x3, y3);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

function drawImg(img, x, y, width, height) {
  //const img = new Image();
  //img.src = src;
  img.onload = () => {
    ctx.drawImage(img, x, y, width, height);
  };
}

level = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 0, 1],
  [1, 1, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 0, 0, 1, 1],
  [1, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
];

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPerspective();
  cameraZ += 1;
  //drawLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, "#ff00ff");
  //drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, "#ff00ff");
  requestAnimationFrame(update);
}

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

let blockWidth = 100;
let blockLength = 40;
let blockHeight = 40;
let cameraX = 0;
let cameraY = 460;
let cameraZ = -80;
let renderDistance = 16;
let renderDebug = false;
let fov = 90;

function project(position) {
  let mapCenterX = (level[0].length * blockWidth) / 2;
  let mapCenterY = (level.length * blockWidth) / 2;
  let screenCenterX = canvas.width / 2;
  let screenCenterY = canvas.height / 2;
  let x = position[0];
  let y = position[1];
  let z = position[2];
  x -= mapCenterX - cameraX;
  z -= cameraZ;
  if (z < -0) {
    z = -0;
  }
  x = (x * fov) / (z + fov);
  z = ((y + cameraY) * fov) / (z + fov);
  return [x + screenCenterX, screenCenterY + z];
}

function drawDebug(point_lu, point_ru, point_lb, point_rb, z) {
  function drawLineSpecial(x1, y1, x2, y2, color, special) {
    if (special) {
      color = "#f0f";
    }
    drawLine(x1, y1, x2, y2, color, 1);
  }
  let special = z == 0;
  drawLineSpecial(
    point_lu[0],
    point_lu[1],
    point_lb[0],
    point_lb[1],
    "#000",
    special
  );
  drawLineSpecial(
    point_ru[0],
    point_ru[1],
    point_rb[0],
    point_rb[1],
    "#f00",
    special
  );
  drawLineSpecial(
    point_lu[0],
    point_lu[1],
    point_ru[0],
    point_ru[1],
    "#0f0",
    special
  );
  drawLineSpecial(
    point_lb[0],
    point_lb[1],
    point_rb[0],
    point_rb[1],
    "#00f",
    special
  );
  //drawLine(point_lut[0], point_lut[1], point_lbt[0], point_lbt[1], l);
  //drawLine(point_rut[0], point_rut[1], point_rbt[0], point_rbt[1], "#f00");
  //drawLine(point_lut[0], point_lut[1], point_rut[0], point_rut[1], "#0f0");
  //drawLine(point_lbt[0], point_lbt[1], point_rbt[0], point_rbt[1], "#00f");
  //drawLine(point_lu[0], point_lu[1], point_lut[0], point_lut[1], l);
  //drawLine(point_ru[0], point_ru[1], point_ru[0], point_rut[1], "#f00");
  //drawLine(point_lb[0], point_lb[1], point_lb[0], point_lbt[1], "#0f0");
  //drawLine(point_rb[0], point_rb[1], point_rb[0], point_rbt[1], "#00f");
}

function drawPerspective() {
  for (let z = level.length - 1; z >= 0; z--) {
    for (let x = 0; x < level[level.length - z - 1].length; x++) {
      let pointX = x * blockWidth;
      let pointZ = z * blockLength;

      let point_lu = project([pointX, 0, pointZ]);
      let point_ru = project([pointX + blockWidth, 0, pointZ]);
      let point_lb = project([pointX, 0, pointZ + blockLength]);
      let point_rb = project([pointX + blockWidth, 0, pointZ + blockLength]);

      let point_lut = project([pointX, blockHeight, pointZ]);
      let point_rut = project([pointX + blockWidth, blockHeight, pointZ]);
      let point_lbt = project([pointX, blockHeight, pointZ + blockLength]);
      let point_rbt = project([
        pointX + blockWidth,
        blockHeight,
        pointZ + blockLength,
      ]);

      if (level[level.length - z - 1][x] == 0) {
        continue;
      }
      if (renderDebug) {
        drawDebug(point_lu, point_ru, point_lb, point_rb, z);
        continue;
      }
      if (z * blockLength - cameraZ > renderDistance * blockLength) {
        //continue;
      }

      let l = "#000";
      if (z == 0) {
        l = "#fff";
      }
      if (
        x == level[level.length - z - 1].length - 1 ||
        level[level.length - z - 1][x + 1] == 0
      ) {
        drawRect(
          point_rut[0],
          point_rut[1],
          point_rbt[0],
          point_rbt[1],
          point_ru[0],
          point_ru[1],
          point_rb[0],
          point_rb[1],
          "#333"
        );
      }

      if (x == 0 || level[level.length - z - 1][x - 1] == 0) {
        drawRect(
          point_lut[0],
          point_lut[1],
          point_lbt[0],
          point_lbt[1],
          point_lu[0],
          point_lu[1],
          point_lb[0],
          point_lb[1],
          "#333"
        );
      }

      if (z == 0 || level[level.length - z][x] == 0) {
        drawRect(
          point_lut[0],
          point_lut[1],
          point_lu[0],
          point_lu[1],
          point_rut[0],
          point_rut[1],
          point_ru[0],
          point_ru[1],
          "#0f0"
        );
      }

      drawRect(
        point_lu[0],
        point_lu[1],
        point_lb[0],
        point_lb[1],
        point_ru[0],
        point_ru[1],
        point_rb[0],
        point_rb[1],
        "#000"
      );
    }
  }
}

update();
