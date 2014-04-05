from flask import Flask


app = Flask(__name__)

@app.route("/")
def hello():
    return "This is meter maids"

@app.route("/stuff")
def stuff():
    return "this is some stuff"


if __name__ == '__main__':
    app.run(debug=True)