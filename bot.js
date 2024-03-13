
const Discord = require('discord.js');
const config = require("./config.json");
const fs = require("fs");
const { log } = require('console');

const client = new Discord.Client({
    intents: 3243533,
});

client.commands = new Discord.Collection();

fs.readdirSync("./slash_commands").forEach((commandfile) => {
    const command = require(`./slash_commands/${commandfile}`);
    client.commands.set(command.data.name, command);
});

const REST = new Discord.REST().setToken(config.token);

(async ()=> {
    try {
        await REST.put(
            Discord.Routes.applicationGuildCommands(config.clientId, config.guildId),
            {
                body: client.commands.map((cmd) => cmd.data.toJSON()),
            }
        );
        console.log(`Loaded ${client.commands.size} slash commands {/}`);
    } catch (error) {
        console.log("Error loading commands.", error);
    }
})();

client.on('ready', async ( client ) => {
    console.log(`Estoy listo!`);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()){
        const command = client.commands.get(interaction.commandName);
        command.execute(interaction).catch(console.error());
    }
})

client.login(config.token);