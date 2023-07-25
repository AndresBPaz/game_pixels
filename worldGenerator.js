// worldGenerator.js

class WorldGenerator {
  constructor() {
    // Puedes agregar aquí cualquier configuración o parámetros adicionales que necesites
  }

  generateWorldView(x, y, viewWidth, viewHeight) {
    const world = this.generateWorld(x, y, viewWidth, viewHeight);
    return { x, y, view: world };
  }

  generateWorld(x, y, width, height) {
    const world = [];

    for (let i = 0; i < height; i++) {
      world.push([]);
      for (let j = 0; j < width; j++) {
        const terrain = this.generateTerrain(x + j, y + i);
       // const entity = this.generateEntity(terrain); // Pasa el terreno actual como parámetro para generar la entidad
       const entity = this.generateEntity(terrain); // Evitar que se genere un árbol si el terreno es "water"

        world[i].push({ terrain, entity });
      }
    }

    return world;
  }

  generateEntity(terrain) {
    // Generar entidades basadas en el tipo de terreno actual
    if (terrain === 'water') {
      return null; // No generar entidad sobre agua
    } else if (terrain === 'sand') {
      if (Math.random() < 0.1) {
        return 'palmTree'; // Generar palmera con una probabilidad del 10% en terreno de arena
      } else if (Math.random() < 0.05) {
        return 'crab'; // Generar cangrejo con una probabilidad del 5% en terreno de arena
      }
    } else if (terrain === 'grass') {
      if (Math.random() < 0.2) {
        return 'flower'; // Generar flor con una probabilidad del 20% en terreno de césped
      } else if (Math.random() < 0.1) {
        return 'butterfly'; // Generar mariposa con una probabilidad del 10% en terreno de césped
      }
    } else if (terrain === 'mountain') {
      if (Math.random() < 0.05) {
        return 'rock'; // Generar roca con una probabilidad del 5% en terreno de montaña
      } else if (Math.random() < 0.03) {
        return 'eagle'; // Generar águila con una probabilidad del 3% en terreno de montaña
      }
    }


    // Si no se cumple ninguna condición, no generar entidad en otros terrenos
    //return Math.random() < 0.2 ? 'tree' : null;
    return null;
  }

  generateTerrain(x, y) {
    const elevation = Math.sin(x / 10) * 5 + Math.cos(y / 10) * 5;

    if (elevation < -2) {
      return 'water';
    } else if (elevation < 0) {
      return 'sand';
    } else if (elevation < 5) {
      return 'grass';
    } else {
      return 'mountain';
    }
  }
 
}

module.exports = WorldGenerator;
