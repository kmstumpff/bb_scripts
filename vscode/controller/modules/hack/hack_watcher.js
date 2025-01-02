const CLIENT_PORT = 8;
const SERVER_PORT = 9;
const PWN_LOCK_PORT = 10;


const BLACKLIST = ["home", "darkweb", "avmnite-02h", "CSEC"];
	
/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("sleep");

	// Add blacklisted machines here
	const pwned = [...BLACKLIST];

	ns.clearPort(CLIENT_PORT);
	ns.clearPort(SERVER_PORT);
	ns.clearPort(PWN_LOCK_PORT);
	await ns.writePort(PWN_LOCK_PORT, "lock");
	
	while (true) {
		const data = ns.readPort(SERVER_PORT);
		if (data != 'NULL PORT DATA') {
			pwned.push(data);
			await ns.writePort(PWN_LOCK_PORT, "lock")
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

async function lock_wait(ns) {
	let locked = false;
	while (!locked) {
		const data = ns.readPort(PWN_LOCK_PORT);
		if (data == 'lock') {
			locked = true;
		} else {
			await ns.sleep(100);
		}
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

export async function get_all_pwned(ns) {
	var pwned = [];
	var success = false;

	while(!success) {
		var data = ns.readPort(CLIENT_PORT);
		if (data != 'NULL PORT DATA') {
			ns.print(data)
			pwned = data.split(',');
			ns.print(pwned)
			success = true;
		} else {
			await ns.sleep(100);
		}
	}

	pwned = pwned.filter( function( name ) {
		return !BLACKLIST.includes( name );
	  } );

	return pwned;
}
export async function pwned(ns, target) {
	await lock_wait(ns);
	await ns.writePort(SERVER_PORT, target)
}