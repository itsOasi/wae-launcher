import requests
from flask import Flask, request
from flask_cors import CORS
from wae import model, helper, google
app = Flask(__name__)

BLOG_DIR = "./assets/innova"
ADMIN_PASSWD = "1234"
wae_model = None
authorized_clients = []

@app.route("/") # loads homepage
def main():
	client = request.headers['Host']
	if client in authorized_clients:
		return wae_model.load_index()
	else:
	    return helper.read_file("auth.html")

@app.route("/auth", methods=["GET", "POST", "OPTIONS"]) # allows slug for the engine to process on the client's device
def auth():
	helper.log(request.form["pass"])
	if request.form["pass"] == ADMIN_PASSWD:
		authorized_clients.append(request.headers["host"])
		return helper.dict_to_json({"login":True})
	return helper.dict_to_json({"login":False})
	
@app.route("/change_pass", methods=["GET", "POST", "OPTIONS"]) # allows slug for the engine to process on the client's device
def change_pass():
	helper.log(request.form["pass"])
	if request.form["old_pass"] == ADMIN_PASSWD and request.headers["host"] in authorized_clients:
		ADMIN_PASSWD = request.form["new_pass"]
		return helper.dict_to_json({"password_changed":True})
	return helper.dict_to_json({"pasword_changed":False})
	

@app.route("/get_latest") # allows slug for the engine to process on the client's device
def get_latest():
	folder = helper.read_dir(BLOG_DIR)
	helper.log(folder)
	return helper.dict_to_json({"list":folder})

@app.route("/get_all") # allows slug for the engine to process on the client's device
def get_all():
	# send latest 10 articles
	articles = {}
	folder = helper.read_dir(BLOG_DIR)
	for item in folder:
		articles[item] = helper.json_to_dict(BLOG_DIR+"/"+item)
	return helper.dict_to_json(articles)

if __name__ == "__main__":
	wae_model = model.Model("wae_config.json") # load static files for the project
	if wae_model.get_config("cors"):
		CORS(app)
	wae_model.clone("assets")
	app.run(host="0.0.0.0", port=8000, debug=True)
