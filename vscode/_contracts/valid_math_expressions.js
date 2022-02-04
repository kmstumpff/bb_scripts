the_string = "329590"
the_string = "32959"

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





function get_num_combos_by_split(text_length, num_split) {
    return [
               [],
              [ 1],
             [ 1, 1],
            [ 1, 2, 1],
           [ 1, 3, 3, 1],
          [ 1, 4, 6, 4, 1],
         [ 1, 5,10,10, 5, 1],
        [ 1, 6,15,20,15, 6, 1],
    ][text_length][num_split];
}

function get_num_leading_zeros(text) {
    return text.substring(0,text.length-1).split("0").length - 1;
}

function get_split_combinations(text, num_split) {
    const num_combos = get_num_combos_by_split(text.length, num_split)
    var combinations = new Array(num_combos).fill([]);
    // console.log(num_combos);
    // console.log("split: " + num_split);
    // console.log(get_num_combos_by_split(text.length, num_split));
    for (var i = 0; i < num_combos; i++) {
        let combonation = [];
        if (i == 0) {
            combination.push(text)
        } else {
            for (var j = 0; j <= num_combos; j++) {
                //parseInt()
            }
        }
        combinations[i] = combonation;
    }
    return combinations
}

function get_combinations(text) {
    const combinations = [];
    for (var i = 0; i < text.length; i++) {
        combinations.push(get_split_combinations(text, i));
    }
    return combinations;
}

function find_all_numbers(text) {
    const num_leading_zeros = get_num_leading_zeros(text);
    // console.log(num_leading_zeros);
    // console.log(Math.pow(2, text.length - 1));
    const combinations = get_combinations(text);
    console.log(combinations);
}

find_all_numbers(the_string);