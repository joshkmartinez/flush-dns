#!/usr/bin/env node

const chalk = require(`chalk`);
const os = require(`os`);
const shell = require(`shelljs`);
const OS_TYPE = os.type().toLowerCase();
const ERROR_MSG =
  chalk.red(`Error: DNS Flush failed.`) +
  "\nIf you have a problem, feel free to open an issue at https://github.com/joshkmartinez/flush-dns";
const SUCCESS_MSG = chalk.green(`DNS cache has been flushed.`);

console.log(`Operating platform: ${chalk.blue(OS_TYPE)}
Parent process pid ${chalk.blue(process.ppid)}
${chalk.bold.blue("Attempting to flush DNS cache...")} 
You may be asked to enter your password.`);
try {
  if (
    OS_TYPE !== "darwin" &&
    OS_TYPE !== "win32" &&
    OS_TYPE !== "windows_nt" &&
    OS_TYPE !== "linux"
  ) {
    throw OS_TYPE + "is an unsupported OS";
  }
  if (OS_TYPE == `darwin`) {
    if (
      shell.exec("sudo dscacheutil -flushcache;sudo killall -HUP mDNSResponder")
        .code !== 0
    ) {
      shell.echo(ERROR_MSG);
      shell.exit(1);
      console.log("This tool only supports OS X 10.10.4 and above.");
    } else {
      console.log(chalk.bold.blue(SUCCESS_MSG));
    }
  } else if (OS_TYPE == "win32" || OS_TYPE == "windows_nt") {
    if (shell.exec("ipconfig /flushdns").code !== 0) {
      shell.echo(ERROR_MSG);
      shell.exit(1);
    } else {
      console.log(chalk.blue(SUCCESS_MSG));
    }
  } else if (OS_TYPE == `linux`) {
    if (
      shell.exec(
        "sudo /etc/init.d/dns-clean restart;sudo /etc/init.d/networking force-reload"
      ).code !== 0
    ) {
      shell.echo(ERROR_MSG);
      shell.exit(1);
    } else {
      console.log(chalk.blue(SUCCESS_MSG));
      console.log(`Did you know Ubuntu doesn’t cache DNS entries by default?
    
      If you have installed a DNS service, here are some ways you can clear its' cache:
    ${chalk.green(`
    nsdc: sudo /etc/init.d/nscd restart
    dnsmasq: sudo /etc/init.d/dnsmasq restart
    BIND: sudo /etc/init.d/named restart`)}`);
    }
  }
} catch (error) {
  console.log(
    chalk.bold.red(
      `Error: ${error}` +
        "\nConsider opening an issue. https://github.com/joshkmartinez/flush-dns"
    )
  );
}
