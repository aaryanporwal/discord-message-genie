const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
});

const fs = require("fs");

if (!fs.readdirSync(".").includes("msgs.json")) {
  fs.writeFileSync("msgs.json", "{}");
}

client.msgs = require("./msgs.json");

let prefix = "!";

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(`${prefix}write `)) {
    // sample message: "!write lennyface ( ͡° ͜ʖ ͡°)"

    await message.react("🧞");
    let customMessageValue = message.content.split(" ").slice(2).join(" ");
    // extract second word from a string
    let customMessageName = message.content.split(" ").slice(1, 2).join(" ");

    if (client.msgs[message.author.id] == undefined) {
      client.msgs[message.author.id] = {};
    }
    client.msgs[message.author.id][customMessageName] = customMessageValue;

    fs.writeFile("./msgs.json", JSON.stringify(client.msgs, null, 4), (err) => {
      if (err) throw err;
      message.channel.send("Message written successfully ✍"); // sends a message to the Discord channel
    });
  }

  if (message.content.startsWith(`${prefix}get `)) {
    // sample message: "!get lennyface"

    await message.react("🧞");
    let getMessage = message.content.slice(5); // 5 chars from `!get ...`
    let _msg = client.msgs[message.author.id][getMessage];
    message.channel.send(_msg);
  }

  if (message.content.startsWith(`${prefix}delete `)) {
    await message.react("🧞");
    let getMessage = message.content.slice(8);
    delete client.msgs[message.author.id][getMessage];

    fs.writeFileSync("./msgs.json", JSON.stringify(client.msgs));
    message.channel.send(`${getMessage} deleted successfully ♻`);
  }

  if (message.content == `${prefix}list`) {
    await message.react("🧞");
    var messageList = "";
    for (var key in client.msgs[message.author.id]) {
      messageList += key + `\n `;
    }
    message.channel.send(messageList);
  }

  if (message.content.startsWith(`${prefix}help`)) {
    await message.react("🧞");
    message.channel.send(`
    **Commands:**
    ${prefix}write <name> <value> - writes a custom message
    ${prefix}get <name> - gets a custom message
    ${prefix}delete <name> - deletes a custom message
    ${prefix}list - lists all custom messages
    
    `);
  }
});

client.login(token);
