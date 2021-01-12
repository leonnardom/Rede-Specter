const { CommandLoader, Command } = require("../structures/CMD/");
const { readdir } = require("fs");
const { promisify } = require('util');

const fs = require("fs");
const DIR_COMMANDS = 'src/commands';

module.exports = class CommandsLoader extends CommandLoader {
    constructor(client) {
        super(client)
        this.name = 'CommandsLoader'
        this.client = client
        this.commands = {
            all: new client.collection,
            subcommands: new client.collection,
            categories: [],
            load: async(cmd) => { return await this.CommandLoad(cmd) }
        }
    }

    async call() {
        this.client.commands = this.commands;
        return this.ViewCommands().then(() => this.client.LOG('All commands successfully loaded', 'COMMANDS'));
    }

    async ViewCommands(dirPath = DIR_COMMANDS, subCommand = false, arr = []) {
        const FOLDERS = await CommandsLoader.readdir(dirPath);

        if (FOLDERS) {
            if (subCommand && dirPath !== DIR_COMMANDS) {
                for (const FILE of FOLDERS) {
                    if (FILE.endsWith('.js')) {
                        arr.push({ file: FILE, dir: (`${dirPath}/${FILE}`) })
                    }
                }
                return this.addSubCommands(arr);
            }

            await Promise.all(FOLDERS.map(FOLDER => {
                this.client.commands.categories.push({
                    size: 0,
                    name: FOLDER
                });
                readdir((`${dirPath}/${FOLDER}`), async(err, FILES, numFile = 0, ARRAY_CONTENT = []) => {
                    if (!FILES) return;
                    while (FILES.length > numFile) {
                        const file = FILES[numFile];
                        ARRAY_CONTENT.push({ fileName: file, fileFolder: FOLDER });
                        ++numFile
                    }
                    return this.pushCommands(ARRAY_CONTENT);
                })
            }))
            return true;
        }
    }

    async pushCommands(FILES) {
        for (const FILE of FILES) {
            if (FILE.fileName.endsWith('.js')) {
                this.addCommand({ file: FILE.fileName, dir: (`${DIR_COMMANDS}/${FILE.fileFolder}/${FILE.fileName}`), folder: FILE.fileFolder });
            } else {
                this.ViewCommands((`${DIR_COMMANDS}/${FILE.fileFolder}/${FILE.fileName}`), true)
            }
        }
        return true;
    }

    addSubCommands(subcommands) {
        for (const subcommand of subcommands) {
            try {
                const requireSubCommand = require(`../../${subcommand.dir}`);
                const SubCommand = new requireSubCommand(this.client);

                if (!(SubCommand instanceof Command)) {
                    this.client.LOG_ERR(this.name, `FILE ${file}`, 'SUBCOMMAND', 'No SubCommand!')
                    break;
                }

                if (!this.client.commands.subcommands.get(SubCommand.category)) {
                    this.client.commands.subcommands.set(SubCommand.category, new this.client.collection);
                }

                this.client.commands.subcommands.get(SubCommand.category).set(SubCommand.name, SubCommand);
            } catch (err) {
                this.client.LOG_ERR(err, this.name, `FILE ${subcommand.file}`, 'SUBCOMMAND')
            }
        }
    }

    async addCommand({ file, dir, folder }, error = false) {
        if (file.endsWith('.js')) {
            try {
                await require(`../../${dir}`);
            } catch (err) {
                error = true
                this.client.LOG_ERR(err, this.name, `FILE ${file}`);
            } finally {
                if (!error) {
                    try {
                        const requireCommand = require(`../../${dir}`);
                        const command = new requireCommand(this.client);

                        if (!(command instanceof Command)) {
                            return this.client.LOG_ERR(this.name, `FILE ${file}`, 'No Command!')
                        }

                        ++this.client.commands.categories.find(({ name }) => (
                            name === folder
                        )).size

                        return this.client.commands.all.set(command.name, {
                            commandHelp: command,
                            commandDirectory: dir
                        })
                    } catch (err) {
                        this.client.LOG_ERR(err, this.name, `FILE ${file}`);
                    }
                }
            }
        }
        return true;
    }
}

module.exports.readdir = promisify(fs.readdir);