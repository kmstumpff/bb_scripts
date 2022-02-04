the_tree = [
    [6],
   [5,7],
  [9,1,5]
]

const sums = []

function copy_tree(tree) {
    copied_tree = [];

    for (let i = 0; i < tree.length; i++) {
        const row = [];
        for (let j = 0; j < tree[i].length; j++) {
            row.push(tree[i][j]);
        }
        copied_tree.push(row);
    }

    return copied_tree;
}

function right_trim_tree(tree) {
    const trimmed_tree = copy_tree(tree);
    trimmed_tree.shift();
    for (let i = 0; i < trimmed_tree.length; i++) {
        trimmed_tree[i].shift();
    }
    return trimmed_tree;
}

function left_trim_tree(tree) {
    // console.log(tree)
    const trimmed_tree = copy_tree(tree);

    trimmed_tree.shift();
    for (let i = 0; i < trimmed_tree.length; i++) {
        trimmed_tree[i].pop();
    }
    return trimmed_tree;
}

function traverse(tree, sum, path) {

    // console.log(tree);

    if (tree.length === 0) {
        sums.push({
            sum: sum,
            path, path
        });
        return;
    }

    const head_value = parseInt(tree[0][0]);
    const new_sum = sum + head_value;
    const new_path = [...path];
    new_path.push(head_value);


    // console.log(tree[0]);
    // console.log(tree[0][0]);

    var left_tree = left_trim_tree(tree);
    traverse(left_tree, new_sum, new_path);

    var right_tree = right_trim_tree(tree);
    traverse(right_tree, new_sum, new_path);

}

traverse(the_tree, 0, []);




// function compare(array1, array2) {
//     // if the other array is a falsy value, return
//     if (!array2) {
//         console.log("1");
//         return false;
//     }

//     // compare lengths - can save a lot of time 
//     if (array1.length != array2.length) {
//         console.log("2")
//         return false;
//     }

//     for (var i = 0, l=array1.length; i < l; i++) {
//         // Check if we have nested arrays
//         if (array1[i] instanceof Array && array2[i] instanceof Array) {
//             // recurse into the nested arrays
//             if (!compare(array1[i], array2[i])) {
//                 console.log("3")
//                 return false;
//             }
//         }           
//         else if (array1[i] != array2[i]) { 
//             // Warning - two different object instances will never be equal: {x:20} != {x:20}
//             console.log("4")
//             return false;   
//         }           
//     }       
//     return true;
// }

const sorted = sums.sort((a, b) => (a.sum > b.sum) ? 1 : -1)
for (i = 0; i < 5; i++) {
    console.log(sorted[i]);
}

min_sum = sums[0].sum;
min_path = sums[0].path;
for (let i = 0; i < sums.length; i++) {
    if (sums[i].sum < min_sum) {
        min_sum = sums[i].sum;
        min_path = sums[i].path;
    }
}

console.log(min_sum);
console.log(min_path);

// console.log(left_trim_tree(the_tree));
// console.log(right_trim_tree(the_tree));
// console.log(the_tree);

// the_copied_tree = copy_tree(the_tree);

// console.log(compare(the_tree, the_copied_tree))
