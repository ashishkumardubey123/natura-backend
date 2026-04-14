"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ImageKit = require("imagekit");
const fs = require("fs");
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
module.exports = imagekit;
