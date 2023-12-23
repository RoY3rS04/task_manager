import ImageKit from "imagekit";

const imageKit = new ImageKit({
    publicKey: 'public_yhefXBWs3XFNTqogiGTMvK53aOs=',
    privateKey: <string>process.env.IMAGEKIT_KEY,
    urlEndpoint: <string>process.env.IMAGEKIT_URL
});

export default imageKit;