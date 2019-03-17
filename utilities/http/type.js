"use strict";

const PLAIN = 'text/plain';
const HTML = 'text/html';
const RTF = 'text/rtf';

const BMP = 'image/bmp';
const GIF = 'image/gif';
const JPEG = 'image/jpeg';
const PNG = 'image/png';
const SVG = 'image/svg+xml';
const TIFF = 'image/tiff';

const WORD = 'application/msword';
const PDF = 'application/pdf';
const ANDROID_APK = 'application/vnd.android.package-archive';
const FORM = 'application/x-www-form-urlencoded';
const _JSON = 'application/json';
const COMPRESSED = 'application/x-compressed';
const GZIP = 'application/x-gzip';
const ZIP = 'application/zip';

const MPEG = 'audio/mpeg';
const OCTET_STREAM = 'binary/octet-stream';
const MULTIPART = 'multipart/form-data';

module.exports = {
    PLAIN,
    HTML,
    RTF,
    BMP,
    GIF,
    JPEG,
    PNG,
    SVG,
    TIFF,
    WORD,
    PDF,
    ANDROID_APK,
    FORM,
    JSON: _JSON,
    COMPRESSED,
    GZIP,
    ZIP,
    MPEG,
    OCTET_STREAM,
    MULTIPART
};
