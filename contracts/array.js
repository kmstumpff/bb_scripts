the_array = [[0,0,0,0,0],
             [0,0,0,0,0],
             [0,0,0,0,0],
             [0,0,0,0,0],
             [0,0,0,0,0],
             [0,0,0,0,0]]

count = 0;

function copy_array(array) {
    copied_array = [];

    if (array) {
        for (let i = 0; i < array.length; i++) {
            const row = [];
            if (array[i]) {
                for (let j = 0; j < array[i].length; j++) {
                    row.push(array[i][j]);
                }
            }
            copied_array.push(row);
        }
    }

    return copied_array;
}

function traverse(array, x, y, path) {

    console.log([x, y]);
    const new_path = copy_array(path);
    new_path.push([x,y]);

    if (y == (array.length - 1) && x == (array[y].length - 1)) {
        count += 1;
        return;
    }

    // down
    if ((y+1) < array.length) {
        traverse(array, x, y+1);
    }

    // right
    if ((x+1) < array[y].length) {
        traverse(array, x+1, y);
    }

    // const head_value = parseInt(tree[0][0]);
    // const new_sum = sum + head_value;
    // const new_path = [...path];
    // new_path.push(head_value);


    // // console.log(tree[0]);
    // // console.log(tree[0][0]);

    // var left_tree = left_trim_tree(tree);
    // traverse(left_tree, new_sum, new_path);

    // var right_tree = right_trim_tree(tree);
    // traverse(right_tree, new_sum, new_path);

}

traverse(the_array, 0, 0, []);

console.log(count);

console.log(the_array.length, the_array[the_array.length - 1].length)