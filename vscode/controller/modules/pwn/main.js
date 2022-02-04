
import { run_command } from '/controller/utilities/commands.js';
import { pwn_all_locally } from '/controller/modules/pwn/pwn_all_locally.js';
import { pwn_all_remote } from '/controller/modules/pwn/pwn_all_remote.js';


/** @param {NS} ns **/
async function local(ns) {
    ns.print("start local pwn script");
    await pwn_all_locally(ns, ns.getHostname(), null);
}

/** @param {NS} ns **/
async function remote(ns) {
    ns.print("start remote pwn script");
    await pwn_all_remote(ns, ns.getHostname(), null);
}

// /** @param {NS} ns **/
// async function stop(ns) {
//     ns.print("stop pwn module");
// }

/** @param {NS} ns **/
async function status(ns) {
    // TODO
    ns.print("Status currently unavailable");
}


const command_list = {
    'status': {
        'func': async function(ns) { await status(ns) },
        'description': "Get pwning status"
    },
    'local': {
        'func': async function(ns) { await local(ns) },
        'description': "Run pwn_all_locally script"
    },
    'remote': {
        'func': async function(ns) { await remote(ns) },
        'description': "Run pwn_all script"
    }
}
const default_command = 'local'

/** @param {NS} ns **/
export async function pwn_module(ns) {
    ns.print("in pwn module");
    await run_command(ns, ns.args[1], command_list, default_command);
}