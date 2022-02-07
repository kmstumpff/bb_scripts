
// SELECT(table_name) WHERE(column1 = 'value' AND column2 > 2)
// SELECT(table_name) WHERE((column1 = 'value' AND column2 > 2) OR column2 > 5) ORDER(column1) LIMIT(1)
// order of commands SELECT, WHERE, ORDER, LIMIT

// commands
export const DB_COMMANDS = {
    SELECT: "SELECT",
    INSERT: "INSERT",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    CREATE_TABLE: "CREATE_TABLE",
    DROP_TABLE: "DROP_TABLE",
}
export const SELECT_COMMANDS = {
    WHERE: "WHERE",
    AND: "AND",
    OR: "OR",
    LIMIT: "LIMIT",
    ORDER: "ORDER",
}
export const INSERT_COMMANDS = {
    VALUES: "VALUES",
}
export const UPDATE_COMMANDS = {
    WHERE: "WHERE",
    VALUES: "VALUES",
}
export const DB_RESPONSES = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
}

export class CommandManager {
    #database;
    constructor(database) {
        this.#database = database;
    }

    run(command) {
        const db_cmd = this.#parse_sub_command(command.split(' ')[0]);
        let response = `${DB_RESPONSES.ERROR}: Unknown error`;
        switch (db_cmd[0]) {
            case DB_COMMANDS.SELECT:
                response = this.#run_select_command(command);
                break;
            case DB_COMMANDS.INSERT:
                response = this.#run_insert_command(command);
                break;
            case DB_COMMANDS.UPDATE:
                response = this.#run_update_command(command);
                break;
            case DB_COMMANDS.DELETE:
                response = this.#run_delete_command(command);
                break;
            case DB_COMMANDS.CREATE_TABLE:
                response = this.#run_create_table_command(command);
                break;
            case DB_COMMANDS.DROP_TABLE:
                response = this.#run_drop_table_command(command);
                break;
            default:
                response = `${DB_RESPONSES.ERROR}: Unknown command`;
                break;
        }
        return JSON.stringify(response);
    }



    #run_select_command(command) {
        try {
            let parts = command.split(':');
            let where_filters = null;
            let order = null;
            let limit = null;

            const select_cmd = this.#parse_sub_command(parts.shift());
            const table_name = select_cmd[1];

            if (select_cmd[0] != DB_COMMANDS.SELECT) {
                return `${DB_RESPONSES.ERROR}: Dev error - ${select_cmd[0]} != ${DB_COMMANDS.SELECT}`
            }

            while (parts.length > 0) {
                const subcommand = this.#parse_sub_command(parts.shift());

                switch (subcommand[0]) {
                    case SELECT_COMMANDS.WHERE:
                        if (order !== null || limit !== null) {
                            throw "SELECT - WHERE command out of order";
                        }
                        where_filters = subcommand[1];
                        break;
                    case SELECT_COMMANDS.ORDER:
                        if (limit !== null) {
                            throw "SELECT - ORDER command out of order";
                        }
                        order = subcommand[1];
                        break;
                    case SELECT_COMMANDS.LIMIT:
                        limit = subcommand[1];
                        break;
                    default:
                        throw `SELECT - Unknown subcommand ${subcommand[0]}`;
                }
            }

            return this.#database.query(table_name, where_filters, order, limit);

        } catch (err) {
            return `${DB_RESPONSES.ERROR}: ${err}`
        }

    }
    #run_insert_command(command) {
        try {
            let parts = command.split(':');
            const select_cmd = this.#parse_sub_command(parts.shift());
            const table_name = select_cmd[1];
            
            const values_cmd = this.#parse_sub_command(parts.shift());
            if (values_cmd[0] != INSERT_COMMANDS.VALUES) {
                throw `INSERT - Unknown subcommand ${values_cmd[0]}`;
            }
            const values = values_cmd[1].split(',');

            let row = {}
            for (let value in values) {
                const v = values[value].split('=');
                row[v[0]] = v[1];
            }

            return this.#database.insert(table_name, row);
        } catch (err) {
            return `${DB_RESPONSES.ERROR}: ${err}`
        }
    }
    #run_update_command(command) {
        try {
            let parts = command.split(':');
            const select_cmd = this.#parse_sub_command(parts.shift());
            const table_name = select_cmd[1];

            const where_cmd = this.#parse_sub_command(parts.shift());
            if (where_cmd[0] != UPDATE_COMMANDS.WHERE) {
                throw `UPDATE - Must include WHERE subcommand but found ${where_cmd[0]}`;
            }
            const filters = where_cmd[1];
            
            const values_cmd = this.#parse_sub_command(parts.shift());
            if (values_cmd[0] != UPDATE_COMMANDS.VALUES) {
                throw `UPDATE - Unknown subcommand ${values_cmd[0]}`;
            }
            const values = values_cmd[1].split(',');

            let data = {}
            for (let value in values) {
                const v = values[value].split('=');
                data[v[0]] = v[1];
            }

            return this.#database.update(table_name, filters, data);
        } catch (err) {
            return `${DB_RESPONSES.ERROR}: ${err}`
        }
    }
    #run_delete_command(command) {
        try {
            let parts = command.split(':');
            const select_cmd = this.#parse_sub_command(parts.shift());
            const table_name = select_cmd[1];

            const where_cmd = this.#parse_sub_command(parts.shift());
            if (where_cmd[0] != UPDATE_COMMANDS.WHERE) {
                throw `UPDATE - Must include WHERE subcommand but found ${where_cmd[0]}`;
            }
            const filters = where_cmd[1];

            return this.#database.delete(table_name, filters);
        } catch (err) {
            return `${DB_RESPONSES.ERROR}: ${err}`
        }
    }

    #run_create_table_command(command) {
        // TODO
    }

    #run_drop_table_command(command) {
        // TODO
    }

    #parse_sub_command(subcommand) {
        const open = subcommand.indexOf("(")
        const close = subcommand.length - 1;

        const key = subcommand.substring(0, open);
        const value = subcommand.substring(open + 1, subcommand.length - 1)

        // console.log(key);
        // console.log(value);

        return [key, value];
    }
}
