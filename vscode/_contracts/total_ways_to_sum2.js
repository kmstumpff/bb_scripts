// Total Ways to Sum
// You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


// It is possible write four as a sum in exactly four different ways:

//     3 + 1
//     2 + 2
//     2 + 1 + 1
//     1 + 1 + 1 + 1

// How many different ways can the number <the_sum> be written as a sum of at least two positive integers?



// const the_sum = 22
const the_sum = 81

let count = 0;

function add(sum, previous) {

    if (sum == the_sum) {
        count += 1;
        return;
    } else if (sum > the_sum) {
        console.log(sum);
    }

    sums = []
    for (var i = previous; i >= 1; i--) {
        const new_sum = sum + i;
        if (new_sum <= the_sum) {
            add(new_sum, i);
        }
    }
}

add(0, the_sum - 1);
console.log(count);

