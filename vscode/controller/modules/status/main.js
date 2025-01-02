
import { run_command } from '/controller/utilities/commands.js';
import { get_all_pwned } from '/controller/modules/hack/hack_watcher.js'


/** @param {NS} ns **/
async function status_all(ns) {
    ns.print("status_all");
    // TODO
}

/** @param {NS} ns **/
async function status_pwned(ns) {
    const pwnedHosts = await get_all_pwned(ns);
    ns.print(pwnedHosts);
}

const command_list = {
    'all': {
        'func': async function(ns) { await status_all(ns) },
        'description': "Get pwning status"
    },
    'pwned': {
        'func': async function(ns) { await status_pwned(ns) },
        'description': "Get pwned status"
    },
}
const default_command = 'all'

/** @param {NS} ns **/
export async function status_module(ns) {
    ns.print("in status module");
    await run_command(ns, ns.args[1], command_list, default_command);
}