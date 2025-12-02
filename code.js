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

for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        if (i > 0 && j > 0 && i < 14 && j < 14) {
            if (Math.random() > 0.9) {
                Grid[i + 1][j].classList.add('Fill');
                Grid[i - 1][j].classList.add('Fill');
                Grid[i][j + 1].classList.add('Fill');
                Grid[i][j - 1].classList.add('Fill');
                Grid[i][j].classList.add('Fill');
            }
        }
    }
}