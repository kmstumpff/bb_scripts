import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';
import { is_pwned, pwned } from '/controller/modules/hack/hack_watcher.js';


const hack_filename = "/controller/modules/hack/hack_basic.js";
const hack_all_filename = "/controller/modules/hack/hack_all.js";
const hack_watcher_filename = "/controller/modules/hack/hack_watcher.js";
const remote_logger_filename = "/controller/modules/logger/remote_logger.js";

export async function hack_all(ns) {

	const thisHost = ns.getHostname();
	var scan = ns.scan(thisHost);

	//ns.print(scan);
	await remote_log(ns, scan);

	const scp_filenames = [hack_filename, hack_all_filename, hack_watcher_filename, remote_logger_filename];


	for (const x in scan) {
		const host = scan[x]
		await remote_log(ns, "looking at host: " + host);

		const host_pwned = await is_pwned(ns, host);
		if (host_pwned) {
			// don't hack hosts we are already hacking
			await remote_log(ns, "Skipping host: " + host);
		} else if (!ns.hasRootAccess(host)) {
			await remote_log(ns, "No root access on host: " + host);
		} else {
			await remote_log(ns, "hacking host: " + host);
			await pwned(ns, host);
			await remote_log(ns, "scp files to host: " + host);

			
			for (const f in scp_filenames) {
				const success = await ns.scp(scp_filenames[f], "home", host);
				if (!success) {
					await remote_log(ns, "Unable to scp file " + scp_filenames[f] + " to host: " + host, LOG_LEVELS.ERROR);
				}
			}

			await remote_log(ns, "running " + hack_all_filename + " on host: " + host);

			const hack_all_pid = ns.exec(hack_all_filename, host, 1);
			if (hack_all_pid === 0) {
				await remote_log(ns, "Cannot run script (" + hack_all_filename + ") on host: " + host, LOG_LEVELS.ERROR);
			}
			while (ns.scriptRunning(hack_all_filename, host)) await ns.sleep(100);


			const hack_ram = ns.getScriptRam(hack_filename);
			const free_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
			const threads = Math.floor(free_ram / hack_ram);
			if (threads == 0) {
				await remote_log(ns, "Insufficient memory to run script (" + hack_filename + ") on host: " + host, LOG_LEVELS.ERROR);
				await remote_log(ns, hack_filename + " needs ram: " + hack_ram, LOG_LEVELS.ERROR);
				await remote_log(ns, "Free ram: " + free_ram, LOG_LEVELS.ERROR);
			}


			if (threads > 0) {
				await remote_log(ns, "Running " + threads + " thread on host: " + host);
				const hack_pid = ns.exec(hack_filename, host, threads, host);
				if (hack_pid === 0) {
					await remote_log(ns, "Cannot run script (" + hack_filename + ") on host: " + host, LOG_LEVELS.ERROR);
				}
			} else {
				await remote_log(ns, "Invalid thread count (" + threads + ") on host: " + host, LOG_LEVELS.ERROR);
			}

		}
	}
}

/** @param {NS} ns **/
export async function hack_all_shutdown(ns) {
	//TODO
}

export async function main(ns) {
	ns.disableLog("sleep");
	await hack_all(ns);
}