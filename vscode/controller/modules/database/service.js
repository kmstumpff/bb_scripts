import { DATABASE_COMMAND_PORT, DATABASE_RESPONSE_PORT, DATABASE_COMMAND_LOCK_PORT } from '/controller/consts/ports.js';
import { CommandManager } from '/controller/modules/database/command_manager.js'
import { KdB } from '/controller/modules/database/kdb.js'
import { remote_log, LOG_LEVELS } from '/controller/modules/logger/remote_logger.js';


async function run(ns, filename) {
    await remote_log(ns, "running database service");

    ns.clearPort(DATABASE_COMMAND_LOCK_PORT);
    await ns.writePort(DATABASE_COMMAND_LOCK_PORT, "lock");
    ns.clearPort(DATABASE_RESPONSE_PORT);
    ns.clearPort(DATABASE_COMMAND_PORT);

    const database = new KdB(ns);

    if (filename) {
        database.load(filename);
    }

    const cmd_manager = new CommandManager(database);

    while (true) {
        const command = ns.readPort(DATABASE_COMMAND_PORT);
        if (command != 'NULL PORT DATA') {
            ns.print(command);
            const response = cmd_manager.run(command);
            ns.clearPort(DATABASE_RESPONSE_PORT);
            ns.print(response);
            await ns.writePort(DATABASE_RESPONSE_PORT, response);
            await ns.writePort(DATABASE_COMMAND_LOCK_PORT, "lock");
        }
        await ns.sleep(20);
    }
}

async function lock_wait(ns) {
    let locked = false;
    while (!locked) {
        const data = ns.readPort(DATABASE_COMMAND_LOCK_PORT);
        if (data == 'lock') {
            locked = true;
        } else {
            await ns.sleep(100);
        }
    }
}

/** @param {NS} ns **/
export async function send(ns, cmd) {
    ns.print(cmd);
    await lock_wait(ns);
    await ns.writePort(DATABASE_COMMAND_PORT, cmd);
    let response = null;
    while (true) {
        await ns.sleep(20);
        const res = ns.readPort(DATABASE_RESPONSE_PORT);
        if (res != 'NULL PORT DATA') {
            ns.print("got response:");
            ns.print(res);
            response = res;
            break;
        }
    }
    return JSON.parse(response);
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep");

    const file = ns.args[0];

    await run(ns, file);

}