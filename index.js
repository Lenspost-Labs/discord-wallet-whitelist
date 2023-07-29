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

const dotenv = require("dotenv");
dotenv.config();

const db = require("./db");

client.on(Events.MessageCreate, async (interaction) => {
  await db.connect();
  // console.log(interaction)
  console.log(interaction.content);
  let content = interaction.content;

  if (content.startsWith("c")) {
    content = content.split(" ")[1];
    console.log(content);

    let contract = await db.get("contract");

    if (!contract) contract = [];
    else contract = JSON.parse(contract);

    contract.push(content);

    await db.set("contract", JSON.stringify(contract));

    interaction.react("👍");
    await db.disconnect();
    return;
  }

  let address = await db.get("address");

  if (!address) address = [];
  else address = JSON.parse(address);

  address.push(content);

  await db.set("address", JSON.stringify(address));

  interaction.react("👍");
  await db.disconnect();
});

client.on(Events.ClientReady, () => {
  console.log("I am ready!");
});

client.login(process.env.BOT_TOKEN);
