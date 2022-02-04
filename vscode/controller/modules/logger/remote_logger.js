const LOG_PORT = 1;
const LOG_LOCK_PORT = 2;

export const LOG_LEVELS = {
	CRITICAL: "CRITICAL",
	ERROR: "ERROR",
	WARNING: "WARNING",
	INFO: "INFO",
	DEBUG: "DEBUG",
}

const levels = [LOG_LEVELS.CRITICAL, LOG_LEVELS.ERROR, LOG_LEVELS.WARNING, LOG_LEVELS.DEBUG];

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");

	ns.clearPort(LOG_PORT);
	ns.clearPort(LOG_LOCK_PORT);
	await ns.writePort(LOG_LOCK_PORT, "lock")
	const log_file = ns.args[0] | 'remote_log.txt';
	
	while (true) {
		const data = ns.readPort(LOG_PORT);
		if (data != 'NULL PORT DATA') {
			ns.print(data);
			if (log_file) {
				await ns.write(log_file, data)
				await ns.write(log_file, "\n")
			}
			await ns.writePort(LOG_LOCK_PORT, "lock")
		} else {
			await ns.sleep(10);
		}
		await ns.sleep(5);
	}

}

/** @param {NS} ns **/
function format_msg(ns, msg, level) {
	const hostname = ns.getHostname();
	var datetime = new Date().toISOString();


	return "[" + level + "](" + hostname + ") " + datetime + ": " + msg
}

async function lock_wait(ns) {
	let locked = false;
	while (!locked) {
		const data = ns.readPort(LOG_LOCK_PORT);
		if (data == 'lock') {
			locked = true;
		} else {
			await ns.sleep(100);
		}
	}
}

/** @param {NS} ns **/
export async function remote_log(ns, msg, level) {
	const log_level = level ? level : LOG_LEVELS.INFO;
	if ( levels.includes(log_level)) {
		const fmsg = format_msg(ns, msg, log_level)
		ns.print(fmsg);
		await lock_wait(ns);
		await ns.writePort(LOG_PORT, fmsg);
	}
}