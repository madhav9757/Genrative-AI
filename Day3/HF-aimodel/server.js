import "dotenv/config";
import { textToImage } from "@huggingface/inference";
import fs from "fs";

async function generateImage() {
  const image = await textToImage({
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: "Astronaut in a jungle, cold color palette, muted colors, detailed, 8k",
    accessToken: process.env.HF_TOKEN,
  });

  const buffer = Buffer.from(await image.arrayBuffer());
  fs.writeFileSync("output.png", buffer);

  console.log("✅ Image generated successfully");
}

generateImage();
