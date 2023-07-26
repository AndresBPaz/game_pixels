// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:3000');
let zoomLevel = 1;
let x = 0;
let y = 0;
let dragging = false;
let lastMouseX;
let lastMouseY;


ws.onopen = () => {
  console.log('WebSocket connected');
  const message = JSON.stringify({ x: 0, y: 0, viewWidth: calculateViewWidth(), viewHeight: calculateViewHeight() });
  console.log(message);
  ws.send(message);
};

ws.onmessage = (event) => {
  const worldView = JSON.parse(event.data);
  console.log(worldView);
  renderWorldView(worldView.view);
};


function calculateViewWidth() {
  return Math.ceil(window.innerWidth / (20 * zoomLevel));
}

function calculateViewHeight() {
  return Math.ceil(window.innerHeight / (20 * zoomLevel));
}


canvas.addEventListener('mousedown', (event) => {
  dragging = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

canvas.addEventListener('mouseup', () => {
  dragging = false;
});

canvas.addEventListener('mousemove', (event) => {
  if (dragging) {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    const step = 10 * zoomLevel; // Ajustar el tamaño del paso según el nivel de zoom

    x -= deltaX * step;
    y -= deltaY * step;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    // Enviar un mensaje JSON al servidor WebSocket con las nuevas coordenadas y tamaño de vista
    const message = JSON.stringify({ x, y, viewWidth: 20 * zoomLevel, viewHeight: 20 * zoomLevel });
    ws.send(message);
  }
});


function renderWorldView(worldView) {
  const cellSize = 20 * zoomLevel;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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
        case 'water':
          ctx.fillStyle = 'blue';
          break;
        case 'sand':
          ctx.fillStyle = 'yellow';
          break;
        case 'grass':
          ctx.fillStyle = 'green';
          break;
        case 'mountain':
          ctx.fillStyle = 'gray';
          break;
        default:
          ctx.fillStyle = 'white';
          break;
      }

      ctx.fillRect((x * cellSize) + x, (y * cellSize) + y, cellSize, cellSize);

      // Dibujar entidades
      const entity = cell.entity;
      if (entity === 'palmTree') {
        // Dibujar una palmera (color marrón para el tronco y verde para las hojas)
        ctx.fillStyle = 'brown';
        ctx.fillRect(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.5, cellSize * 0.4, cellSize * 0.3);
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.3, cellSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell.entity === 'tree') {
        ctx.fillStyle = 'brown';
        ctx.fillRect(x * cellSize + 7, y * cellSize + 3, 6, 14);
        ctx.fillStyle = 'green';
        ctx.fillRect(x * cellSize + 4, y * cellSize, 12, 10);
      }
      else if (entity === 'crab') {
        // Dibujar un cangrejo (color rojo)
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.5, cellSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (entity === 'flower') {
        // Dibujar una flor (color rosa)
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.5, cellSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (entity === 'butterfly') {
        // Dibujar una mariposa (color amarillo)
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.3);
        ctx.lineTo(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.7);
        ctx.lineTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.5);
        ctx.lineTo(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.7);
        ctx.closePath();
        ctx.fill();
      } else if (entity === 'rock') {
        // Dibujar una roca (color gris)
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.5, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (entity === 'eagle') {
        // Dibujar un águila (color negro)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.3);
        ctx.lineTo(x * cellSize + cellSize * 0.3, y * cellSize + cellSize * 0.7);
        ctx.lineTo(x * cellSize + cellSize * 0.5, y * cellSize + cellSize * 0.5);
        ctx.lineTo(x * cellSize + cellSize * 0.7, y * cellSize + cellSize * 0.7);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

const zoomBar = document.getElementById('zoomBar');
zoomBar.addEventListener('input', () => {
  zoomLevel = parseFloat(zoomBar.value);
  const message = JSON.stringify({ x: offsetX, y: offsetY, viewWidth: calculateViewWidth(), viewHeight: calculateViewHeight() });
  ws.send(message);
});

// Evento para escuchar las teclas presionadas
document.addEventListener('keydown', (event) => {
  const step = 10 * zoomLevel; // Ajustar el tamaño del paso según el nivel de zoom
  switch (event.key) {
    case 'ArrowUp':
      y -= step; // Mover hacia arriba
      break;
    case 'ArrowDown':
      y += step; // Mover hacia abajo
      break;
    case 'ArrowLeft':
      x -= step; // Mover hacia la izquierda
      break;
    case 'ArrowRight':
      x += step; // Mover hacia la derecha
      break;
    default:
      break;
  }

  // Enviar un mensaje JSON al servidor WebSocket con las nuevas coordenadas y tamaño de vista
  const message = JSON.stringify({ x, y, viewWidth: 20 * zoomLevel, viewHeight: 20 * zoomLevel });
  ws.send(message);
});