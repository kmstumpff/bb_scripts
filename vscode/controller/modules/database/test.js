import { CommandManager } from './command_manager.js'
import { KdB } from './kdb.js'

const database = new KdB();
database.load('./test_db.txt');
database.save_as('./test_db_save.txt'); // save to different file

const cmd_manager = new CommandManager(database);

// SELECT
console.log(`response: ${cmd_manager.run("SELECT(pwn):WHERE(pwned=true)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(hacked=true):ORDER(host):LIMIT(1)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(hacked=true):ORDER(-host)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(id>=2)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(id>2)")}`);
console.log(`response: ${cmd_manager.run("SELECT(pwn):WHERE(id<=2)")}`);
console.log(`response: ${cmd_manager.run("SELECT(pwn):WHERE(id<2)")}`);
console.log(`response: ${cmd_manager.run("SELECT(pwn):WHERE(id<2)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(hacked!=true)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host=joesguns)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host!=joesguns)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host!=joesguns):LIMIT(1)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host!=joesguns):LIMIT(100)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(hacked<stupid)")}`);

// INSERT
console.log(`response: ${cmd_manager.run("INSERT(hack):VALUES(id=4,host=darkweb,hacked=false)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host=darkweb)")}`);

// UPDATE
console.log(`response: ${cmd_manager.run("UPDATE(hack):WHERE(host=darkweb):VALUES(hacked=true)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host=darkweb)")}`);

// DELETE
console.log(`response: ${cmd_manager.run("DELETE(hack):WHERE(host=darkweb)")}`);
console.log(`response: ${cmd_manager.run("SELECT(hack):WHERE(host=darkweb)")}`);

