from flask import Flask, request, jsonify, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello AI!'


@app.route('/box')
def move_box():
    return 'Box Move'


@app.route('/canvas')
def canvas():
    return render_template('timerCanvas.html')


@app.route('/_add_num')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)


if __name__ == '__main__':
    app.run(port=8013, debug=True)