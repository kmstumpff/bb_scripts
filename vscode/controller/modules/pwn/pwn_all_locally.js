import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';

const sshExe = "BruteSSH.exe"
const ftpExe = "FTPCrack.exe"
const smtpExe = "relaySMTP.exe"
const httpExe = "HTTPWorm.exe"
const sqlExe = "SQLInject.exe"

/** @param {NS} ns **/
export async function pwn_all_locally(ns, host, parent) {
	var scan = ns.scan(host);
	await remote_log(ns, scan)

	for (const x in scan) {
		let new_host = scan[x];
		if (new_host != parent) {
			await remote_log(ns, new_host);
			try {
    			const server = ns.getServer(new_host);
				if (!server.sshPortOpen && ns.fileExists(sshExe, "home")) {
					//ns.print("Running crack: " + sshExe)
					ns.brutessh(new_host);
				}
				if (!server.ftpPortOpen && ns.fileExists(ftpExe, "home")) {
					//ns.print("Running crack: " + ftpExe)
					ns.ftpcrack(new_host)
				}
				if (!server.smtpPortOpen && ns.fileExists(smtpExe, "home")) {
					//ns.print("Running crack: " + smtpExe)
					ns.relaysmtp(new_host)
				}
				if (!server.httpPortOpen && ns.fileExists(httpExe, "home")) {
					//ns.print("Running crack: " + httpExe)
					ns.httpworm(new_host)
				}
				if (!server.sqlPortOpen && ns.fileExists(sqlExe, "home")) {
					//ns.print("Running crack: " + sqlExe)
					ns.sqlinject(new_host)
				}
				//ns.print("Running nuke: " + sqlExe)
        		ns.nuke(new_host);
			} catch (ex) {
				await remote_log(ns, ex, LOG_LEVELS.ERROR)
			}

			await pwn_all_locally(ns, new_host, host);
		}
	}
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");
	ns.disableLog("scan");

	await pwn_all_locally(ns, ns.getHostname(), null);
}