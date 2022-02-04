import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';

/** @param {NS} ns **/
export async function list_all(ns, host, parent) {
	var scan = ns.scan(host);
	// await remote_log(ns, scan)

	let host_clients = {}

	for (const x in scan) {
		let new_host = scan[x];
		if (new_host != parent) {
			// await remote_log(ns, new_host);
			host_clients[new_host] = await list_all(ns, new_host, host);
		}
	}

	return host_clients
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("scan");
	
	ns.print(all_clients);

	const all_clients = await list_all(ns, ns.getHostname(), null);
	ns.print(all_clients);
}