const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT||3001;

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const { query } = req;

  try {
    console.log("Fetching token prices...");
    
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo
    });

    console.log("Token prices fetched successfully.");

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice.toString(),
      tokenTwo: responseTwo.raw.usdPrice.toString(),
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice
    }

    console.log("Sending response:", usdPrices);
    return res.status(200).json(usdPrices);

  } catch (error) {
    console.error("Error fetching token prices:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then((data) => {
  app.listen(port, () => {
    console.log(`Server is running on port`,port);
  });
});
