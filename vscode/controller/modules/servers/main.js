
import { run_command } from '/controller/utilities/commands.js';
import { list_all } from '/controller/modules/servers/list_all.js';



/** @param {NS} ns **/
async function list_all_servers(ns) {
	const all_clients = await list_all(ns, ns.getHostname(), null);
	ns.print(all_clients);
}

const command_list = {
    'list': {
        'func': async function(ns) { await list_all_servers(ns) },
        'description': "List all servers"
    }
}
const default_command = 'local'

/** @param {NS} ns **/
export async function server_module(ns) {
    ns.print("in server module");
    await run_command(ns, ns.args[1], command_list, default_command);
}