const CLIENT_PORT = 6;
const SERVER_PORT = 7;
	
/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");
	const pwned = ["home"];

	ns.clearPort(CLIENT_PORT);
	ns.clearPort(SERVER_PORT);
	
	while (true) {
		const data = ns.readPort(SERVER_PORT);
		if (data != 'NULL PORT DATA') {
			pwned.push(data);
			ns.print(data);
		} else {
			ns.clearPort(CLIENT_PORT);
			const data = pwned.join(",")
			ns.print(data);
			await ns.writePort(CLIENT_PORT, data);
			await ns.sleep(100);
		}
		await ns.sleep(5);
	}

}

export async function is_pwned(ns, target) {
	var pwned = false;
	var success = false;

	while(!success) {
		var data = ns.readPort(CLIENT_PORT);
		if (data != 'NULL PORT DATA') {
			//ns.print(data)
			pwned = data.includes(target);
			success = true;
		} else {
			await ns.sleep(100);
		}
	}
	return pwned;
}
export async function pwned(ns, target) {
	await ns.writePort(SERVER_PORT, target)
}