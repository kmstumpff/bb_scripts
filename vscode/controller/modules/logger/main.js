import { exec_with_tail } from '/controller/utilities/run.js'
import { run_command } from '/controller/utilities/commands.js';
import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';

const ROTATE_LOG_ON_START = true;

const base_log_name = '/controller/remote_log';
const base_log_ext = '.txt';
const log_file = base_log_name + base_log_ext

const remote_log_script = '/controller/modules/logger/remote_logger.js';
const remote_log_args = [log_file]

/** @param {NS} ns **/
async function show(ns) {
    ns.print("show logger module");
    const host = ns.getHostname();
    ns.tail(remote_log_script, host, ...remote_log_args);
}

/** @param {NS} ns **/
async function log(ns) {
    ns.print("log logger module");
    const msg = ns.args[2];
    await remote_log(ns, msg, LOG_LEVELS.DEBUG);
}

/** @param {NS} ns **/
async function rotate(ns) {
    ns.print("rotate logger module");
    const host = ns.getHostname();
    const new_file  = base_log_name + '-' + new Date().getTime() + base_log_ext;
    const log_file_exists = ns.fileExists(log_file, host);
    if (log_file_exists) {
        ns.mv(host, log_file, new_file);
    } else {
        ns.print(`logger module: ${log_file} does not exist`);
    }
}

/** @param {NS} ns **/
async function start(ns) {
    ns.print("start logger module");
    if (ROTATE_LOG_ON_START) {
        await rotate(ns);
    }
    await exec_with_tail(ns, remote_log_script, remote_log_args)
}

/** @param {NS} ns **/
async function stop(ns) {
    ns.print("stop logger module");
    const host = ns.getHostname();
    const is_running = ns.isRunning(remote_log_script, host, ...remote_log_args);
    if (is_running) {
        ns.kill(remote_log_script, host, ...remote_log_args);
    } else {
        ns.print("logger module not running");
    }
}

/** @param {NS} ns **/
async function status(ns) {
    ns.print("Status currently unavailable");
    // TODO
}

const command_list = {
    'status': {
        'func': async function(ns) { await status(ns) },
        'description': "Get logger status"
    },
    'show': {
        'func': async function(ns) { await show(ns) },
        'description': "Display the tail window for the logger"
    },
    'log': {
        'func': async function(ns) { await log(ns) },
        'description': "Log a message to the logger"
    },
    'rotate': {
        'func': async function(ns) { await rotate(ns) },
        'description': "Rotate the logger file using current timestamp"
    },
    'stop': {
        'func': async function(ns) { await stop(ns) },
        'description': "Stop the logger"
    },
    'start': {
        'func': async function(ns) { await start(ns) },
        'description': "Display the tail window for the logger"
    }
}
const default_command = 'start'

/** @param {NS} ns **/
export async function logger_module(ns) {
    ns.print("in status module");
    await run_command(ns, ns.args[1], command_list, default_command);
}