from urllib import request
from flask import Flask, request
from wae import model
app = Flask(__name__)

wae_model = None

@app.route("/") # loads homepage
def no_slug():
    return wae_model.load_index()

@app.route("/<slug>", methods=["GET", "POST", "OPTIONS"]) # allows slug for the engine to process on the client's device
def main(slug):
    if request.method == "post":
        req = request.form
        return wae_model._responses.check(req["term"], req["data"])
    return wae_model.load_index()

if __name__ == "__main__":
    wae_model = model.Model("wae_config.json") # load static files for the project
    app.run(host="0.0.0.0", port=5000, debug=True)
