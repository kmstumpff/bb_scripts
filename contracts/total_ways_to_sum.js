// Total Ways to Sum
// You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


// It is possible write four as a sum in exactly four different ways:

//     3 + 1
//     2 + 2
//     2 + 1 + 1
//     1 + 1 + 1 + 1

// How many different ways can the number <the_sum> be written as a sum of at least two positive integers?



const the_sum = 22
// const the_sum = 81

let count = 0;
const paths = []

function add(sum, path) {
    if (sum == the_sum) {
        // only count paths with 2 or more integers
        if (path.length > 1) {
            count += 1;
            paths.push(path)
        }
        return;
    } else if (sum > the_sum) {
        console.log(sum);
    }

    const diff = the_sum - sum;

    for (var i = diff; i >= 1; i--) {
        const new_path = [...path]
        new_path.push(i)
        add(sum + i, new_path);
    }

}

// https://stackoverflow.com/questions/57562611/how-to-get-distinct-values-from-an-array-of-arrays-in-javascript-using-the-filte/57562822#57562822
function unique_array(array) {
    const map = new Map();
    array.forEach((item) => map.set(item.join(), item));
    return Array.from(map.values());
}

add(0, []);
// console.log(count);
paths.forEach((path) => path.sort());
console.log(unique_array(paths).length);
