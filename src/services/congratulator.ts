import getRandomGif from './giphy'
import "dotenv/config";
import { sendMessage } from './discord'

const api_key = process.env.GIPHY_API_KEY as string

async function logIt(){
    const result = await getRandomGif(api_key, "success")
    console.log(result)
}

// logIt()
export async function congratulateUser(congratulation: string, username: string){
    // fetch random gif
    // fetch sprint name
    // fetch a message
    // combine username with text and gif and message and sprint
    // send it
    // update history and all necessary tables
    sendMessage(congratulation)
    sendMessage("https://giphy.com/embed/zBP7YW45bKSXI9fPYg")

}
