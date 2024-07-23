import getRandomGif from './giphy'
import "dotenv/config";
import { sendMessage } from './discord'

const api_key = process.env.GIPHY_API_KEY as string

async function logIt(){
    const result = await getRandomGif(api_key, "success")
    console.log(result)
}

// logIt()

sendMessage("congrats")
sendMessage("https://giphy.com/embed/zBP7YW45bKSXI9fPYg")


const kaka = {
    data: {
      type: 'gif',
      id: 'zBP7YW45bKSXI9fPYg',
      url: '',
      slug: 'gosimplepower-funny-free-simplepower-zBP7YW45bKSXI9fPYg',
      bitly_gif_url: 'https://gph.is/g/4MXg7vR',
      bitly_url: 'https://gph.is/g/4MXg7vR',
      embed_url: 'https://giphy.com/embed/zBP7YW45bKSXI9fPYg',
      username: 'gosimplepower',
      source: '',
      title: 'Happywednesday Success GIF by Simple Power',
      rating: 'g',
      content_url: '',
      source_tld: '',
      source_post_url: '',
      is_sticker: 0,
      import_datetime: '2024-03-07 18:57:03',
      trending_datetime: '0000-00-00 00:00:00',
      images: {
        original: [Object],
        downsized: [Object],
        downsized_large: [Object],
        downsized_medium: [Object],
        downsized_small: [Object],
        downsized_still: [Object],
        fixed_height: [Object],
        fixed_height_downsampled: [Object],
        fixed_height_small: [Object],
        fixed_height_small_still: [Object],
        fixed_height_still: [Object],
        fixed_width: [Object],
        fixed_width_downsampled: [Object],
        fixed_width_small: [Object],
        fixed_width_small_still: [Object],
        fixed_width_still: [Object],
        looping: [Object],
        original_still: [Object],
        original_mp4: [Object],
        preview: [Object],
        preview_gif: [Object],
        preview_webp: [Object],
        '480w_still': [Object]
      },
      user: {
        avatar_url: 'https://media4.giphy.com/avatars/gosimplepower/1HpCrKY21vYN.png',
        banner_image: '',
        banner_url: '',
        profile_url: 'https://giphy.com/gosimplepower/',
        username: 'gosimplepower',
        display_name: 'Simple Power',
        description: '',
        instagram_url: '',
        website_url: '',
        is_verified: false
      },
      analytics_response_payload: 'e=ZXZlbnRfdHlwZT1HSUZfU0VBUkNIJmNpZD1hYTI5ODY3MGVpOTVwcjE4Ync1Y2lyOGJrNGtzcWlnNDBkcjI0d2hxZXljN2Q0dmcmZ2lmX2lkPXpCUDdZVzQ1YktTWEk5ZlBZZyZjdD1n',
      analytics: { onload: [Object], onclick: [Object], onsent: [Object] },
      alt_text: ''
    },
    meta: {
      status: 200,
      msg: 'OK',
      response_id: 'ei95pr18bw5cir8bk4ksqig40dr24whqeyc7d4vg'
    }
  }
