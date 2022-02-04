import { is_pwned, pwned } from '/controller/modules/pwn/pwn_watcher.js'
import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js'

const pwn_filename = "/controller/modules/pwn/pwn.js";
const pwn_all_filename = "/controller/modules/pwn/pwn_all.js";
const pwn_watcher_filename = "/controller/modules/pwn/pwn_watcher.js";
const remote_logger_filename = "/controller/modules/logger/remote_logger.js";

export async function pwn_all_remote(ns) {

	const thisHost = ns.getHostname();
	var scan = ns.scan(thisHost);

	await remote_log(ns, scan);

	for (const x in scan) {
		const host = scan[x]

		const scp_filenames = [pwn_filename, pwn_all_filename, pwn_watcher_filename, remote_logger_filename];

		for (const f in scp_filenames) {
			const success = await ns.scp(scp_filenames, "home", host);
			if (!success) {
				await remote_log(ns, "Unable to scp file " + scp_filenames[f] + " to host: " + host, LOG_LEVELS.ERROR);
			}
		}

		const host_pwned = await is_pwned(ns, host);
		if (host_pwned) {
			// don't pwn hosts we have already pwned
			await remote_log(ns, "Already pwned host: " + host);
		} else {
			await pwned(ns, host);
		
			if (ns.hasRootAccess(host)) {
				// don't hack hosts we have already hacked
				await remote_log(ns, "Already have root access on host: " + host);
			} else {
				await remote_log(ns, "pwning host: " + host);
				const pwn_pid = ns.run(pwn_filename, 1, host);
				if (pwn_pid === 0) {
					await remote_log(ns, "Cannot run script (" + pwn_filename + ") on host: " + host, LOG_LEVELS.ERROR);
				}
				while (ns.getRunningScript(pwn_pid, host)) await ns.sleep(100);
			}
			
			const hack_ram = ns.getScriptRam(pwn_all_filename);
			const free_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
			const threads = Math.floor(free_ram / hack_ram);
			if (threads == 0) {
				await remote_log(ns, "Insufficient memory to run script (" + pwn_all_filename + ") on host: " + host, LOG_LEVELS.ERROR);
				await remote_log(ns, pwn_all_filename + " needs ram: " + hack_ram, LOG_LEVELS.ERROR);
				await remote_log(ns, "Free ram: " + free_ram, LOG_LEVELS.ERROR);
			}

			const pwn_all_pid = ns.exec(pwn_all_filename, host, 1);
			if (pwn_all_pid === 0) {
				await remote_log(ns, "Cannot run script (" + pwn_all_filename + ") on host: " + host, LOG_LEVELS.ERROR);
			}
			while (ns.scriptRunning(pwn_all_filename, host)) await ns.sleep(100);			
		}
	}
}

export async function main(ns) {
	ns.disableLog("sleep");
    await pwn_all_remote(ns);
}