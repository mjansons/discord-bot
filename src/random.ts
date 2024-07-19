import getRandomGif from './giphy'
import "dotenv/config";

const api_key = process.env.GIPHY_API_KEY as string

async function logIt(){
    const result = await getRandomGif(api_key, "success")
    console.log(result)
}

logIt()

