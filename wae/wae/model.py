import shell, web, helper
from shell import RepoList, RepoPath, ModuleList
from web import Response, ResponseList
from wae.wae.helper import del_file

class Model:
	def __init__(self, config_loc):
		'''
			The model represents the engine and the 
			filesystem of the current project
		'''
		self._config_loc = config_loc # the location of wae_config.json
		self._repos = RepoList(self._config_loc) # gets all necessary repos
		self._modules = ModuleList(self._config_loc) # reads loads all necessary modules (from repos)
		self._responses = ResponseList() # responses handle requests from the client
		self._ready = self._load_proj()
		self.index_page = shell.get_config(self._config_loc, "index_page")

	def clone(self, repo, location):
		shell.clone_here(repo, location)		

	def set_index(self, path):
		self.index_page = path

	def load_index(self):
		if self._ready:
			return web.render_page(self.index_page)
		else: 
			return helper.log("could not load index: not ready", 2)
	

	def repo_list(self):
		return self._repos
	
	def check_responses(self, term, kwargs):
		return self._responses.check(term, kwargs)
			