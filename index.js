#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
var shell = require("shelljs");
const os = require("os");
const ERROR_MSG = "Error: DNS Flush failed.";
const SUCCESS_MSG = "DNS cache has been flushed.";
clear();
const OS_TYPE = os.type().toLowerCase();
console.log("Operating platform: " + OS_TYPE + "");
console.log(`The parent process is pid ${process.ppid}`);
console.log(chalk.blue("Flushing DNS cache... "));
console.log("You may be asked to enter your password.");
if (OS_TYPE == "darwin") {
  if (
    shell.exec("sudo dscacheutil -flushcache;sudo killall -HUP mDNSResponder")
      .code !== 0
  ) {
    shell.echo(ERROR_MSG);
    shell.exit(1);
    console.log(
      "This tool is not supported on operating systems lower than OS X 10.10.4"
    );
  } else {
    console.log(chalk.blue(SUCCESS_MSG));
  }
} else if (OS_TYPE == "win32") {
  if (shell.exec("ipconfig /flushdns").code !== 0) {
    shell.echo(ERROR_MSG);
    shell.exit(1);
  } else {
    console.log(chalk.blue(SUCCESS_MSG));
  }
} else if (OS_TYPE == "linux") {
  if (
    shell.exec(
      "sudo /etc/init.d/dns-clean restart;sudo /etc/init.d/networking force-reload"
    ).code !== 0
  ) {
    shell.echo(ERROR_MSG);
    shell.exit(1);
  } else {
    console.log(chalk.blue(SUCCESS_MSG));
    console.log("Did you know Ubuntu doesn’t cache DNS entries by default?");
    console.log(
      "If you have installed a DNS service, here are some ways you can clear its' cache."
    );
    console.log("nsdc: sudo /etc/init.d/nscd restart");
    console.log("dnsmasq: sudo /etc/init.d/dnsmasq restart");
    console.log("BIND: sudo /etc/init.d/named restart");
  }
} else {
  console.log("Your operating system is not supported.");
}
