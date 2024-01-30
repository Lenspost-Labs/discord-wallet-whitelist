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

const { PublicKey } = require("@solana/web3.js");

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const guildId = process.env.guildId;
const channelId = process.env.channelId;

const db = require("./db");

function isValidSolanaAddress(address) {
  try {
    new PublicKey(address);
    return true;
  } catch (err) {
    return false;
  }
}

client.on(Events.MessageCreate, async (interaction) => {
  if (interaction.guildId === guildId && interaction.channelId === channelId) {
    try {
      await db.connect();
      console.log(interaction.content);
      let content = interaction.content;
      content.trim();

      let address = await db.get("whitelisted_wallets");
      // console.log(address);
      address = await JSON.parse(address);

      if (!address) address = [];

      console.log(isValidSolanaAddress(content));

      if (
        (content.startsWith("0x") &&
          content.length == 42 &&
          !address.includes(content)) ||
        isValidSolanaAddress(content)
      ) {
        address.push(content);

        await db.set("whitelisted_wallets", JSON.stringify(address));
        address = await db.get("whitelisted_wallets");
        // console.log(address);

        interaction.react("👍");
      } else {
        interaction.react("👎");
      }
      await db.disconnect();
    } catch (error) {
      interaction.react("❗");
      console.log(error);
    }
  }
});

client.on(Events.ClientReady, () => {
  console.log("I am ready!");
});

client.login(process.env.BOT_TOKEN);
