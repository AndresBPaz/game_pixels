const canvas = document.getElementById("gameCanvas");
const zoomBar = document.getElementById("zoomBar"); // Agregar botones de zoom
const zoomInButton = document.getElementById("zoomInBtn");
const zoomOutButton = document.getElementById("zoomOutBtn");
const labelposx = document.getElementById("x");
const labelposy = document.getElementById("y");
const valuewh = document.getElementById("valuewh");

const ctx = canvas.getContext("2d");
const ws = new WebSocket("ws://localhost:3000");

let zoomLevel = 1;
let x = 0;
let y = 0;

let tamanio_width = window.innerWidth * 2;
let tamanio_height = window.innerHeight * 2;

const worldView = [];
let viewWidth = calculateViewWidth();
let viewHeight = calculateViewHeight();

ws.onopen = () => {
  console.log("WebSocket connected");
  generateWorld(x, y, viewWidth, viewHeight);
  const message = JSON.stringify({
    x: 0,
    y: 0,
    viewWidth: viewWidth,
    viewHeight: viewHeight,
  });
  console.log(message);
  ws.send(message);
};

ws.onmessage = (event) => {
  const worldViewData = JSON.parse(event.data);
  console.log(worldViewData);
  renderWorldView(worldViewData.view);
};

function calculateViewWidth() {
  return Math.ceil(tamanio_width / (20 * zoomLevel));
}

function calculateViewHeight() {
  return Math.ceil(tamanio_height / (20 * zoomLevel));
}

function generateWorld(x, y, width, height) {
  for (let i = 0; i < height; i++) {
    worldView.push([]);
    for (let j = 0; j < width; j++) {
      const terrain = generateTerrain(x + j, y + i);
      const entity = generateEntity(terrain);
      worldView[i].push({ terrain, entity });
    }
  }
}

function renderWorldView(worldView) {
  const cellSize = 20 * zoomLevel;

  canvas.width = tamanio_width;
  canvas.height = tamanio_height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const worldWidth = worldView[0].length * cellSize;
  const worldHeight = worldView.length * cellSize;

  // Asegurar que las coordenadas x e y estén dentro de los límites del mundo
  x = Math.max(Math.min(x, worldWidth - canvas.width), 0);
  y = Math.max(Math.min(y, worldHeight - canvas.height), 0);

  for (let y = 0; y < worldView.length; y++) {
    for (let x = 0; x < worldView[y].length; x++) {
      const cell = worldView[y][x];
      const terrain = cell.terrain;

      switch (terrain) {
        case "water":
          ctx.fillStyle = "blue";
          break;
        case "sand":
          ctx.fillStyle = "yellow";
          break;
        case "grass":
          ctx.fillStyle = "green";
          break;
        case "mountain":
          ctx.fillStyle = "gray";
          break;
        default:
          ctx.fillStyle = "white";
          break;
      }

      ctx.fillRect(x * cellSize + x, y * cellSize + y, cellSize, cellSize);

      // Dibujar entidades
      const entity = cell.entity;
      if (entity === "palmTree") {
        ctx.fillStyle = "brown";
        ctx.fillRect(
          x * cellSize + cellSize * 0.3,
          y * cellSize + cellSize * 0.5,
          cellSize * 0.4,
          cellSize * 0.3
        );
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.3,
          cellSize * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (cell.entity === "tree") {
        ctx.fillStyle = "brown";
        ctx.fillRect(x * cellSize + 7, y * cellSize + 3, 6, 14);
        ctx.fillStyle = "green";
        ctx.fillRect(x * cellSize + 4, y * cellSize, 12, 10);
      } else if (entity === "crab") {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.5,
          cellSize * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (entity === "flower") {
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.arc(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.5,
          cellSize * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (entity === "butterfly") {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.3
        );
        ctx.lineTo(
          x * cellSize + cellSize * 0.3,
          y * cellSize + cellSize * 0.7
        );
        ctx.lineTo(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.5
        );
        ctx.lineTo(
          x * cellSize + cellSize * 0.7,
          y * cellSize + cellSize * 0.7
        );
        ctx.closePath();
        ctx.fill();
      } else if (entity === "rock") {
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.5,
          cellSize * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (entity === "eagle") {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.3
        );
        ctx.lineTo(
          x * cellSize + cellSize * 0.3,
          y * cellSize + cellSize * 0.7
        );
        ctx.lineTo(
          x * cellSize + cellSize * 0.5,
          y * cellSize + cellSize * 0.5
        );
        ctx.lineTo(
          x * cellSize + cellSize * 0.7,
          y * cellSize + cellSize * 0.7
        );
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

zoomBar.addEventListener("input", () => {
  zoomLevel = parseFloat(zoomBar.value);
  viewWidth = calculateViewWidth();
  viewHeight = calculateViewHeight();

  const valuewh = document.getElementById("valuewh");
  valuewh.textContent = "zoomLevel: " + zoomLevel;

  const message = JSON.stringify({ x, y, viewWidth, viewHeight });
  ws.send(message);
});

// Evento para escuchar las teclas presionadas
document.addEventListener("keydown", (event) => {
  const step = 10 * zoomLevel; // Ajustar el tamaño del paso según el nivel de zoom
  let newX = x;
  let newY = y;

  switch (event.key) {
    case "ArrowUp":
      newY = Math.max(newY - step, 0); // No mover hacia arriba si ya se alcanzó el borde superior
      break;
    case "ArrowDown":
      // Calcular el límite inferior del mundo (altura del mundo - altura de la vista)
      const worldHeight = worldView.length * (20 * zoomLevel);
      const viewBottom = newY + tamanio_height;
      newY = Math.min(newY + step, worldHeight - tamanio_height); // No mover hacia abajo si ya se alcanzó el borde inferior
      break;
    case "ArrowLeft":
      newX = Math.max(newX - step, 0); // No mover hacia la izquierda si ya se alcanzó el borde izquierdo
      break;
    case "ArrowRight":
      // Calcular el límite derecho del mundo (ancho del mundo - ancho de la vista)
      const worldWidth = worldView[0].length * (20 * zoomLevel);
      const viewRight = newX + tamanio_width;
      newX = Math.min(newX + step, worldWidth - tamanio_width); // No mover hacia la derecha si ya se alcanzó el borde derecho
      break;
    default:
      break;
  }

  // Actualizar las coordenadas de visualización solo si no se ha alcanzado ningún borde
  x = newX;
  y = newY;

  
  labelposx.textContent = "X: " + x;
  labelposy.textContent = "y: " + y;

  // Actualizar el valor de zoomlevel en el label con id valuewh 
  valuewh.textContent = "zoomLevel: " + zoomLevel;

  // Solicitar una nueva vista al servidor con las nuevas coordenadas
  const viewWidth = calculateViewWidth();
  const viewHeight = calculateViewHeight();
  const message = JSON.stringify({ x, y, viewWidth, viewHeight });
  ws.send(message);
});



// Evento de clic para acercar el zoom
zoomInButton.addEventListener("click", () => {
  if (zoomLevel < 10) {
    zoomLevel += 1;
    updateZoom();
  }
});

// Evento de clic para alejar el zoom
zoomOutButton.addEventListener("click", () => {
  if (zoomLevel > 1) {
    zoomLevel -= 1;
    updateZoom();
  }
});

// Función para actualizar el nivel de zoom y solicitar una nueva vista al servidor
function updateZoom() {
  // Actualizar el valor de zoomlevel en el label con id valuewh
  valuewh.textContent = "zoomLevel: " + zoomLevel;

  zoomBar.value = zoomLevel;

  // Actualizar el ancho y alto de la vista según el nuevo nivel de zoom
  viewWidth = calculateViewWidth();
  viewHeight = calculateViewHeight();

  // Solicitar una nueva vista al servidor con las coordenadas actuales y el nuevo nivel de zoom
  const message = JSON.stringify({ x, y, viewWidth, viewHeight });
  ws.send(message);
}
