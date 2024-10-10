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

function drawRect(x1, y1, x2, y2, x3, y3, x4, y4, fillColor, borderColor) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x4, y4);
  ctx.lineTo(x3, y3);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.stroke();
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

const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPerspective();
  if (keys["w"]) {
    cameraZ += 10;
  }
  if (keys["s"]) {
    cameraZ -= 10;
  }
  if (keys["a"]) {
    cameraX -= 10;
  }
  if (keys["d"]) {
    cameraX += 10;
  }
  requestAnimationFrame(update);
}

let blockWidth = 100;
let blockLength = 100;
let blockHeight = 100;
let cameraX = (level[0].length * blockWidth) / 2;
let cameraY = 460;
let cameraZ = -80;
let renderDistance = 16;
let renderDebug = false;
let fov = 700;
let drawCalls = [];
let skew = 0;

function project(position) {
  let x = position[0];
  let y = position[1];
  let z = position[2];
  y += (z - cameraZ) * skew;
  let projectedX = ((x - cameraX) * fov) / (z - cameraZ + fov);
  let projectedY = ((y + cameraY) * fov) / (z - cameraZ + fov);
  return [projectedX, projectedY];
}

function drawDebug(vertices, z) {
  point_lu = project(vertices[0]);
  point_ru = project(vertices[1]);
  point_lb = project(vertices[2]);
  point_rb = project(vertices[3]);

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
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderDrawCalls() {
  drawCalls.sort((a, b) => {
    if (b.distanceMax === a.distanceMax) {
      return b.distanceMin - a.distanceMin;
    }
    return b.distanceMax - a.distanceMax;
  });
  for (call of drawCalls) {
    call["call"]();
  }
  drawCalls = [];
}

function getMeshFromBlock(x, y, z) {
  let point_lu = [x, y, z];
  let point_ru = [x + blockWidth, y, z];
  let point_lb = [x, y, z + blockLength];
  let point_rb = [x + blockWidth, y, z + blockLength];

  let point_lut = [x, y - blockHeight, z];
  let point_rut = [x + blockWidth, y - blockHeight, z];
  let point_lbt = [x, y - blockHeight, z + blockLength];
  let point_rbt = [x + blockWidth, y - blockHeight, z + blockLength];
  return [
    [
      point_lu,
      point_ru,
      point_lb,
      point_rb,
      point_lut,
      point_rut,
      point_lbt,
      point_rbt,
    ],
    [
      //[0, 1, 2, 3], // bottom
      [4, 5, 6, 7], // top
      [4, 5, 0, 1], // back
      [4, 6, 0, 2], // left
      [7, 5, 3, 1], // right
    ],
  ];
}

function distanceTo(position) {
  let x = position[0];
  let y = position[1];
  let z = position[2];

  let distance = Math.sqrt(
    Math.pow(x - cameraX, 2) +
      Math.pow(-y * 2 - cameraY, 2) +
      Math.pow(z - cameraZ, 2)
  );
  return distance;
}

function drawMesh(vertices, faces) {
  let screenCenterX = canvas.width / 2;
  let screenCenterY = canvas.height / 2 - 150;
  function drawRectCall(
    distanceMax,
    distanceMin,
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    x4,
    y4,
    fillColor,
    borderColor
  ) {
    drawCalls.push({
      distanceMax: distanceMax,
      distanceMin: distanceMin,
      call: () => {
        drawRect(x1, y1, x2, y2, x3, y3, x4, y4, fillColor, borderColor);
      },
    });
  }
  for (face of faces) {
    let color = "#1F259E";
    let v1 = vertices[face[0]];
    let v2 = vertices[face[1]];
    let v3 = vertices[face[2]];
    let v4 = vertices[face[3]];

    if (v1[1] == v2[1] && v1[1] == v3[1] && v1[1] == v4[1]) {
      color = "#2C35E0";
    } else if (v1[0] == v2[0] && v1[0] == v3[0] && v1[0] == v4[0]) {
      color = "#131760";
    }

    let p1 = project(v1);
    let p2 = project(v2);
    let p3 = project(v3);
    let p4 = project(v4);

    if (p1[1] < 0 || p2[1] < 0 || p3[1] < 0 || p4[1] < 0) {
      continue;
    }

    let d1 = distanceTo(v1);
    let d2 = distanceTo(v2);
    let d3 = distanceTo(v3);
    let d4 = distanceTo(v4);

    let distanceMax = Math.max(d1, d2, d3, d4);
    let distanceMin = Math.min(d1, d2, d3, d4);

    drawRectCall(
      distanceMax,
      distanceMin,
      p1[0] + screenCenterX,
      p1[1] + screenCenterY,
      p2[0] + screenCenterX,
      p2[1] + screenCenterY,
      p3[0] + screenCenterX,
      p3[1] + screenCenterY,
      p4[0] + screenCenterX,
      p4[1] + screenCenterY,
      color,
      "#fff"
    );
  }
}

function drawPerspective() {
  for (let z = level.length - 1; z >= 0; z--) {
    let pointZ = z * blockLength;
    for (let x = 0; x < level[level.length - z - 1].length; x++) {
      let pointX = x * blockWidth;
      let pointY = level[level.length - z - 1][x] * blockHeight;
      if (pointZ < cameraZ) {
        //continue;
      }

      if (level[level.length - z - 1][x] == 0) {
        continue;
      }

      let [vertices, faces] = getMeshFromBlock(pointX, pointY, pointZ);

      if (renderDebug) {
        drawDebug(vertices, z);
        continue;
      }
      drawMesh(vertices, faces);
      //if (z * blockLength - cameraZ > renderDistance * blockLength) {
      //  //continue;
      //}
    }
  }
  renderDrawCalls();
}

update();
