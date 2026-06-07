let p = document.querySelector('p');
let cont = document.querySelector('.container');
let btn = document.querySelector(".btn");
let btn1 = document.querySelector(".btn1");
let btn2 = document.querySelector(".btn2");
let sudo;
let arr;
let soln;
let lastclick;
let checking = false;


let create = function (arr) {
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length; j++) {
            let box = document.createElement('div');
            box.innerText = arr[i][j];
            box.classList.add("box");
            if (arr[i][j] != 0) {
                box.classList.add("fixed");
            }

            let id = `${i}${j}`;
            box.id = id;
            cont.appendChild(box);




        }
    }
}
let call = async function () {
    let res = await fetch('https://sudoku-api.vercel.app/api/dosuku');
    let sudoku;
    if (res.ok) {
        sudoku = await res.json();

    } else {
        console.log("can,t fetch more");
        sudoku = {
            "newboard": {
                "grids": [
                    {
                        "value": [
                                [0,0,3,0,0,0,0,8,0],
                                [6,5,7,0,0,9,0,0,0],
                                [0,0,0,3,2,0,6,7,0],
                                [7,2,1,0,4,0,0,5,8],
                                [0,6,0,0,3,0,0,1,0],
                                [0,0,8,2,1,0,0,0,0],
                                [3,9,0,4,7,0,8,0,0],
                                [8,7,0,0,5,3,0,0,0],
                                [0,0,0,0,0,0,0,0,0]
                                ],

                            "solution": [
                                [2,1,3,7,6,4,5,8,9],
                                [6,5,7,1,8,9,4,2,3],
                                [4,8,9,3,2,5,6,7,1],
                                [7,2,1,9,4,6,3,5,8],
                                [9,6,4,5,3,8,2,1,7],
                                [5,3,8,2,1,7,9,4,6],
                                [3,9,5,4,7,1,8,6,2],
                                [8,7,2,6,5,3,1,9,4],
                                [1,4,6,8,9,2,7,3,5]
                            ],
                        "difficulty": "Medium"
                    }
                ],
                "results": 1,
                "message": "All Ok"
            }
        }
    }

    arr = sudoku.newboard.grids[0].value;
    console.log(arr);
    sudo = JSON.parse(JSON.stringify(arr));
    create(arr);
    soln = sudoku.newboard.grids[0].solution;

}



cont.addEventListener('click', (event) => {

    let j = Number(event.target.id) % 10;
    let i = Math.floor(Number(event.target.id) / 10);
    lastclick = [i, j];
    if (arr[i][j] == 0) {
        let value = Number(event.target.innerText);
        value = (value % 9) + 1;
        event.target.innerText = value;
        sudo[i][j] = value;
    }
}
)


let solve = function () {

    // for (i = 0; i < arr.length; i++) {
    //     for (j = 0; j < arr.length; j++) {

    //     }
    // }
    let i = 0;
    let j = 0;

    let timer = setInterval(() => {
        let a = soln[i][j];
        sudo[i][j] = a;
        document.getElementById(`${i}${j}`).innerText = a;

        j++;

        if (j === 9) {
            j = 0;
            i++;
        }

        if (i === 9) {
            clearInterval(timer);
        }
    }, 50);

}
btn.disabled = true;

call().then(() => {
    btn.disabled = false;
});
btn.addEventListener("click", solve);


let check = function () {
    
     checking = true;

    document.querySelectorAll(".hovered").forEach(cell => {
        cell.classList.remove("hovered");
    });
    
    document.querySelectorAll(".active-cell").forEach(cell => {
        cell.classList.remove("active-cell");
    });
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr.length; j++) {
            if (soln[i][j] != sudo[i][j]) {
                document.getElementById(`${i}${j}`).classList.add("wrong");
            }
            if ((soln[i][j] == sudo[i][j]) && arr[i][j] == 0) {
                document.getElementById(`${i}${j}`).classList.add("right");
            }

        }
    }
     
    setTimeout(() => {
        for (i = 0; i < arr.length; i++) {
            for (j = 0; j < arr.length; j++) {
                if (arr[i][j] == 0) {
                    document.getElementById(`${i}${j}`).classList.remove("wrong", "right");
                }
            }
        }

        checking = false; 
    }, 2200)

}

let hint = function () {
    let i = lastclick[0];
    let j = lastclick[1];
    sudo[i][j] = soln[i][j];
    document.getElementById(`${i}${j}`).innerText = soln[i][j];

}

btn1.addEventListener("click", check);
btn2.addEventListener("click", hint);

cont.addEventListener("mouseover", (event) => {
    if (!event.target.classList.contains("box")) return;
        if(checking){
            return;
        }
    // Remove previous highlights
    document.querySelectorAll(".hovered").forEach(cell => {
        cell.classList.remove("hovered");
    });
    
    document.querySelectorAll(".active-cell").forEach(cell => {
        cell.classList.remove("active-cell");
    });

    event.target.classList.add("active-cell");

    let r = Math.floor(Number(event.target.id) / 10);
    let c = Number(event.target.id) % 10;

    let row = Math.floor(r / 3) * 3;
    let col = Math.floor(c / 3) * 3;

    for (let i = row; i < row + 3; i++) {
        for (let j = col; j < col + 3; j++) {
            document.getElementById(`${i}${j}`).classList.add("hovered");
        }
    }
});
