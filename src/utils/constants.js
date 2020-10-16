/* eslint-disable no-useless-escape */

export const YOUTUBE_VIDEO_URL_REGEX = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/|\/embed\/.+$/;
export const socketURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_GAE_API_URL;

export const convertURLToYoutubeVideoId = (url) => {
    let id = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if(url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_-]/i);
        id = id[0];
    } else id = url;
    return id;
};