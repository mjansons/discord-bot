interface GiphyResponse {
  data: {
    images: {
      original: {
        url: string;
      };
    };
  };
}

export default async function getRandomGif(api_key: string, tag: string) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=${tag}&rating=pg-13`
  );
  if (!response.ok) {
    throw new Error("Couldn't fetch a GIF!");
  }
  const parsedResponse = (await response.json()) as GiphyResponse;
  return parsedResponse.data.images.original.url;
}

export type GifService = (api_key: string, tag: string) => Promise<string>;
