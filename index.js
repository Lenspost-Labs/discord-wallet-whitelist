const {
  Client,
  GatewayIntentBits,
  Events,
  SlashCommandBuilder,
  Collection,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./db");

client.on(Events.MessageCreate, async (interaction) => {
  await db.connect();
  // console.log(interaction)
  console.log(interaction.content);
  //Get the contents of the message
  let content = interaction.content;

  let address = await db.get("whitelisted_wallets");
  address = await JSON.parse(address);
  // console.log(address);

  if (!address) address = [];
  // Push the wallet to be whitelisted
  if (
    content.startsWith("0x") &&
    content.length == 42 &&
    !address.includes(content)
  )
    address.push(content);

  await db.set("whitelisted_wallets", JSON.stringify(address));
  address = await db.get("whitelisted_wallets");
  // console.log(address);

  interaction.react("👍");
  await db.disconnect();
});

client.on(Events.ClientReady, () => {
  console.log("I am ready!");
});

client.login(process.env.BOT_TOKEN);
