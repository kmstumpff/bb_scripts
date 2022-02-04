

/** @param {NS} ns **/
async function help(ns, command, command_list) {
    const command_arg = command;
    if (command_arg == null) {
        ns.print(`Unknown command: ${command_arg}`);
    }
    for (const command in command_list) {
        ns.print(`${command}: ${command_list[command]['description']}`);
    }
    ns.print("help: Show help");
}

/** @param {NS} ns **/
export async function run_command(ns, command, command_list, default_command) {
    let command_arg = command;

    if (!command_arg) {
        command_arg = default_command;
    }

    const cmd = command_list[command_arg];
    if (!!cmd) {
        ns.print(command_arg);
        await cmd['func'](ns);
    } else {
        await help(ns, command_arg, command_list);
    }

}