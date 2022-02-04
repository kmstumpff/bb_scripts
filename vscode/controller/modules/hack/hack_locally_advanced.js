import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';
import { get_all_pwned } from '/controller/modules/hack/hack_watcher.js'

/** @param {NS} ns **/
export async function hack_locally_advanced(ns) {

	const all_pwned = await get_all_pwned(ns);
	ns.print(all_pwned);

	const hack_filename = "/controller/modules/hack/hack_advanced.js";
	const free_ram = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname());
	const hack_ram = ns.getScriptRam(hack_filename)
	const spare_ram = Math.ceil(ns.getServerMaxRam(ns.getHostname()) * 0.05); // %5 free ram
	const ram_per_host = Math.floor(((free_ram - spare_ram) / all_pwned.length) - hack_ram);

	for (var i = 0; i < all_pwned.length; i++) {
		const host = all_pwned[i]
		const hack_pid = ns.exec(hack_filename, ns.getHostname(), 1, host, ram_per_host);
		if (hack_pid === 0) {
			await remote_log(ns, "Cannot run script (" + hack_filename + ") for host: " + host, LOG_LEVELS.ERROR);
		}
	}
}

/** @param {NS} ns **/
export async function hack_locally_advanced_shutdown(ns) {
	//TODO
}

/** @param {NS} ns **/
export async function main(ns) {
	await hack_locally_advanced(ns);
}