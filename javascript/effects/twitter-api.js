const TWITTER_API_URL = 'https://api.twitter.com/1.1/';
const TIMELINE_ENDPOINT = 'statuses/home_timeline.json';

export function constructOAuthSignature(consumerKey, nonce, signature, timestamp, token) {
  return ```OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${nonce}", oauth_signature="${signature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${timestamp}", oauth_token="${token}", oauth_version="1.0"```;
}

export function generateNonce() {
  return btoa(Math.ceil(Math.random() * 1000000) * Date.now()).replace(/\W/gi, '');
}
