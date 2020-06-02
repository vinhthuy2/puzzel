const gridSize = [3, 4];
let holeIndex = 11;
const neigbourTiles = [];
const panelElement = document.querySelector('#panel');

const percentageX = 100 / (gridSize[0] - 1)
const percentageY = 100 / (gridSize[1] - 1)

function addPieces(){
    for (let index = 0; index < gridSize[0]*gridSize[1]; index++) {
        const li = document.createElement('li');
        li.id = index;
        if (gridSize[0]*gridSize[1] - 1 !== index) {
            const xPos = percentageX * (index % gridSize[0]);
            const yPos = percentageY * (Math.floor(index/gridSize[0]));
            li.style.backgroundImage = 'url("penguins_300x400.jpg")';
            li.style.backgroundPosition = `${xPos}% ${yPos}%`;
        }
        panelElement.appendChild(li);
    }
}

function suffeTiles(){
    for (let i = panelElement.children.length - 1; i >= 0; i--) {
        panelElement.appendChild(panelElement.children[Math.random() * i | 0]);
    }
    panelElement.children[panelElement.children.length-1].className = 'hole';
}

function findNeigbourTilesIndex(index) {
  return {
    left: index - 1,
    right: index + 1,
    up: index - gridSize[0],
    down: index + gridSize[0]
  };
}

function validateNeigbourIndex(nextIndex, curIdx) {
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
  if (validateNeigbourIndex(targetIndex, holeIndex)) {
    swapElements(holeIndex, targetIndex);
    holeIndex = targetIndex;
  }
});

addPieces()
suffeTiles()