
// import { pwn } from 'pwn_all_locally.js';
import { exec } from '/controller/utilities/run.js'
import { hack_all, hack_all_shutdown } from '/controller/modules/hack/hack_all.js';
import { hack_locally_basic, hack_locally_basic_shutdown } from '/controller/modules/hack/hack_locally_basic.js';
import { hack_locally_advanced, hack_locally_advanced_shutdown } from '/controller/modules/hack/hack_locally_advanced.js';
import { run_command } from '/controller/utilities/commands.js';


const hack_watcher_filename = "/controller/modules/hack/hack_watcher.js";
const formulas_filename = "Formulas.exe";

/** @param {NS} ns **/
function start_watcher(ns) {
    const host = ns.getHostname();
    if (!ns.isRunning(hack_watcher_filename, host)) {
        exec(ns, hack_watcher_filename, [])
    }
}

/** @param {NS} ns **/
async function start_remote(ns) {
    await hack_all(ns);
}

/** @param {NS} ns **/
async function start_local(ns) {
    const has_formulas = ns.fileExists(formulas_filename, "home");
    if (has_formulas) {
        await hack_locally_advanced(ns);
    } else {
        await hack_locally_basic(ns);
    }
}

/** @param {NS} ns **/
async function stop_remote(ns) {
    await hack_all_shutdown(ns);
}

/** @param {NS} ns **/
async function stop_local(ns) {
    await hack_locally_advanced_shutdown(ns);
    await hack_locally_basic_shutdown(ns);
}

/** @param {NS} ns **/
async function stop_watcher(ns) {
    // TODO
}

const start_command_list = {
    'watcher': {
        'func': async function(ns) {
            start_watcher(ns);
        },
        'description': "Start hack watcher only"
    },
    'remote': {
        'func': async function(ns) {
            // watcher must be started
            start_watcher(ns);
            await start_remote(ns);
        },
        'description': "Start hacking on remote machines"
    },
    'local': {
        'func': async function(ns) {
            // watcher must be started
            start_watcher(ns);
            await start_local(ns);
        },
        'description': "Start hacking on local machine"
    },
    'all': {
        'func': async function(ns) { 
            start_watcher(ns);
            await start_remote(ns);
            await start_local(ns);
        },
        'description': "Start remote and local hacking"
    }
}

const default_start_command = 'all';

/** @param {NS} ns **/
async function start(ns) {
    ns.print("start hack module");

    // watcher must be started
    exec(ns, hack_watcher_filename, [])
    
    await run_command(ns, ns.args[2], start_command_list, default_start_command);
}

const stop_command_list = {
    'remote': {
        'func': async function(ns) { await stop_remote(ns) },
        'description': "Stop hacking on remote machines"
    },
    'local': {
        'func': async function(ns) { await stop_local(ns) },
        'description': "Stop hacking on local machine"
    },
    'watcher': {
        'func': async function(ns) { await stop_watcher(ns) },
        'description': "Stop hack watcher"
    },
    'all': {
        'func': async function(ns) { 
            await stop_local(ns);
            await stop_remote(ns);
            await stop_watcher(ns);
        },
        'description': "Stop all hacking"
    }
}

const default_stop_command = 'all';

/** @param {NS} ns **/
async function stop(ns) {
    ns.print("stop hack module");
    await run_command(ns, ns.args[2], stop_command_list, default_stop_command);
}

/** @param {NS} ns **/
async function status(ns) {
    ns.print("status hack module");
    // TODO
}

const command_list = {
    'status': {
        'func': async function(ns) { await status(ns) },
        'description': "Get pwning status"
    },
    'start': {
        'func': async function(ns) { await start(ns) },
        'description': "Start hacking"
    },
    'stop': {
        'func': async function(ns) { await stop(ns) },
        'description': "Stop hacking"
    }
}
const default_command = 'start';

/** @param {NS} ns **/
export async function hack_module(ns) {
    ns.print("in hack module");
    await run_command(ns, ns.args[1], command_list, default_command);
}