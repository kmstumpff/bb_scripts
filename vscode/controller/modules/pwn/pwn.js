const sshExe = "BruteSSH.exe"
const ftpExe = "FTPCrack.exe"
const smtpExe = "relaySMTP.exe"
const httpExe = "HTTPWorm.exe"
const sqlExe = "SQLInject.exe"



/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];

    const portsNeeded = ns.getServerNumPortsRequired(target);
    const server = ns.getServer(target);
    let portsCurrentlyOpen = (
        (server.sshPortOpen ? 1 : 0) +
        (server.ftpPortOpen ? 1 : 0) +
        (server.smtpPortOpen ? 1 : 0) +
        (server.httpPortOpen ? 1 : 0) +
        (server.sqlPortOpen ? 1 : 0)
    )
    const portsToBeOpened = (
        (server.sshPortOpen ? 1 : (ns.fileExists(sshExe, "home") ? 1 : 0)) +
        (server.ftpPortOpen ? 1 : (ns.fileExists(ftpExe, "home") ? 1 : 0)) +
        (server.smtpPortOpen ? 1 : (ns.fileExists(smtpExe, "home") ? 1 : 0)) +
        (server.httpPortOpen ? 1 : (ns.fileExists(httpExe, "home") ? 1 : 0)) +
        (server.sqlPortOpen ? 1 : (ns.fileExists(sqlExe, "home") ? 1 : 0))
    );

    if (!server.sshPortOpen && ns.fileExists(sshExe, "home")) {
        ns.print("Running crack: " + sshExe)
        ns.brutessh(target);
        portsCurrentlyOpen += 1;
    }
    if (!server.ftpPortOpen && ns.fileExists(ftpExe, "home")) {
        ns.print("Running crack: " + ftpExe)
        ns.ftpcrack(target)
        portsCurrentlyOpen += 1;
    }
    if (!server.smtpPortOpen && ns.fileExists(smtpExe, "home")) {
        ns.print("Running crack: " + smtpExe)
        ns.relaysmtp(target)
        portsCurrentlyOpen += 1;
    }
    if (!server.httpPortOpen && ns.fileExists(httpExe, "home")) {
        ns.print("Running crack: " + httpExe)
        ns.httpworm(target)
        portsCurrentlyOpen += 1;
    }
    if (!server.sqlPortOpen && ns.fileExists(sqlExe, "home")) {
        ns.print("Running crack: " + sqlExe)
        ns.sqlinject(target)
        portsCurrentlyOpen += 1;
    }

    if (portsCurrentlyOpen != portsToBeOpened) {
        ns.print("Something went wrong opening ports: expected=" + portsToBeOpened + " actual=" + portsCurrentlyOpen)
    }

    if (portsNeeded > portsCurrentlyOpen) {
        ns.print("Cannot currently pwn this host: " + target)
        ns.print("Ports needed: " + portsNeeded)
        ns.print("Ports opened: " + portsToBeOpened)
    } else {
        ns.nuke(target);
    }
}