/** @param {NS} ns **/
export async function main(ns) {

    const target = ns.args[0];
    const batch_num = ns.args[1];
    const threads = ns.args[2];

    let opt = {};
    if (threads !== undefined) {
        opt["threads"] = threads;
    }

    var moneyThresh = ns.getServerMaxMoney(target);
    var securityThresh = ns.getServerMinSecurityLevel(target);
	
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh + 1) {
            await ns.weaken(target, opt);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target, opt);
        } else if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target, opt);
        } else {
            break;
        }
    }
}