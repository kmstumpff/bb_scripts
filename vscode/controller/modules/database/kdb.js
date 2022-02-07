// import fs from 'fs' // TODO
// import { stringToBoolean } from '../../utilities/strings.js';

export const DB_TYPES = {
    STRING: "string",
    INTEGER: "integer",
    FLOAT: "float",
    BOOLEAN: "boolean"
}

export class KdB {
    #tables;
    #filename;
    #ns;

    constructor(ns) {
        this.#tables = {}
        this.#ns = ns
    }

    // persistence
    load(filename) {
        this.#filename = filename;

        let data = null
        if (this.#ns) {
            data = this.#ns.read(filename);
        } else {
            data = fs.readFileSync(filename, 'utf8')
            // console.log(data);
        }
        this.#tables = JSON.parse(data)
    }

    save_as(filename) {
        this.#filename = filename;
        this.save();
    }

    save() {
        if (this.#ns) {
            this.#ns.write(this.#filename,JSON.stringify(this.#tables),'w');
        } else {
            fs.writeFileSync(this.#filename, JSON.stringify(this.#tables));
        }
    }

    // table operations
    create_table(table, definition) {
        // TODO
        this.save(this.#filename);
    }
    drop_table(table) {
        // TODO
        this.save(this.#filename);
    }

    // row operations
    query(table, filters, order=null, limit=null) {
        if (!(table in this.#tables)) {
            throw `ERROR: table ${table} does not exist`;
        }

        const filter_plan = this.#get_filter_plan(filters);
        const column = filter_plan[0];


        if (!(column in this.#tables[table]["definition"])) {
            throw `ERROR: column ${column} does not exist in table ${table}`;
        }

        let compare_value = 1;
        if (order !== null) {
            if (order[0] == '-') {
                compare_value = -1;
                order = order.substring(1);
            }
            if (!(order in this.#tables[table]["definition"])) {
                throw `ERROR: order column ${order} does not exist in table ${table}`;
            }
        }
        
        var result = this.#tables[table]["rows"].filter(row => {
            return this.#query_filter(table, row, filter_plan);
        });

        if (order !== null) {
            result = result.sort((a,b) => (a[order] > b[order]) ? compare_value : ((b[order] > a[order]) ? -compare_value : 0))
        }

        if (limit !== null) {
            result = result.slice(0, parseInt(limit));
        }

        return result;
    }
    insert(table, row) {
        if (!(table in this.#tables)) {
            throw `ERROR: table ${table} does not exist`;
        }

        if (Object.keys(row).length != Object.keys(this.#tables[table]["definition"]).length) {
            throw `ERROR: invalid number of values given(${Object.keys(row).length}) expected${Object.keys(this.#tables[table]["definition"]).length}`;
        }

        const row_keys = Object.keys(row)
        for (let idx in row_keys) {
            const key = row_keys[idx];
            if (!(key in this.#tables[table]["definition"])) {
                throw `ERROR: column ${key} does not exist in table ${table}`;
            }
        }

        this.#tables[table]["rows"].push(row);

        this.save(this.#filename);

        return row;
    }
    update(table, filters, data) {
        if (!(table in this.#tables)) {
            throw `ERROR: table ${table} does not exist`;
        }

        let this_table = this.#tables[table]
        const filter_plan = this.#get_filter_plan(filters);
        this_table["rows"].map(row => {
            if (this.#query_filter(table, row, filter_plan)) {
                const data_keys = Object.keys(data)
                for (let idx in data_keys) {
                    const key = data_keys[idx];
                    if (!(key in this_table["definition"])) {
                        throw `ERROR: column ${key} does not exist in table ${table}`;
                    }

                    row[key] = data[key];
                }
            }
        });

        this.#tables[table] = this_table;

        this.save(this.#filename);

        return "SUCCESS";
    }
    delete(table, filters) {
        if (!(table in this.#tables)) {
            throw `ERROR: table ${table} does not exist`;
        }

        const filter_plan = this.#get_filter_plan(filters);
        const column = filter_plan[0];


        if (!(column in this.#tables[table]["definition"])) {
            throw `ERROR: column ${column} does not exist in table ${table}`;
        }

        var result = this.#tables[table]["rows"].filter(row => {
            return !(this.#query_filter(table, row, filter_plan));
        });

        const rows_removed = this.#tables[table]["rows"].length - result.length;
        
        this.#tables[table]["rows"] = result;

        this.save(this.#filename);

        return `SUCCESS: ${rows_removed} row deleted`;
    }

    #cast_column_value(type, value) {
        let ret = value;
        switch (type) {
            case DB_TYPES.STRING:
                ret = String(value);
                break;
            case DB_TYPES.INTEGER:
                ret = parseInt(value);
                break;
            case DB_TYPES.FLOAT:
                ret = parseFloat(value);
                break;
            case DB_TYPES.BOOLEAN:
                ret = this.#stringToBoolean(value);
        }
        if (ret == NaN || ret == undefined) {
            throw `invalid value for ${type} type (${value})`
        }

        return ret;
    }

    #stringToBoolean(string){
        switch(string.toLowerCase().trim()){
            case "true": 
            case "yes": 
            case "1": 
              return true;
    
            case "false": 
            case "no": 
            case "0": 
            case null: 
              return false;
    
            default: 
              return undefined;
        }
    }

    #get_filter_plan(filters) {
        // simple filtering
        const regex = /!=|<=|>=|<|>|=/g;
        const s = filters.split(regex);
        const column = s[0].trim();
        const operator = filters.match(regex)[0];
        const value = s[1].trim();

        return [column, operator, value];
    }

    #query_filter(table, row, filter_plan) {
        const column = filter_plan[0];
        const operator = filter_plan[1];
        const value = filter_plan[2];
        const column_type = this.#tables[table]["definition"][column]
        const casted_value = this.#cast_column_value(column_type, value)
        let ret = false;
        switch (operator) {
            case '!=':
                // console.log("!=");
                ret = row[column] != casted_value;
                break;
            case '<=':
                // console.log("<=");
                ret = row[column] <= casted_value;
                break;
            case '>=':
                // console.log(">=");
                ret = row[column] >= casted_value;
                break;
            case '<':
                // console.log("<");
                ret = row[column] < casted_value;
                break;
            case '>':
                // console.log(">");
                ret = row[column] > casted_value;
                break;
            case '=':
                // console.log("==");
                ret = row[column] == casted_value;
                break;
            default:
                console.log(`unknown operator ${operator}`);
                break;
        }
        return ret;

    }
    // #query_filter_plan(filters) {
    //     const plan = [];

    //     // (column1 = 'value' AND column2 > 2) OR column2 > 5

    //     const test = {
    //         "op": "OR",
    //         "args": [
    //             {
    //                 "op": "AND",
    //                 "args": [
    //                     {
    //                         "op": "eq",
    //                         "args": [
    //                             column1,
    //                             'value'
    //                         ]
    //                     },
    //                     {
    //                         "op": "lt",
    //                         "args": [
    //                             column2,
    //                             2
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "op": "gt",
    //                 "args": [
    //                     column2,
    //                     5
    //                 ]
    //             }
    //         ]
    //     }

    // }
}