from flask import Flask, render_template, request
import feedparser
import datetime
import requests

app = Flask(__name__)

RSS_FEED = {"zhihu": "https://www.zhihu.com/rss",
            "netease": "http://news.163.com/special/00011K6L/rss_newsattitude.xml",
            "songshuhui": "http://songshuhui.net/feed",
            "ifeng": "http://news.ifeng.com/rss/index.xml"}

WEATHERS = {"北京": 101010100,
            "上海": 101020100,
            "广州": 101280101,
            "深圳": 101280601}

DEFAULTS = {'city': '北京',
            'publication': 'zhihu'}


def get_value(key):
    if request.args.get(key):
        return request.args.get(key)
    if request.cookies.get(key):
        return request.cookies.get(key)
    return DEFAULTS[key]


@app.route('/', methods=['GET', 'POST'])
def home():
    publication = get_value('publication')
    city = get_value('city')
    weather_info = weathers[city]
    rss_content = feeds[publication]['entries']
    response = render_template('headhome.html', head=publication, articles=rss_content, weather=weather_info)
    expires = datetime.datetime.now() + datetime.timedelta(days=365)
    response.set_cookie('publication', publication, expires=expires)
    response.set_cookie('city', city, expires=expires)
    return response


def init_feeds():
    feeds = {}
    for key in RSS_FEED:
        feed = feedparser.parse(RSS_FEED[key])
        feeds[key] = feed
    return feeds


def init_weather():
    weather_info = {}
    for city in WEATHERS:
        url = "http://www.weather.com.cn/data/sk/{0}.html".format(WEATHERS[city])
        r = requests.get(url)
        r.encoding = 'utf-8'
        w_data = r.json()['weatherinfo']
        weather_info[city] = w_data
    return weather_info


if __name__ == '__main__':
    feeds = init_feeds()
    weathers = init_weather()
    print(weathers)
    app.run(debug=True)