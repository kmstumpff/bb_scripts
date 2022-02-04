// Find All Valid Math Expressions
// You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


// You are given the following string which contains only digits between 0 and 9:

// 329590

// You are also given a target number of -25. Return all possible ways you can add the +, -, and * operators to the string such that it evaluates to the target number.

// The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

// ["329590", -25]

// NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

// Input: digits = "123", target = 6
// Output: [1+2+3, 1*2*3]

// Input: digits = "105", target = 5
// Output: [1*0+5, 10-5]

the_string = "329590";
// the_string = "32959";

the_number = -25;

// find_all_numbers("3") == 1
// 3

// find_all_numbers("32") == 2
// 32

// 3 2

// find_all_numbers("329") == 4
// 329

// 3 29
// 32 9

// 3 2 9

// find_all_numbers("3295") == 8
// 3295

// 3 295
// 32 95
// 329 5

// 3 29 5
// 32 9 5
// 3 2 95

// 3 2 9 5

// find_all_numbers("32959") == 16
// 32959

// 3 2959
// 32 959
// 329 59
// 3295 9

// 3 2 959
// 3 29 59
// 3 295 9
// 32 9 59
// 32 95 9
// 329 5 9

// 3 2 9 59
// 3 2 95 9
// 3 29 5 9
// 32 9 5 9

// 3 2 9 5 9








// 3 2 9 5 9
// 3 2 9 59
// 3 2 95 9
// 3 2 959
// 3 29 5 9
// 3 29 59
// 3 295 9
// 3 2959
// 32 9 5 9
// 32 9 59
// 32 95 9
// 32 959
// 329 5 9
// 329 59
// 3295 9
// 32959






// 3 2 9 5 9
    // 3 2 9 59
        // 3 2 959
            // 3 2959
                // 32959
            // 32 959
        // 3 29 59
        // 32 9 59
    // 3 2 95 9
        // 3 295 9
            // 3295 9
        // 32 95 9
    // 3 29 5 9
        // 329 5 9
            // 329 59
    // 32 9 5 9

all_combinations = []

function x(array) {
    // console.log(a);
    all_combinations.push(array);
    for (let i = 1; i < array.length; i++) {
        if (array[i-1] == '0') return;
        const new_array = [...array];
        const comb = new_array[i-1] + new_array[i];

        new_array[i-1] = comb;
        new_array.splice(i, 1);

        x(new_array);
    }
}

// https://stackoverflow.com/questions/57562611/how-to-get-distinct-values-from-an-array-of-arrays-in-javascript-using-the-filte/57562822#57562822
function unique_array(array) {
    const map = new Map();
    array.forEach((item) => map.set(item.join(), item));
    return Array.from(map.values());
}

a = the_string.split('');
x(a);

unique_combinations = unique_array(all_combinations)
// console.log(unique_combinations);
num_unique_combos = unique_combinations.length;
// console.log(num_unique_combos);

let count = 0;
function y(combination) {
    // console.log(combination);

    if (combination.length == 1 && combination[0] == the_number) {
        count += 1;
        return;
    }
    for (let i = 1; i < combination.length; i++) {
        const new_array = [...combination];
        const add = new_array[i-1] + new_array[i];
        const sub = new_array[i-1] - new_array[i];
        const mul = new_array[i-1] * new_array[i];
        new_array.splice(i, 1);


        new_array[i-1] = add;
        y(new_array);
        new_array[i-1] = sub;
        y(new_array);
        new_array[i-1] = mul;
        y(new_array);

        
    }
}

for (let i = 0; i < num_unique_combos; i++) {
    y(unique_combinations[i].map(x => parseInt(x)));
}
console.log(count);