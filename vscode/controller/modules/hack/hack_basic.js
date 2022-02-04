import { remote_log } from '/controller/modules/logger/remote_logger.js';

export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await remote_log(ns, "weaken")
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await remote_log(ns, "grow")
            await ns.grow(target);
        } else {
            await remote_log(ns, "hack")
            await ns.hack(target);
        }
    }
}