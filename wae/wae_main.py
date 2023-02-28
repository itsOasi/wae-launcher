import requests
from flask import Flask, request
from flask_cors import CORS
from wae import model, helper, google
app = Flask(__name__)

BLOG_DIR = "./assets/innova"
ADMIN_PASSWD = "1234"
wae_model = model.Model("wae_config.json") # load static files for the project
if wae_model.get_config("cors"):
	CORS(app)
wae_model.clone("assets")

authorized_clients = []

@app.route("/") # loads homepage
def main():
	client = request.headers['Host']
	if client in authorized_clients: # if user's browser is recognized
		return wae_model.load_index() # show the dashboard
	else:
	    return helper.read_file("auth.html") # otherwise, user must authorize

@app.route("/auth")
def auth():
	helper.log(request.form["pass"])
	if request.form["pass"] == ADMIN_PASSWD:
		authorized_clients.append(request.headers["host"])
		return helper.dict_to_json({"login":True})
	return helper.dict_to_json({"login":False})
	
@app.route("/change_pass")
def change_pass():
	helper.log(request.form["pass"])
	if request.form["old_pass"] == ADMIN_PASSWD and request.headers["host"] in authorized_clients:
		ADMIN_PASSWD = request.form["new_pass"]
		return helper.dict_to_json({"password_changed":True})
	return helper.dict_to_json({"pasword_changed":False})

@app.route("/resync")
def resync():
	wae_model.clone("")
	return helper.dict_to_json({"resynced_repo":False})

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=8000, debug=True)
