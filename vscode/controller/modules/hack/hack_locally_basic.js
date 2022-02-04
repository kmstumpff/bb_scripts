import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';
import { get_all_pwned } from '/controller/modules/hack/hack_watcher.js'

/** @param {NS} ns **/
export async function hack_locally_basic(ns) {

	const all_pwned = (await get_all_pwned(ns)).filter(e => e !== 'home');
	ns.print(all_pwned);

	const hack_filename = "/controller/modules/hack/hack_basic.js";
	const free_ram = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
	const hack_ram = ns.getScriptRam(hack_filename);
	const threads_per_host = Math.floor((free_ram / all_pwned.length) / hack_ram);

	if (threads_per_host > 0) {
		for (var i = 0; i < all_pwned.length; i++) {
			const host = all_pwned[i]
			const hack_pid = ns.exec(hack_filename, ns.getHostname(), threads_per_host, host);
			if (hack_pid === 0) {
				await remote_log(ns, "Cannot run script (" + hack_filename + ") for host: " + host, LOG_LEVELS.ERROR);
			}
		}
	}
}

/** @param {NS} ns **/
export async function hack_locally_basic_shutdown(ns) {
	//TODO
}

/** @param {NS} ns **/
export async function main(ns) {
	await hack_locally_basic(ns);
}