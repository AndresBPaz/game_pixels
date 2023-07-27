// terrain.js
function generateTerrain(x, y) {
    // Implementación simple: Generar terreno aleatorio basado en coordenadas x e y
    // Puedes personalizar esta función para generar terrenos más complejos
    // según tus necesidades.
  
    const noiseValue = Math.random(); // Valor de ruido aleatorio entre 0 y 1
  
    if (noiseValue < 0.2) {
      return "water"; // Agua (20% de probabilidad)
    } else if (noiseValue < 0.4) {
      return "sand"; // Arena (20% de probabilidad)
    } else if (noiseValue < 0.7) {
      return "grass"; // Hierba (30% de probabilidad)
    } else {
      return "mountain"; // Montaña (30% de probabilidad)
    }
  }
  
  function generateEntity(terrain) {
    // Asignar entidades según el tipo de terreno
    // Puedes personalizar esta función para generar entidades más complejas
    // según el tipo de terreno.
  
    switch (terrain) {
      case "water":
        // Puedes asignar un pez o un pato, por ejemplo.
        return "fish";
      case "sand":
        // Puedes asignar una concha o un cangrejo, por ejemplo.
        return "crab";
      case "grass":
        // Puedes asignar un árbol o una flor, por ejemplo.
        return "tree";
      case "mountain":
        // Puedes asignar una roca o un águila, por ejemplo.
        return "rock";
      default:
        return null; // Sin entidad para otros tipos de terreno
    }
  }
  