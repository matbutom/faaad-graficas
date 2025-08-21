export const handler = ({ inputs, mechanic, sketch }) => {
  const { imagenInput, ancho, altura } = inputs;

  // importar modulo de biblioteca colores
  const { colores } = require("@disenoudp/faaad-colores");

  let img;
  let imgGraphic;

  const cargarImagen = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
  };

  const escalarImagenFondo = () => {
    // dibuja la imagen centrada si existe
    if (img) {
      const imgW = img.width;
      const imgH = img.height;
      const centerX = (sketch.width - imgW) / 2;
      const centerY = (sketch.height - imgH) / 2;

      // hay 4 casos
      // anchoImagen mayor que anchoLienzo
      // altoImagen mayor que altoLienzo
      if (imgW > sketch.width && imgH > sketch.height) {
        sketch.image(img, -imgW / 2, -imgH / 2, imgW, imgH);
      }
      // anchoImagen mayor que anchoLienzo
      else if (imgW > sketch.width) {
        sketch.image(
          img,
          -imgW / 2,
          0,
          (imgW * sketch.height) / imgH,
          sketch.height
        );
        // alturaImagen mayor que alturaLienzo
      } else if (imgH > sketch.height) {
        sketch.image(
          img,
          0,
          -imgH / 2,
          sketch.width,
          (imgH * sketch.width) / imgW
        );
      } else {
        // imagen cabe en el lienzo
        // calculamos las proporciones entre anchoImagen y anchoLienzo
        // y tambien entre alturaImagen y alturaLienzo
        // la proporcion define en que sentido estiramos la imagen
        const wRatio = imgW / sketch.width;
        const hRatio = imgH / sketch.height;
        if (wRatio > hRatio) {
          sketch.image(
            img,
            -imgW / 2,
            0,
            (imgW * sketch.height) / imgH,
            sketch.height
          );
        } else {
          sketch.image(
            img,
            0,
            -imgH / 2,
            sketch.width,
            (imgH * sketch.width) / imgW
          );
        }
      }
    }
  };

  // carga la imagen antes de setup si existe
  sketch.preload = () => {
    if (imagenInput) {
      img = sketch.loadImage(URL.createObjectURL(imagenInput));
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(ancho, altura);
    if (img) {
      cargarImagen();
    }
  };

  sketch.draw = () => {
    sketch.background(colores.udpCrema);
    sketch.noStroke();
    sketch.fill(colores.udpNegro);

    escalarImagenFondo();

    sketch.noStroke();
    // usa el rojo de faaad-colores
    sketch.fill(colores.faadOscuroRojo); 
    // barra superior
    sketch.rect(0, 0, inputs.ancho, 55); 

    if (inputs.mostrarGrilla) {
      sketch.stroke(200);
      sketch.strokeWeight(2);

      const margen = 62;
      const cols = 20;
      const rows = 60;
      const gridWidth = inputs.ancho - margen * 2;
      const gridHeight = inputs.altura - margen * 2;

      // Líneas verticales (cruzan todo el canvas)
      for (let i = 0; i <= cols; i++) {
        let x = margen + (gridWidth / cols) * i;
        sketch.line(x, 0, x, inputs.altura);
      }
      // Líneas horizontales (cruzan todo el canvas)
      for (let j = 0; j <= rows; j++) {
        let y = margen + (gridHeight / rows) * j;
        sketch.line(0, y, inputs.ancho, y);
      }

      // resalta el margen de la grilla
      sketch.stroke("#393939ff");
      sketch.strokeWeight(4);
      sketch.noFill();
      sketch.rect(margen, margen, gridWidth, gridHeight);

      sketch.noStroke();
    }

    // configura el tamaño y estilo del texto
    sketch.textSize(210);
    sketch.textStyle(sketch.BOLD);
    sketch.textFont("Helvetica");
    sketch.textAlign(sketch.LEFT, sketch.TOP);

    sketch.fill(colores.udpNegro);
    const margen = 62;
    sketch.text(inputs.Titulo, margen + 10, margen + 26);

    // dibuja el texto "Escuela" rotado 90 grados en el margen derecho superior de la grilla
    sketch.push();
    sketch.textSize(48);
    sketch.textStyle(sketch.NORMAL);
    sketch.textFont("Helvetica");
    sketch.textAlign(sketch.LEFT, sketch.TOP);
    sketch.fill(colores.udpNegro);

    const gridWidth = inputs.ancho - margen * 2;
    const x = margen + gridWidth;
    const y = margen + 35;

    sketch.translate(x, y);
    sketch.rotate(Math.PI / 2);
    sketch.text(inputs.Escuela, 0, 0);
    sketch.pop();

    // dibuja el texto "InfoExtra" dentro del margen inferior izquierdo de la grilla
    sketch.textSize(40);
    sketch.textStyle(sketch.NORMAL);
    sketch.textFont("Helvetica");
    sketch.textAlign(sketch.LEFT, sketch.TOP);
    sketch.fill(colores.udpNegro);

    const gridHeight = inputs.altura - margen * 2;
    const infoX = margen;
    // 40 es el tamaño del texto
    const infoY = margen + gridHeight - 40; 

    mechanic.done();
  };
};

export const inputs = {
  ancho: {
    type: "number",
    default: 1080,
  },
  altura: {
    type: "number",
    default: 1350,
  },
  Titulo: {
    type: "text",
    default: "Título",
  },
  mostrarGrilla: {
    type: "boolean",
    default: false,
    label: "Mostrar grilla",
  },
  imagenInput: {
    type: "image",
    label: "imagen",
    description: "Arrastra una imagen aquí",
  },
};

export const presets = {
  post: {
    width: 1080,
    height: 1350,
  },
  story: {
    width: 1080,
    height: 1920,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  colores: require("@disenoudp/faaad-colores"),
  hideScaleToFit: true,
};
