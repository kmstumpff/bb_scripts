
// Modules
import { hack_module } from '/controller/modules/hack/main.js';
import { pwn_module } from '/controller/modules/pwn/main.js';
import { database_module } from '/controller/modules/database/main.js';
import { logger_module } from '/controller/modules/logger/main.js';
import { status_module } from '/controller/modules/status/main.js';
import { server_module } from '/controller/modules/servers/main.js';
import { run_command } from '/controller/utilities/commands.js'


const command_list = {
    'start': {
        'func': async function(ns) {
            await logger_module(ns);
            await pwn_module(ns);
            await hack_module(ns);
        },
        'description': "Startup from scratch"
    },
    'pwn': {
        'func': async function(ns) { await pwn_module(ns) },
        'description': "Module used for pwning (nuking) machines"
    },
    'hack': {
        'func': async function(ns) { await hack_module(ns) },
        'description': "Module used for hacking machines"
    },
    'logger': {
        'func': async function(ns) { await logger_module(ns) },
        'description': "Module used for centralized logging"
    },
    'server': {
        'func': async function(ns) { await server_module(ns) },
        'description': "Module used for misc server functions"
    },
    'database': {
        'func': async function(ns) { await database_module(ns) },
        'description': "Module used for database utility"
    },
    'status': {
        'func': async function(ns) { await status_module(ns) },
        'description': "Module used for getting overall status"
    }
}
const default_command = 'help'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("scan");
    await run_command(ns, ns.args[0], command_list, default_command);
}