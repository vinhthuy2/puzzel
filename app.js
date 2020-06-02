const gridSize = [3, 4];
let holeIndex = 11;
const neigbourTiles = [];
const panelElement = document.querySelector('#panel');

const percentageX = 100 / (gridSize[0] - 1);
const percentageY = 100 / (gridSize[1] - 1);

function addPieces() {
  for (let index = 0; index < gridSize[0] * gridSize[1]; index++) {
    const li = document.createElement('li');
    li.id = index;
    if (gridSize[0] * gridSize[1] - 1 !== index) {
      const xPos = percentageX * (index % gridSize[0]);
      const yPos = percentageY * Math.floor(index / gridSize[0]);
      li.style.backgroundImage = 'url("penguins_300x400.jpg")';
      li.style.backgroundPosition = `${xPos}% ${yPos}%`;
    }
    li.classList.add('tile');
    panelElement.appendChild(li);
  }
}

function suffeTiles() {
  for (let i = panelElement.children.length - 1; i >= 0; i--) {
    const element = panelElement.children[(Math.random() * i) | 0];
    element.id = panelElement.children.length - 1 - i;
    panelElement.appendChild(element);
  }
  panelElement.children[panelElement.children.length - 1].classList.add('hole');
}

function findNeigbourTilesIndex(index) {
  const valIdx = parseInt(index);
  return {
    left: valIdx - 1,
    right: valIdx + 1,
    up: valIdx - gridSize[0],
    down: valIdx + gridSize[0]
  };
}

function validateSwap(nextIndex, curIdx) {
  if (
    nextIndex >= gridSize[0] * gridSize[1] ||
    nextIndex < 0 ||
    (curIdx % gridSize[0] === 0 && nextIndex + 1 === curIdx) ||
    (nextIndex % gridSize[0] === 0 && curIdx + 1 === nextIndex)
  ) {
    return false;
  }
  return true;
}

function swapElements(idx1, idx2) {
  const obj1 = panelElement.children[idx1];
  const obj2 = panelElement.children[idx2];
  const temp = obj2.id;
  obj2.id = obj1.id;
  obj1.id = temp;
  // save the location of obj2
  let parent2 = obj2.parentNode;
  let next2 = obj2.nextSibling;
  // special case for obj1 is the next sibling of obj2
  if (next2 === obj1) {
    // just put obj1 before obj2
    parent2.insertBefore(obj1, obj2);
  } else {
    // insert obj2 right before obj1
    obj1.parentNode.insertBefore(obj2, obj1);

    // now insert obj1 where obj2 was
    if (next2) {
      // if there was an element after obj2, then insert obj1 right before that
      parent2.insertBefore(obj1, next2);
    } else {
      // otherwise, just append as last child
      parent2.appendChild(obj1);
    }
  }
}

function tileClickHandler(ev) {
  debugger
  const targetId = ev.target.id;
  const neigbourIndexObj = findNeigbourTilesIndex(holeIndex);
  const isNeigbour = !!Object.values(neigbourIndexObj).filter(v=> v == targetId).length;
  console.log(neigbourIndexObj, targetId);
  
  if (isNeigbour) {
    if (validateSwap(targetId, holeIndex)) {
      swapElements(holeIndex, targetId);
      holeIndex = targetId;
    } 
  }
}

function tileClickEventBinding(){
  document.querySelectorAll(".tile").forEach(li=>{
    if (li.id !== holeIndex) {
      li.addEventListener('click', tileClickHandler)
    }
  })
}

document.addEventListener('keydown', (ev) => {
  console.log(ev.key);
  console.log(holeIndex);
  debugger;
  const holeNeigbour = findNeigbourTilesIndex(holeIndex);
  let targetIndex;
  switch (ev.keyCode) {
    case 38: // up
      targetIndex = holeNeigbour.down;
      break;
    case 37: // left
      targetIndex = holeNeigbour.right;
      break;
    case 39: // right
      targetIndex = holeNeigbour.left;
      break;
    case 40: // down
      targetIndex = holeNeigbour.up;
      break;
    default:
      return;
  }
  if (validateSwap(targetIndex, holeIndex)) {
    swapElements(holeIndex, targetIndex);
    holeIndex = targetIndex;
  }
});

addPieces();
suffeTiles();
tileClickEventBinding();