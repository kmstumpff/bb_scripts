import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';

// TODO
const prepare_script = '/controller/modules/hack/advanced_functions/prepare.js';
const weaken_script = '/controller/modules/hack/advanced_functions/weaken.js';
const grow_script = '/controller/modules/hack/advanced_functions/grow.js';
const hack_script = '/controller/modules/hack/advanced_functions/hack.js';

/** @param {NS} ns **/
function get_server_stats(ns, target) {
    const server = ns.getServer(target);
    const player = ns.getPlayer();
    return {
        "money": {
            "max": ns.getServerMaxMoney(target),
            "current": ns.getServerMoneyAvailable(target)
        },
        "security": {
            "min": ns.getServerMinSecurityLevel(target),
            "current": ns.getServerSecurityLevel(target)
        },
        "hacking": {
            "grow": {
                "time": ns.formulas.hacking.growTime(server, player),
                "percent": ns.formulas.hacking.growPercent(server, 1, player, server.cpuCores),
            },
            "weaken": {
                "time": ns.formulas.hacking.weakenTime(server, player),
                "percent": 0,
            },
            "hack": {
                "time": ns.formulas.hacking.hackTime(server, player),
                "percent": ns.formulas.hacking.hackPercent(server, player),
            }
        }
    }
}

/** @param {NS} ns **/
async function analyze_target(ns, target) {

    const server_stats = get_server_stats(ns, target);

    ns.print(`weaken(${server_stats['hacking']['weaken']['time']} ms) grow(${server_stats['hacking']['grow']['time']} ms) hack(${server_stats['hacking']['hack']['time']} ms)`)

    ns.print(`weaken(${server_stats['hacking']['weaken']['percent']}%) grow(${server_stats['hacking']['grow']['percent']}%) hack(${server_stats['hacking']['hack']['percent']}%)`)

    const num_weaken = 20;
    const num_grow = 40;
    const num_hack = 1;

    const max_time = Math.max(server_stats['hacking']['weaken']['time'] + 200, server_stats['hacking']['grow']['time'] + 100, server_stats['hacking']['hack']['time']);
    const weaken_offset = max_time - server_stats['hacking']['weaken']['time'] + 200;
    const grow_offset = max_time - server_stats['hacking']['grow']['time'] + 100;
    const hack_offset = max_time - server_stats['hacking']['hack']['time'];

    return {
        "batch": {
            "max_time": max_time
        },
        "weaken": {
            "threads": num_weaken,
            "offset": Math.ceil(weaken_offset)
        },
        "grow": {
            "threads": num_grow,
            "offset": Math.ceil(grow_offset)
        },
        "hack": {
            "threads": num_hack,
            "offset": Math.ceil(hack_offset)
        },
    }

}

async function run_batch(ns, target, batch_params) {

    const host = ns.getHostname();

    ns.print(`${host} running batch (${batch_params["batch_number"]})`)

    const weaken_threads = batch_params["weaken"]["threads"] * batch_params["thread_multiplier"];
    const grow_threads = batch_params["grow"]["threads"] * batch_params["thread_multiplier"];
    const hack_threads = batch_params["hack"]["threads"] * batch_params["thread_multiplier"];

    let weaken_pid = 0;
    let grow_pid = 0;
    let hack_pid = 0;

    while (weaken_pid === 0) {
        weaken_pid = ns.exec(weaken_script, host, weaken_threads, target, batch_params["weaken"]["offset"], batch_params["batch_number"], weaken_threads);
        if (weaken_pid === 0) {
            await remote_log(ns, "Cannot run script (" + weaken_script + ") for host: " + target, LOG_LEVELS.ERROR);
            await ns.sleep(10);
        }
    }
    while (grow_pid === 0) {
        grow_pid = ns.exec(grow_script, host, grow_threads, target, batch_params["grow"]["offset"], batch_params["batch_number"], grow_threads);
        if (grow_pid === 0) {
            await remote_log(ns, "Cannot run script (" + grow_script + ") for host: " + target, LOG_LEVELS.ERROR);
            await ns.sleep(10);
        }
    }
    while (hack_pid === 0) {
        hack_pid = ns.exec(hack_script, host, hack_threads, target, batch_params["hack"]["offset"], batch_params["batch_number"], hack_threads);
        if (hack_pid === 0) {
            await remote_log(ns, "Cannot run script (" + hack_script + ") for host: " + target, LOG_LEVELS.ERROR);
            await ns.sleep(10);
        }
    }

}

function get_batch_ram(ns, batch_params) {
    const weaken_ram = ns.getScriptRam(weaken_script) * batch_params["weaken"]["threads"];
    const grow_ram = ns.getScriptRam(grow_script) * batch_params["grow"]["threads"];
    const hack_ram = ns.getScriptRam(hack_script) * batch_params["hack"]["threads"];

    const total_ram = weaken_ram + grow_ram + hack_ram;
    return total_ram;

}

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('exec');

    var target = ns.args[0];
    const host = ns.getHostname();
    // var current_free_mem = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    var max_mem_usage = ns.args[1];// | current_free_mem;

    const prepare_ram = ns.getScriptRam(prepare_script);
    const MAX_CONCURRENT_PREPARE = Math.floor(max_mem_usage / prepare_ram);

    const pid = ns.exec(prepare_script, host, MAX_CONCURRENT_PREPARE, target);
    if (pid === 0) {
        await remote_log(ns, "Cannot run script (" + prepare_script + ") for host: " + target, LOG_LEVELS.ERROR);
    }
    while (ns.isRunning(pid, host)) await ns.sleep(100);

    const batch_params = await analyze_target(ns, target);

    ns.print(batch_params)

    const batch_ram = get_batch_ram(ns, batch_params);
    const MAX_CONCURRENT_BATCHES = Math.floor(max_mem_usage / batch_ram);
    // await remote_log(ns,`MAX_CONCURRENT_BATCHES: ${MAX_CONCURRENT_BATCHES}`, LOG_LEVELS.DEBUG);
    batch_params["thread_multiplier"] = MAX_CONCURRENT_BATCHES;

    let batch_number = 0;
    const sleep_time = Math.ceil(batch_params["batch"]["max_time"])
    // await remote_log(ns, `sleep_time: ${sleep_time}`, LOG_LEVELS.DEBUG);

    if (sleep_time < 20) {
        await remote_log(ns, `sleep time less than minimum recomendation: ${sleep_time} ms`, LOG_LEVELS.WARNING)
    }

    while (MAX_CONCURRENT_BATCHES > 0) {
    // for (let i = 0; i < 4; i++) {
        batch_params["batch_number"] = batch_number++;
        // await remote_log(ns, `before ${ns.getServerUsedRam(host)}`, LOG_LEVELS.DEBUG);
        await run_batch(ns, target, batch_params);
        // await remote_log(ns, `after ${ns.getServerUsedRam(host)}`, LOG_LEVELS.DEBUG);
        await ns.sleep(sleep_time);
    }
    
    
}