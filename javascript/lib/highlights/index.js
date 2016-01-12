import { pluck, isEmpty, sum, take, any, max } from 'lodash';

/**
 * Extracts host from url.
 *
 * @param {String} href
 *
 * @return {String|Boolean}
 */
export function getHost(href) {
  const match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);

  return match && match[2];
}

/**
 * Prepare tweet data to required format.
 *
 * @param {Object} tweet
 *
 * @return {Object}
 */
export function getTweetData(tweet) {
  return {
    id: tweet.id,
    text: tweet.text,
    retweet_count: tweet.retweet_count,
    favorite_count: tweet.favorite_count,
    hashtags: pluck(tweet.entities.hashtags, 'text'),
    user: tweet.user.screen_name,

    urls: tweet.entities.urls.map((url) => {
      return {
        expanded_url: url.expanded_url,
        display_url: url.display_url,
        host: getHost(url.expanded_url)
      };
    }),

    media: (tweet.entities.media || []).reduce((result, media) => {
      const type = media.type;
      result[type] = result[type] || [];

      result[type].push({
        expanded_url: media.expanded_url,
        display_url: media.display_url,
        media_url: media.media_url,
        media_url_https: media.media_url_https
      });

      return result;
    }, {})
  };
}

/**
 * Iterates over twitter feed and extract tweet data.
 *
 * @param {Array} feed
 *
 * @return {Array}
 */
export function getFeedInfo(feed) {
  return feed.map(getTweetData);
}

/**
 * Increases orig rates for same keys in entry object.
 *
 * @param {Object} orig - current key -> rate map
 * @param {Object} entry - new key -> rate map
 *
 * @return {Object}
 */
export function calcRate(orig, entry) {
  return entry.reduce((result, item) => {
    result[item] = result[item] + 1 || 1;

    return result;
  }, Object.assign({}, orig));
}

/**
 * Increases rate of predicate is true.
 *
 * @param {Number} oldRate
 * @param {Boolean} predicate
 *
 * @return {Number}
 */
export function calcBooleanRate(oldRate, predicate) {
  return predicate ? oldRate + 1 : oldRate;
}

/**
 * Returns list of not ignored links for tweet.
 *
 * @param {Object[]} urls - list of urls
 * @param {RegExp[]} ignoredLinkHosts - list of rules for ingnoring link
 *
 * @return {Object[]}
 */
export function getNotIgnoredLinks(urls, ignoredLinkHosts) {
  return urls.filter((url) => !any(ignoredLinkHosts, (host) => url.host.match(host)));
}

/**
 * Calculates factors which will be used for highlighting tweets.
 *
 * @param {Object[]} feedInfo - processed twitter timeline
 * @param {RegExp[]} ignoredLinkHosts - list of rules for ignoring link
 * @param {Object} factors - initial factors
 *
 * @return {Object}
 */
export function buildFactors(feedInfo, ignoredLinkHosts, factors) {
  return (feedInfo || []).reduce(
    (result, tweet) => {
      const notIgnoredLinks = getNotIgnoredLinks(tweet.urls, ignoredLinkHosts);

      return Object.assign(result, {
        hashtags: calcRate(result.hashtags, tweet.hashtags),
        authors: calcRate(result.authors, [tweet.user]),
        linkHosts: calcRate(result.linkHosts, pluck(notIgnoredLinks, 'host')),
        hasLink: calcBooleanRate(result.hasLink, !isEmpty(notIgnoredLinks)),
        hasImage: calcBooleanRate(result.hasImage, !isEmpty(tweet.media.photo))
      });
    },
    factors
  );
}

/**
 * Apply rate to each entry wich is in factors list.
 *
 * @param {Object} factors
 * @param {Object} entries
 * @param {Number} rate
 *
 * @return {Number}
 */
export function applyRatesToFactors(factors, entries, rate) {
  return entries.reduce((total, current) => total + (factors[current] * rate || 0), 0);
}

/**
 * Caclulates total tweet rate.
 *
 * @param {Object} tweet
 * @param {RegExp[]} ignoredLinkHosts - list of rules for ignoring link
 * @param {Object} factors
 * @param {Object} maxStats - { favorite_count, retweet_count }
 * @param {Object} rates
 *
 * @return {Number}
 */
export function calculateTweetRate(tweet, ignoredLinkHosts, factors, maxStats, rates) {
  return sum([
    0,
    factors.authors[tweet.user] * rates.author,
    applyRatesToFactors(factors.hashtags, tweet.hashtags, rates.hashtags),
    applyRatesToFactors(factors.linkHosts, pluck(tweet.urls, 'host'), rates.linkHost),
    !isEmpty(getNotIgnoredLinks(tweet.urls, ignoredLinkHosts)) && factors.hasLink * rates.hasLink,
    !isEmpty(tweet.media.photo) && factors.hasImage * rates.hasImage,
    rates.retweet_count / (maxStats.retweet_count / tweet.retweet_count),
    rates.favorite_count / (maxStats.favorite_count / tweet.retweet_count)
  ]);
}

/**
 * Sorts tweets by rate.
 *
 * @param {Object} a - tweet 1
 * @param {Object} b - tweet 2
 *
 * @return {Number}
 */
export function sortTweets(a, b) {
  return a.rate > b.rate ? -1 : a.rate < b.rate ? 1 : 0; // eslint-disable-line
}

/**
 * Returns highlighted tweets based on factors and rates.
 *
 * @param {Object[]} feedInfo - processed twitter timeline
 * @param {RegExp[]} ignoredLinkHosts
 * @param {Object} factors
 * @param {Object} rates
 * @param {Number} [amount] - default: 20
 *
 * @return {Object[]}
 */
export function highlightTweets(feedInfo, ignoredLinkHosts, factors, rates, amount = 20) {
  const maxStats = {
    retweet_count: max(feedInfo, 'retweet_count').retweet_count,
    favorite_count: max(feedInfo, 'favorite_count').favorite_count
  };

  return take(feedInfo.map((tweet) => {
    tweet.rate = calculateTweetRate(tweet, ignoredLinkHosts, factors, maxStats, rates);

    return tweet;
  }).sort(sortTweets), amount);
}
