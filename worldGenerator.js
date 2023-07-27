const fs = require('fs');

const worldFilePath = './world.json';

class WorldGenerator {
  constructor() {
    // Puedes agregar aquí cualquier configuración o parámetros adicionales que necesites
  }

  generateWorldView(viewX, viewY, viewWidth, viewHeight) {
    if (fs.existsSync(worldFilePath)) {
      const world = this.loadWorldFromJson();
      return this.calculateView(viewX, viewY, viewWidth, viewHeight, world);
    } else {
      const world = this.generateWorld(viewX, viewY, viewWidth, viewHeight);
      this.saveWorldToJson(world);
      return { x: viewX, y: viewY, view: world };
    }
  }
   
  calculateView(viewX, viewY, viewWidth, viewHeight, world) {
    const view = [];
  
    for (let i = viewY; i < viewY + viewHeight; i++) {
      if (i >= 0 && i < world.length) {
        view.push(world[i].slice(viewX, viewX + viewWidth));
      } else {
        // Si las coordenadas de la vista están fuera del mundo, rellenamos con terrenos vacíos
        const emptyRow = Array(viewWidth).fill({ terrain: "empty", entity: null });
        view.push(emptyRow);
      }
    }
  
    return { x: viewX, y: viewY, view: view };
  }
  
  loadWorldFromJson() {
    const worldJson = fs.readFileSync(worldFilePath, 'utf8');
    return JSON.parse(worldJson);
  }
  
  saveWorldToJson(world) {
    const worldJson = JSON.stringify(world);
    fs.writeFileSync(worldFilePath, worldJson, 'utf8');
  }

  generateWorld(x, y, width, height) {
    const world = [];

    for (let i = 0; i < height; i++) {
      world.push([]);
      for (let j = 0; j < width; j++) {
        const terrain = this.generateTerrain(x + j, y + i);
        const entity = this.generateEntity(terrain); // Pasa el terreno actual como parámetro para generar la entidad
        world[i].push({ terrain, entity });
      }
    }

    return world;
  }

  generateEntity(terrain) {
    // Generar entidades basadas en el tipo de terreno actual
    if (terrain === "water") {
      return null; // No generar entidad sobre agua
    } else if (terrain === "sand") {
      if (Math.random() < 0.1) {
        return "palmTree"; // Generar palmera con una probabilidad del 10% en terreno de arena
      } else if (Math.random() < 0.05) {
        return "crab"; // Generar cangrejo con una probabilidad del 5% en terreno de arena
      }
    } else if (terrain === "grass") {
      if (Math.random() < 0.2) {
        return "flower"; // Generar flor con una probabilidad del 20% en terreno de césped
      } else if (Math.random() < 0.1) {
        return "butterfly"; // Generar mariposa con una probabilidad del 10% en terreno de césped
      }
    } else if (terrain === "mountain") {
      if (Math.random() < 0.05) {
        return "rock"; // Generar roca con una probabilidad del 5% en terreno de montaña
      } else if (Math.random() < 0.03) {
        return "eagle"; // Generar águila con una probabilidad del 3% en terreno de montaña
      }
    }

    // Si no se cumple ninguna condición, no generar entidad en otros terrenos 
    return null;
  }

  generateTerrain(x, y) {
    const elevation = Math.sin(x / 10) * 5 + Math.cos(y / 10) * 5;

    if (elevation < -2) {
      return "water";
    } else if (elevation < 0) {
      return "sand";
    } else if (elevation < 5) {
      return "grass";
    } else {
      return "mountain";
    }
  }
}

module.exports = WorldGenerator;
