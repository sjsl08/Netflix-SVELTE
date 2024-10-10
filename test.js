let mat = [ 
    [1, 2, 3, 20], 
    [5, 6, 20, 25], 
    [1, 3, 5, 6], 
    [6, 7, 8, 15] 
]; 

let m = new Map();

// Flatten the matrix into a 1D array
mat = mat.flat(Infinity);

console.log(mat);

// Count the occurrences of each number
for (let i = 0; i < mat.length; i++) {
    if (m.has(mat[i])) {
        m.set(mat[i], m.get(mat[i]) + 1);
    } else {
        m.set(mat[i], 1);
    }
}

console.log(m);
