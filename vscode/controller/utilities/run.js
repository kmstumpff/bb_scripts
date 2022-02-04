

/** @param {NS} ns **/
export function exec(ns, script, args) {
    const host = ns.getHostname();
    return ns.exec(script, host, 1, ...args);
}
/** @param {NS} ns **/
export function run(ns, script, args) {
    return ns.run(script, 1, ...args);
}

/** @param {NS} ns **/
export function exec_with_tail(ns, script, args) {
    const host = ns.getHostname();
    const pid = exec(ns, script, args);
    ns.tail(pid, host, ...args);
}

/** @param {NS} ns **/
export function run_with_tail(ns, script, args) {
    const host = ns.getHostname();
    const pid = run(ns, script, args);
    ns.tail(pid, host, ...args);
}

/** @param {NS} ns **/
export async function exec_and_wait(ns, script, args) {
    const host = ns.getHostname();
    const pid = exec(ns, script, args);
    while (ns.isRunning(pid, host, ...args)) await ns.sleep(10);
}

/** @param {NS} ns **/
export async function run_and_wait(ns, script, args) {
    const host = ns.getHostname();
    const pid = run(ns, script, args);
    while (ns.isRunning(pid, host, ...args)) await ns.sleep(10);
}


/** @param {NS} ns **/
export async function main(ns) {
    const script = ns.args[0];
    const args = ns.args.slice(1);
    run_with_tail(ns, script, args);
}