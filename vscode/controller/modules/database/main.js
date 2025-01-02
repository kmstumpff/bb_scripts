import { exec } from '/controller/utilities/run.js'
import { run_command } from '/controller/utilities/commands.js'
import { send } from '/controller/modules/database/service.js';
import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';


const database_service_filename = '/controller/modules/database/service.js';

/** @param {NS} ns **/
async function start_service(ns) {
    const args = [];
    if (ns.args[2]) {
        args.push(ns.args[2]);
    }

    exec(ns, database_service_filename, args)
}


const command_list = {
    'start': {
        'func': async function(ns) { await start_service(ns) },
        'description': "Start the database service"
    },
    'stop': {
        'func': async function(ns) { },
        'description': "Stop the database service"
    },
    'send': {
        'func': async function(ns) {  await send(ns, ns.args[2]) },
        'description': "Send a command to the database service"
    },
    'status': {
        'func': async function(ns) {  },
        'description': "Get status of the database service"
    }
}
const default_command = 'start'

/** @param {NS} ns **/
export async function database_module(ns) {
    await remote_log(ns, "database module");
    await run_command(ns, ns.args[1], command_list, default_command);
}



