// main.js
const sheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPkK4F4EDv7mZ2CuwSqa30VVZ_CWC6wuChV1ms9zLEbrwa5gi4cquzzE5GDSadlWKC1FETlt2osOxf/pub?output=csv";

const response = await fetch(sheets);
const csvText = await response.text();

const sanitizeName = (name) => {
  const accentsMap = new Map([ ['á', 'a'], ['à', 'a'], ['â', 'a'], ['ä', 'a'], ['ã', 'a'], ['å', 'a'], ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'], ['í', 'i'], ['ì', 'i'], ['î', 'i'], ['ï', 'i'], ['ó', 'o'], ['ò', 'o'], ['ô', 'o'], ['ö', 'o'], ['õ', 'o'], ['ø', 'o'], ['ú', 'u'], ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ý', 'y'], ['ÿ', 'y'], ['ñ', 'n'], ['ç', 'c'] ]);
  let sanitized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  sanitized = Array.from(sanitized).map(char => accentsMap.get(char) || char).join('');
  return sanitized.replace(/[^A-Za-z0-9_\-]/g, '_');
};


/**
 * Convertit une chaîne CSV en objet JSON en utilisant ES6
 * @param {string} csvString - La chaîne CSV à convertir
 * @returns {Array} - Tableau d'objets représentant les données CSV
 */
const csvToJson = (csvString) => {
  try {
    const lines = [];
    let currentLine = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
        currentLine += char;
      } else if (char === '\n' && !insideQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue);
      
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        value = value.replace(/\r/g, '');

        if (value.includes('\n')) {
          value = value.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion CSV en JSON:", error);
    return [];
  }
};




const data = csvToJson(csvText);
const $projets = document.querySelector(".grid")

data.forEach((item,i) => {
    const div = document.createElement("div");
    // ajoute une couleur de fond aléatoire à la div



    const img = document.createElement("img");
    img.src = `Couvertures/${item.titre}.jpg`;
    img.alt = item.titre;
    div.appendChild(img);



    $projets.appendChild(div)

    div.addEventListener("click", () => {
      // const header = document.querySelector("header");
      // header.classList.add("fixed");
  
      // const projets = document.querySelector(".projets");
      // projets.classList.add("fixed");
  
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      document.body.appendChild(overlay);
  
      const wrap = document.createElement("div");
      wrap.classList.add("wrap");
      overlay.appendChild(wrap);
  
      const fiche = document.createElement("div");
      fiche.classList.add("fiche");
      wrap.appendChild(fiche);
  
      const close = document.createElement("div");
      close.textContent = "×";
      close.classList.add("close");
      overlay.appendChild(close);
  
      // amélioration de la fermeture de la fiche
      overlay.addEventListener("click", (e) => {
        if (e.target === fiche || fiche.contains(e.target)) return;
        gsap.to(overlay, {opacity: 0, duration: 0.2, onComplete: () => overlay.remove()});
        header.classList.remove("fixed");
        projets.classList.remove("fixed");
      });
  
      const img = document.createElement("img");
      img.src = `img/${sanitizeName(item.titre)}.png`;
      fiche.appendChild(img);
  
      const titre = document.createElement("h1");
      titre.textContent = item.titre;
      fiche.appendChild(titre);
  
      const desc = document.createElement("div");
      desc.innerHTML = item.modale;
      fiche.appendChild(desc);
  
      if(item.images !== "") {
        const images = item.images.split(",");
        const gallery = document.createElement("div");
        gallery.classList.add("gallery");
        images.forEach((image) => {
          const img = document.createElement("img");
          const name = sanitizeName(item.titre);
          img.src = `${name}/${image}`;
          gallery.appendChild(img);
        });
        fiche.appendChild(gallery);
      }
    
  
      // gsap.from(fiche, {opacity: 0, duration: 0.4});
      // gsap.from(overlay, {opacity: 0, duration: 0.4});
    });


});



gsap.registerPlugin(Flip);
const grid = document.querySelector('.grid');



const flip = () => {

    // Flip Plugin 
    const state = Flip.getState('.grid, .grid>div, .grid p');


    let gap = 1;
    // create random grid like "25vw 25vw 30vw 20vw" with 4 columns sum of vw should be 100
    let randomColumns = Array.from({ length: 4 }, () => Math.floor(Math.random() * 20 + 1) * 5);
    let sumColumns = randomColumns.reduce((a, b) => a + b, 0);
    randomColumns = randomColumns.map(
 value => `minmax(20vw, calc(${(value / sumColumns) * 100}vw))`
 ).join(" ");

    let randomRows = Array.from({ length: 3 }, () => Math.floor(Math.random() * 20 + 1) * 5);
    let sumRows = randomRows.reduce((a, b) => a + b, 0);
    randomRows = randomRows.map(
    value => `minmax(20vh, calc(${(value / sumRows) * 100}vh))`
    ).join(" ");

    grid.style.gridTemplateColumns = randomColumns;
    grid.style.gridTemplateRows = randomRows;
    grid.style.gap = `${gap}px`;


    Flip.from(state, {
        absolute: true, // uses position: absolute during the flip to work around flexbox challenges
        duration: 0.3, 
        ease: "power4.inOut"
        // you can use any other tweening properties here too, like onComplete, onUpdate, delay, etc. 
    });


}

const tl = gsap.timeline({repeat: -1});
tl.to({},{duration:0.7, onComplete:e => flip()});

