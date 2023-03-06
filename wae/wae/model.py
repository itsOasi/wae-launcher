from wae.shell import RepoList, RepoPath, ModuleList
import wae.shell as shell
import wae.web as web
import wae.helper as helper

class Model:
	def __init__(self, config_loc):
		'''
			The model represents the engine and the 
			filesystem of the current project
		'''
		self._config_loc = config_loc # the location of wae_config.json
		self._repos = RepoList(self._config_loc) # gets all necessary repos
		self._modules = ModuleList(self._config_loc) # reads loads all necessary modules (from repos)
		self.index_page = shell.get_config(self._config_loc, "index_page")

	def clone(self, name):
		self._repos.clone(name)		

	def pull(self, name):
		self._repos.pull(name)		

	def set_index(self, path):
		self.index_page = path

	def load_index(self):
		if self._is_ready():
			return web.render_page(self.index_page)
		else: 
			return web.render_page("index.html")
	
	def get_config(self, key):
		return shell.get_config(self._config_loc, key)

	def _is_ready(self):
		return self.index_page != None

	def repo_list(self):
		return self._repos