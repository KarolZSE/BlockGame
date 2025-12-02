const Container = document.getElementById('GameContainer');
let Grid = [];
for (let i = 0; i < 15; i++) {
    Grid[i] = [];
    for (let j = 0; j < 15; j++) {
        const block = document.createElement('div');
        Grid[i][j] = block;       
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
    let GroupCount = 0;
    let GroupElements = [];
    for ([x, y] of positions) {
        targetX = x + j;
        targetY = y + i;
        if (targetX >= 0 && targetY >= 0 && targetX <= array.length - 1 && targetY <= array[0].length - 1) {
            array[targetX][targetY].classList.add('Fill');
            GroupCount++;
            GroupElements.push(array[targetX][targetY]);
            array[targetX][targetY].addEventListener('click', () => {
                GroupCount--;
                if (GroupCount <= 0) {
                    GroupElements.forEach(e => {
                        e.classList.remove('Fill');
                    });
                }
            }, { once: true});
        }
    }
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