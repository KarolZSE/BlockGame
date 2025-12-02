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
    for (let [x, y] of positions) {
        targetX = x + j;
        targetY = y + i;

        if (targetX >= 0 && targetY >= 0 && targetX <= array.length - 1 && targetY <= array[0].length - 1) {
            let cell = array[targetX][targetY];
            cell.style.background = `rgb(${[...RandomColor]})`;
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

    for (let [dy, dx] of positions) {
        let targetRow = centerRow + dy;
        let targetCol = centerCol + dx;

        if (
            targetRow >= 0 && 
            targetRow < Grid.length &&
            targetCol >= 0 &&
            targetCol < Grid[0].length ) {
                let cell = Grid[targetRow][targetCol];

            if (cell.style.background && cell.style.background !== 'rgb(255, 255, 255)') {
                cell.classList.add('marked');
            }
        }
    }
    
    CheckCompleted();
});

function CheckCompleted() {
    Structures.forEach(e => {
        let allMarked = e.cells.every(cell => cell.classList.contains('marked'));

        if (allMarked && !e.completed) {
            e.completed = true;

            e.cells.forEach(cell => {
                cell.classList.remove('marked');
                cell.classList.add('completed');
            })
        }
    });
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