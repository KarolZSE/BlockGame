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
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.9) {
            SummonBlocks(Grid, i, j);
        }
    }
}

function SummonBlocks(array, i, j) {
    let GroupElements = [];
    let RandomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];

    if (array.length === 15) {
        if (!CanBePlaced(j, i, true)) return;
    }
    

    for (let [x, y] of positions) {
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

Container.addEventListener('dragover', (e) => {
    e.preventDefault();
});

Container.addEventListener('drop', (e) => {
    e.preventDefault();

    const target = e.target;
    if(!target.dataset.row) return;

    const centerRow = parseInt(target.dataset.row);
    const centerCol = parseInt(target.dataset.col);

    if (!CanBePlaced(centerRow, centerCol)) return;
    
    for (let [dy, dx] of positions) {
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

function CanBePlaced(centerRow, centerCol, AdditionalCheck = false) {
    for (let [dy, dx] of positions) {
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

function CheckCompleted() {
    Structures.forEach(e => {
        let allMarked = e.cells.every(cell => cell.classList.contains('marked'));

        if (allMarked && !e.completed) {
            e.completed = true;

            RemoveStructures(e);

            Structures = Structures.filter(s => s !== e);

            SpawnRandomStructure();
        }
    });
}

function RemoveStructures(e) {
    e.cells.forEach(cell => {
        clearCell(cell);
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
    SummonBlocks(Grid, i, j);
}

const Blocks = document.getElementById('A1');
let B = [];
for (let i = 0; i < 3; i++) {
    B[i] = [];
    for (let j = 0; j < 3; j++) {
        const block = document.createElement('div');
        B[i][j] = block;       
        Blocks.appendChild(block);
    }
}
SummonBlocks(B, 1, 1);

Blocks.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('positions', JSON.stringify(positions));
});