from flask import Flask, render_template
import feedparser

app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)

API_KEY = 'PLACE YOUR API KEY HERE'

@app.route("/")
def hello_world():
    feed = feedparser.parse('https://www.rotanacareers.com/live-bookmarks/all-rss.xml')
    jobs = [
        {
            'number': i,
            'title': entry.title if 'title' in entry.keys() else '--',
            'city': entry.city if 'city' in entry.keys() else '--',
            'country': entry.country if 'country' in entry.keys() else '--',
            'address': entry.country if 'city' not in entry.keys() else f'{entry.city}, {entry.country}'
        } for i, entry in enumerate(feed.entries)
    ]
    return render_template('main.html', jobs=jobs, API_KEY=API_KEY)