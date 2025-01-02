import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';

const sshExe = "BruteSSH.exe"
const ftpExe = "FTPCrack.exe"
const smtpExe = "relaySMTP.exe"
const httpExe = "HTTPWorm.exe"
const sqlExe = "SQLInject.exe"



/** @param {NS} ns **/
async function pwn_host_locally(ns, host) {
	let server = ns.getServer(host);

	if (server.hasAdminRights) {
		ns.print("Already pwned: " + host)
		return;
	}

	if (!server.sshPortOpen && ns.fileExists(sshExe, "home")) {
		//ns.print("Running crack: " + sshExe)
		ns.brutessh(host);
	}
	if (!server.ftpPortOpen && ns.fileExists(ftpExe, "home")) {
		//ns.print("Running crack: " + ftpExe)
		ns.ftpcrack(host)
	}
	if (!server.smtpPortOpen && ns.fileExists(smtpExe, "home")) {
		//ns.print("Running crack: " + smtpExe)
		ns.relaysmtp(host)
	}
	if (!server.httpPortOpen && ns.fileExists(httpExe, "home")) {
		//ns.print("Running crack: " + httpExe)
		ns.httpworm(host)
	}
	if (!server.sqlPortOpen && ns.fileExists(sqlExe, "home")) {
		//ns.print("Running crack: " + sqlExe)
		ns.sqlinject(host)
	}

	server = ns.getServer(host); // refresh server object
	const portsRequired = ns.getServerNumPortsRequired(host);
	if (server.openPortCount >= portsRequired) {
		ns.print("Running nuke: " + sqlExe)
		ns.nuke(host);
	} else {
		ns.print("Not enough open ports to nuke: " + server.openPortCount + " / " + portsRequired)
	}
}

/** @param {NS} ns **/
export async function pwn_all_locally(ns, host, parent) {
	var scan = ns.scan(host);
	await remote_log(ns, scan)

	for (const x in scan) {
		let new_host = scan[x];
		if (new_host != parent) {
			await remote_log(ns, new_host);
			try {

				pwn_host_locally(ns, new_host);
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