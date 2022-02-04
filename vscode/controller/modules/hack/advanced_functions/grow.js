/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const delay = ns.args[1];
    const batch_num = ns.args[2];
    const threads = ns.args[3];

    let opt = {};
    if (threads !== undefined) {
        opt["threads"] = threads;
    }
    await ns.sleep(delay);
    await ns.grow(target, opt);
}