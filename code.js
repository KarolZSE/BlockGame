const Container = document.getElementById('GameContainer');
let Count = 0;
let Grid = [];
for (let i = 0; i < 15; i++) {
    Grid[i] = [];
    for (let j = 0; j < 15; j++) {
        const block = document.createElement('div');
        block.textContent = Count++;
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
            let GroupCount = 0;
            let GroupElements = [];
            for ([x, y] of positions) {
                targetX = x + j;
                targetY = y + i;
                if (targetX >= 0 && targetY >= 0 && targetX <= 14 && targetY <= 14) {
                    Grid[targetX][targetY].classList.add('Fill');
                    GroupCount++;
                    GroupElements.push(Grid[targetX][targetY]);
                    Grid[targetX][targetY].addEventListener('click', () => {
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
    }
}