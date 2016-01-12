import { buildFactors, getFeedInfo, highlightTweets } from './lib/highlights';
import fs from 'fs';

const rates = {
  hashtag: 0.03,
  author: 0.05,
  linkHost: 0.1,
  hasLink: 0.01,
  hasImage: 0.001,
  retweet_count: 2,
  favorite_count: 1.3
};

const ignoredLinkHosts = [
  /twitter.com/,
  /buff.ly/,
  /dlvr.it/,
  /bit.do/,
  /t.co/,
  /lnkd.in/,
  /db.tt/,
  /qr.ae/,
  /adf.ly/,
  /goo.gl/,
  /bitly.com/,
  /cur.lv/,
  /tinyurl.com/,
  /ow.ly/,
  /bit.ly/,
  /adcrun.ch/,
  /ity.im/,
  /q.gs/,
  /viralurl.com/,
  /is.gd/,
  /vur.me/,
  /bc.vc/,
  /twitthis.com/,
  /u.to/,
  /j.mp/,
  /buzurl.com/,
  /cutt.us/,
  /u.bb/,
  /yourls.org/,
  /crisco.com/,
  /x.co/,
  /prettylinkpro.com/,
  /viralurl.biz/,
  /adcraft.co/,
  /virl.ws/,
  /scrnch.me/,
  /filoops.info/,
  /vurl.bz/,
  /vzturl.com/,
  /lemde.fr/,
  /qr.net/,
  /1url.com/,
  /tweez.me/,
  /7vd.cn/,
  /v.gd/,
  /dft.ba/,
  /tr.im/,
  /tinyarrows.com/
];

/* eslint-disable */
const factors = {
  "hashtags": {
    "JavaScript": 1,
    "travel": 1,
    "frequentflyer": 1,
    "traveltips": 1,
    "dataloader": 1,
    "haskell": 1,
    "reactjs": 1,
    "reactnative": 2,
    "generators": 1,
    "promises": 1,
    "clojurescript": 1,
    "spacex": 1,
    "Falcon9": 1,
    "b_": 1,
    "engineering": 1,
    "LL_proverbs": 1,
    "LL_slang": 2,
    "LL_idioms": 1,
    "London": 1,
    "NYC": 1,
    "Istanbul": 1,
    "Mumbai": 1,
    "SaoPaulo": 1,
    "Nightlife": 1,
    "JordanHangar": 1,
    "TeamKoF": 1,
    "LL_words": 2,
    "DevConf": 1,
    "LessCSS": 1,
    "btconf": 1,
    "Casio": 3,
    "GA100C": 1,
    "GShock": 3,
    "Nike": 4,
    "NikeAirFlightposite": 1,
    "GBX6900B2": 1,
    "GDX6930E": 1,
    "NikeAirForce1": 1,
    "NikeAirForce1Downtown": 1,
    "NikeAirForce1DowntownHi": 1,
    "bash": 1,
    "NikeAirJordan": 1,
    "NikeAirJordanSuperFly": 1,
    "NikeAirJordanSuperFly2": 1,
    "Reebok": 1,
    "ReebokPump": 1,
    "ReebokPumpOmniZone": 1,
    "Россия": 1,
    "Словения": 1,
    "Сочи2014": 1,
    "Олимпиада": 1,
    "NikeSB": 1,
    "NikeSBDunkLow": 1,
    "Adidas": 1,
    "AdidasOriginals": 1
  },
  "authors": {
    "webnotbombs_by": 3,
    "andrestaltz": 1,
    "openwebdaily": 1,
    "TrendingGithub": 2,
    "michaellnorth": 1,
    "leeb": 1,
    "kentcdodds": 1,
    "Functionalworks": 1,
    "zenorocha": 1,
    "rtfeldman": 1,
    "ThePracticalDev": 1,
    "vanhaol": 1,
    "ponyfoo": 1,
    "planetclojure": 2,
    "andrey_sitnik": 3,
    "SciencePorn": 6,
    "sindresorhus": 3,
    "marijnjh": 1,
    "benschwarz": 1,
    "umaar": 2,
    "backendsecret": 1,
    "ArtemYarulin": 1,
    "GIFs": 1,
    "olivesbb": 1,
    "adme_ru": 4,
    "cosinus46rus": 1,
    "sharondio": 1,
    "HugoGiraudel": 1,
    "ihorzenich": 1,
    "toivonens": 1,
    "jasongay": 1,
    "n1k0": 1,
    "dimensionmedia": 1,
    "sbmaxx": 1,
    "bobuk": 1,
    "theigel": 1,
    "addyosmani": 4,
    "flipzagging": 1,
    "fivetanley": 1,
    "kukutz": 1,
    "danthat": 1,
    "ondrek": 1,
    "HistoricalPics": 2,
    "dave1010": 1,
    "alebak": 1,
    "anatudor": 1,
    "thesifter": 1,
    "iamdustan": 1,
    "smashingmag": 2,
    "iLLuzor": 1,
    "LingualeoRus": 11,
    "Bazulja": 1,
    "stephane_m_": 1,
    "pukhalski": 1,
    "shuvalov_anton": 1,
    "RichardHammond": 1,
    "horse_habr": 1,
    "ryber": 1,
    "miripiruni": 2,
    "alexmak": 1,
    "igrigorik": 1,
    "lrnrd": 1,
    "SamBehnam": 1,
    "kinduff": 1,
    "mieky": 1,
    "edanilov": 1,
    "hot_fact": 1,
    "CuteEmergency": 1,
    "socium_hate": 1,
    "ThingsWork": 1,
    "jkaraian": 1,
    "MaxCRoser": 1,
    "fliptheweb": 1,
    "benbjohnson": 1,
    "krlsrg": 1,
    "MeredithFrost": 1,
    "SneakerNews": 15,
    "GShock_US": 1,
    "kicksonfire": 4,
    "alexbaumgertner": 1,
    "WalterStephanie": 1,
    "kennelliott": 1,
    "webstandards_up": 1,
    "rdvornov": 3,
    "iboRuliT": 1,
    "gnuaesthetic": 1,
    "nikmd23": 1,
    "sw1tch": 1,
    "davidwalshblog": 1,
    "andy_one": 1,
    "tonyganch": 2,
    "alexquez": 1,
    "bigpictureru": 6,
    "andreysitnik": 2,
    "DmitryBaranovsk": 1,
    "alexbadaloff": 1,
    "andrewsmatt": 1,
    "jazer": 1,
    "Real_CSS_Tricks": 1,
    "gurugray": 1,
    "max_katz": 1,
    "benjaminnickel": 1,
    "chriscoyier": 1,
    "Perspective_pic": 2,
    "Iearnsomething": 1,
    "BenNadel": 1,
    "JeremyClarkson": 1,
    "RWD": 1,
    "microbash": 2,
    "pepelsbey": 2,
    "HistoryInPics": 2,
    "thijs": 1,
    "usolt": 1,
    "neiltak": 1,
    "StyleRumorRu": 9,
    "vogon": 1,
    "umputun": 1,
    "unel86": 1,
    "SilentImp": 1,
    "Laserda1": 1,
    "sportsru": 1,
    "Fake_MIDRF": 1
  },
  "linkHosts": {
    "medium.com": 1,
    "webplatformdaily.org": 1,
    "github.com": 4,
    "benjamine.github.io": 1,
    "atom.io": 1,
    "packagecontrol.io": 1,
    "thepracticaldev.com": 1,
    "futurice.com": 1,
    "ponyfoo.com": 1,
    "umaar.com": 1,
    "ministryofgifs.org": 1,
    "www.adme.ru": 2,
    "www.wired.com": 1,
    "delka.github.io": 1,
    "devopsreactions.tumblr.com": 1,
    "gabinaureche.com": 1,
    "viatcheslav.livejournal.com": 1,
    "ep1c.org": 1,
    "keithclark.co.uk": 1,
    "std3.ru": 1,
    "reddit.com": 1,
    "qz.com": 1,
    "air.nullschool.net": 1,
    "detstvo-design.ru": 1,
    "books.nationalgeographic.com": 1,
    "sneakernews.com": 6,
    "kickson.fr": 2,
    "www.artlebedev.ru": 1,
    "onlywei.github.io": 1,
    "jonibologna.com": 1,
    "slate.me": 1,
    "tjvantoll.com": 1,
    "haxiomic.github.io": 1,
    "www.algomation.com": 1,
    "speakerdeck.com": 1,
    "www.nytimes.com": 1,
    "gist.github.com": 1,
    "chrome.google.com": 1,
    "en.wikipedia.org": 1,
    "mmag.ru": 1,
    "codepen.io": 1,
    "jakearchibald.github.io": 1,
    "stackoverflow.com": 1,
    "jsfiddle.net": 1,
    "csspre.com": 1,
    "bjam.in": 1,
    "bigpicture.ru": 1,
    "m.ebay.com": 1,
    "stylerumor.ru": 9,
    "www.sports.ru": 1
  },
  "hasLink": 66,
  "hasImage": 128
};
/* eslint-enable */

function printHighlights(highlights) {
  highlights.forEach((hl) => {
    console.log('Text: ', hl.text); // eslint-disable-line
    console.log('Url: ', hl.urls[0] ? hl.urls[0].expanded_url : 'empty  ' ); // eslint-disable-line
    console.log(''); // eslint-disable-line
    console.log('Full Info: ', hl); // eslint-disable-line
    console.log('---------------'); // eslint-disable-line
    console.log(''); // eslint-disable-line
  });
}

fs.readFile('./../data/feed.json', function (err, data) {
  if (err) console.error(err); // eslint-disable-line

  const feedInfo = getFeedInfo(JSON.parse(data));

  // console.log(JSON.stringify(buildFactors(feedInfo, ignoredLinkHosts, factors), ' ', 2)); // eslint-disable-line

  printHighlights(highlightTweets(feedInfo, ignoredLinkHosts, factors, rates));
});
