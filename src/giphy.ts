interface GiphyResponse {
    data: {
        images: {
            downsized: {
                url: string;
            };
        };
    };
}

export default async function getRandomGif(api_key: string, tag: string) {
    try {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=${tag}&rating=pg-13`
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const parsedResponse = (await response.json()) as GiphyResponse;
        return parsedResponse.data.images.downsized.url;
    } catch (error) {
        console.error(
            "There has been a problem with your fetch operation:",
            error
        );
    }
}
