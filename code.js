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
const Enemy = document.getElementById('Enemy');
let EnemyState = 0;
setInterval(() => {
    Timer.textContent = Math.floor((StartingTime - Date.now()) / 1000);
    if (Math.floor((StartingTime - Date.now()) / 1000) <= 0) {
        console.log('You run out off time');
        UpdateEnemiesHealth();
    }
}, 950);

setInterval(() => {
    EnemyState++;    
    Enemy.style.backgroundPosition = `-${200 * EnemyState}px 0`;
    if (EnemyState >= 3) {
        EnemyState = 0;
    } 
}, 400);

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
            DisplayMotivationalScreens();
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
            DisplayMotivationalScreens();
            for (let row = 0; row < 15; row++) {
                clearCell(Grid[row][col]);
            }
        }
    }
}

let MotivationalMultiplayer = 0;
let MotivationScreen = document.getElementById('MotivationScreen');
let MST = document.getElementById('MotivationScreenText');

function DisplayMotivationalScreens() {
    MotivationScreen.style.display = 'inline';

    if (MotivationalMultiplayer === 0) {
        MST.textContent = 'Good!';
        MotivationalMultiplayer++;
    } else if (MotivationalMultiplayer === 1) {
        MST.textContent = 'Great!';
        MotivationalMultiplayer++;
    } else if (MotivationalMultiplayer === 2) {
        MST.textContent = 'Fantastic!';
        MotivationalMultiplayer++;
    } else {
        MotivationalMultiplayer++;
        MST.textContent = `Fantastic! x${MotivationalMultiplayer}!`;
    }

    let size = 10;
    MST.style.fontSize = size + 'px';

    while (
        MST.scrollWidth <= MotivationScreen.clientWidth &&
        MST.scrollHeight <= MotivationScreen.clientHeight
    ) {
        size++;
        MST.style.fontSize = size + 'px';
    }

    MST.style.fontSize = (size - 1) + 'px';

    setTimeout(() => {
        MotivationScreen.style.display = 'none';
    }, 1000);
}

DisplayMotivationalScreens();

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

const EnemyHealtMaxHTML = document.getElementById('EnemyHealtMax');
const EnemyHealtHTML = document.getElementById('EnemyHealtValue');
let EnemyHealtMax = 100;
let EnemyHealt = EnemyHealtMax;
function UpdateEnemiesHealth() {
    EnemyHealt -= Points;
    Points = 0;

    EnemyHealtMaxHTML.textContent = EnemyHealtMax;
    EnemyHealtHTML.textContent = EnemyHealt;
}
UpdateEnemiesHealth();

Container.style.display = 'none';

const PDS = document.getElementById('PlayerDefenseScreen');
const Player = document.getElementById('Player');

const PlayerHealthHTML = document.getElementById('PlayerHealth');
const phmHTML = document.getElementById('PlayerHealthMax');
let phm = 100;
let PlayerHealth = phm;

phmHTML.textContent = phm;

PDS.addEventListener('mousemove', (e) => {
    const Rect = PDS.getBoundingClientRect();
    if (e.clientX <= Rect.left) return;
    if (e.clientX >= Rect.left + Rect.width) return;
    if (e.clientY <= Rect.top) return;
    if (e.clientY >= Rect.top + Rect.height) return;
    Player.style.left = e.clientX - Rect.left - 16 + 'px';
    Player.style.top = e.clientY - Rect.top - 16 + 'px';
});

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    
    return !(
        ((aRect.top + aRect.height) <= (bRect.top)) ||
        (aRect.top >= (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) <= bRect.left) ||
        (aRect.left >= (bRect.left + bRect.width))
    );
}

function MoveObstaclesAround() {
    const Obs = document.createElement('div');
    const First = document.createElement('div');
    const Second = document.createElement('div');

    const TransitionTime = 1.5 + Math.random() * 3.5;
    Obs.style.transition = `all ${TransitionTime}s linear`;

    First.classList.add('ObstaclesWalls');
    let FirstWallHeight = Math.floor(Math.random() * 440);
    First.style.height = FirstWallHeight + 'px';
    Obs.appendChild(First);

    Second.classList.add('ObstaclesWalls');
    Second.style.top = FirstWallHeight + 80 + 'px';
    Second.style.height = 520 - FirstWallHeight - 80 + 'px';
    Obs.appendChild(Second);

    Obs.classList.add('Obstacles');
    if (Math.random() > 0.5) {
        Obs.style.left = '500px';
        PDS.appendChild(Obs);
        Obs.offsetWidth;
        Obs.style.left = '0px';
    } else {
        Obs.style.left = '0px';
        PDS.appendChild(Obs);
        Obs.offsetWidth;
        Obs.style.left = '500px';
    }
    
    setTimeout(() => {
        Obs.remove();
    }, TransitionTime * 1000);
}
setInterval(() => {
    MoveObstaclesAround();    
}, 1000);

function CheckForCollisions() {
    let walls = document.querySelectorAll('.ObstaclesWalls');
    walls.forEach(ev => {
        if (isCollide(ev, Player)) {
            PlayerHealth--;
            PlayerHealthHTML.textContent = PlayerHealth;
        }
    });

    requestAnimationFrame(CheckForCollisions);
}

CheckForCollisions();