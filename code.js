const Container = document.getElementById('GameContainer');
let Grid = [];
let Structures = [];
for (let i = 0; i < 15; i++) {
    Grid[i] = [];
    for (let j = 0; j < 15; j++) {
        const block = document.createElement('div');
        Grid[i][j] = block;   
        block.dataset.row = i;
        block.dataset.col = j;
        Container.appendChild(block);
    }
}

const positions = [
    [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ],
    [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, 1]
    ],
    [
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0]
    ],
    [
        [-1, 0],
        [0, 0],
        [0, 1],
        [1, 0]
    ],
    [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [0, 1]
    ],
    [
        [0, -1],
        [0, 0],
        [-1, 0],
        [-1, 1]
    ],
    [
        [-1, 1],
        [-1, 0],
        [0, 0],
        [0, 1]
    ]

]

let draggedElement;
const Timer = document.getElementById('Timer');
let StartingTime = Date.now() + 10000;
Timer.textContent = 10;

setInterval(() => {
    Timer.textContent = Math.floor((StartingTime - Date.now()) / 1000);
    if (StartingTime >= Date.now()) {
        console.log('You run out off time');
    }
}, 950);

for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.9) {
            SummonBlocks(Grid, i, j, Math.floor(Math.random() * 7));
        }
    }
}

function SummonBlocks(array, i, j, type = 1) {
    let GroupElements = [];
    let RandomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];

    if (array.length === 15) {
        if (!CanBePlaced(j, i, true, type)) return;
    }
    

    for (let [x, y] of positions[type]) {
        targetX = x + j;
        targetY = y + i;

        if (targetX >= 0 && targetY >= 0 && targetX <= array.length - 1 && targetY <= array[0].length - 1) {
            let cell = array[targetX][targetY];
            cell.style.border = `5px solid rgb(${[...RandomColor]})`;
            if (array.length == 3) {
                cell.style.background = 'red';
            }
            cell.dataset.structureID = Structures.length;
            GroupElements.push(cell);
        }
    }

    Structures.push({
        cells: GroupElements,
        color: RandomColor,
        id: Structures.length
    });
}

let ghostCells = [];
Container.addEventListener('dragover', (e) => {
    e.preventDefault();

    const target = e.target;
    if(!target.dataset.row) return;

    const centerRow = parseInt(target.dataset.row);
    const centerCol = parseInt(target.dataset.col);

    ghostCells.forEach(c => c.classList.remove('ghost'));
    ghostCells = [];

    if (!CanBePlaced(centerRow, centerCol, false, draggedElement.type)) return;
    
    for (let [dy, dx] of positions[draggedElement.type]) {
        let targetRow = centerRow + dy;
        let targetCol = centerCol + dx;

        if (
            targetRow >= 0 && 
            targetRow < Grid.length &&
            targetCol >= 0 &&
            targetCol < Grid[0].length ) {
                let cell = Grid[targetRow][targetCol];
                cell.classList.add('ghost');
                ghostCells.push(cell);
            }
    }
});

Container.addEventListener('drop', (e) => {
    e.preventDefault();

    const target = e.target;
    if(!target.dataset.row) return;

    const centerRow = parseInt(target.dataset.row);
    const centerCol = parseInt(target.dataset.col);

    if (!CanBePlaced(centerRow, centerCol, false, draggedElement.type)) return;
    
    ghostCells.forEach(c => c.classList.remove('ghost'));
    ghostCells = [];

    for (let [dy, dx] of positions[draggedElement.type]) {
        let targetRow = centerRow + dy;
        let targetCol = centerCol + dx;

        if (
            targetRow >= 0 && 
            targetRow < Grid.length &&
            targetCol >= 0 &&
            targetCol < Grid[0].length ) {
                let cell = Grid[targetRow][targetCol];

                cell.classList.add('marked');
            }
    }
    
    RerollBlocks(draggedElement.gridIndex);
    CheckCompleted();
    checkFullRows();
    checkFullCols();
});

function checkFullRows() {
    for (let row = 0; row < 15; row++) {
        let full = true;

        for (let col = 0; col < 15; col++) {
            if (!Grid[row][col].classList.contains("marked")) {
                full = false;
                break;
            }
        }

        if (full) {
            for (let col = 0; col < 15; col++) {
                clearCell(Grid[row][col]);
            }
        }
    }
}

function checkFullCols() {
    for (let col = 0; col < 15; col++) {
        let full = true;

        for (let row = 0; row < 15; row++) {
            if (!Grid[row][col].classList.contains("marked")) {
                full = false;
                break;
            }
        }

        if (full) {
            for (let row = 0; row < 15; row++) {
                clearCell(Grid[row][col]);
            }
        }
    }
}

function CanBePlaced(centerRow, centerCol, AdditionalCheck = false, type) {
    for (let [dy, dx] of positions[type]) {
        let targetRow = centerRow + dy;
        let targetCol = centerCol + dx;

        if (
            targetRow >= 0 && 
            targetRow < Grid.length &&
            targetCol >= 0 &&
            targetCol < Grid[0].length ) {
                let cell = Grid[targetRow][targetCol];
                if (cell.classList.contains('marked')) return false;

                if (AdditionalCheck && cell.dataset.structureID !== undefined) return false;
                
            }
    }

    return true;
}

let PointsHTML = document.getElementById('Points');
let VPAI = document.getElementById('VisualPointsAddIndicator');
let Points = 0;

let VisualTimeAdd = document.getElementById('VisualTimeAdd');

function CheckCompleted() {
    Structures.forEach(e => {
        let allMarked = e.cells.every(cell => cell.classList.contains('marked'));

        if (allMarked && !e.completed) {
            e.completed = true;

            StartingTime += 5000;
            
            VisualTimeAdd.textContent = '+5 ↑';

            let AddedPoints = 0;
            e.cells.forEach(cell => {
                Points++;
                AddedPoints++;
                cell.style.border = '';
            });

            PointsHTML.textContent = Points;
            VPAI.textContent = `+${AddedPoints} ↑`;
            setTimeout(() => {
                VisualTimeAdd.textContent = '';
                VPAI.textContent = '';
            }, 1000);

            Structures = Structures.filter(s => s !== e);

            SpawnRandomStructure();
        }
    });
}

function clearCell(cell) {
    cell.classList.remove('marked');
    cell.removeAttribute('data-structure-id');
    cell.style.border = '';
    cell.style.background = '';
}

function SpawnRandomStructure() {
    let i = Math.floor(Math.random() * 15);
    let j = Math.floor(Math.random() * 15);
    SummonBlocks(Grid, i, j, Math.floor(Math.random() * 7));
}

const AvailableBlocks = document.querySelectorAll('#AvailableBlocks div'); 
let Grids = [];

AvailableBlocks.forEach((e) => {
    let B = [];

    for (let i = 0; i < 3; i++) {
        B[i] = [];
        for (let j = 0; j < 3; j++) {
            const block = document.createElement('div');
            B[i][j] = block;       
            e.appendChild(block); 
        }
    }

    Grids.push(B);
});

AvailableBlocks.forEach((e, i) => {
    e.type = Math.floor(Math.random() * 7);
    SummonBlocks(Grids[i], 1, 1, e.type);

    e.addEventListener('dragstart', (ev) => {

    draggedElement = {
        type: e.type,
        gridIndex: i
    };

    ev.dataTransfer.setData('text/plain', 'drag');
    });
});

function RerollBlocks(index) {
    let grid = Grids[index];

    grid.flat().forEach(clearCell);

    AvailableBlocks[index].type = Math.floor(Math.random() * 7);
    SummonBlocks(grid, 1, 1, AvailableBlocks[index].type);
}