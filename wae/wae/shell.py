from distutils.command.config import config
import shutil
from wae import helper, os, json

# def login_with_github()

def clear_dir(path):
    print(helper.log(f"clearing directory at {path}"))
    try:
        helper.cmd(f"echo y | rmdir /s {path}") # remove static folder contents
    except:
        print(helper.log_lvl("error clearing directory", 1))

def clone_here(repo, location):
    print(helper.log(f"cloning from {repo}"))
    try:
        clear_dir(location)
        helper.cmd(f"git clone {repo} ./{location}") # clone repo into location
        return f"./{location}"
    except:
        print(helper.log_lvl("could not clone repo", 2))
        return False
	
def pull_repo(repo):
    print(helper.log(f"pulling from {repo}"))
    try:
        helper.cmd(f"git pull {repo}")
        return True
    except:
        print(helper.log("could not pull repo", 2))
        return False

def create_file(name, data):
    helper.write_file(name, data, "wb+")

def set_config(config_loc, key, value):
    data = helper.read_file(config_loc) # open config file
    config = json.loads(data) # parse json data
    config[key] = value # set key value
    helper.write_file(config_loc, json.dumps(config)) # apply to config file


def get_config(config_loc, key):
	try:
		data = helper.read_file(config_loc) # open config file
		config = json.loads(data) # parse json
		return config[key] # return key value
	except:
		return None

class RepoPath:
	def __init__(self, repo, path) -> None:
		'''
			A repo paired with the path it should be cloned into
		'''
		self._repo = repo
		self._path = path
	
	def clone(self):
		clone_here(self._repo, self._path)

	def pull(self):
		pull_repo(self._repo)

	def clear(self):
		helper.del_file(self._path)
        
class RepoList:
	def __init__(self, config_path) -> None:
		self._repos = {}
		self.read_config(config_path)

	def add_repo_path(self, name, repo, path):
		self._repos[name] = RepoPath(repo, path)

	def clear_repo(self, name):
		self._repos[name].clear()

	def clone(self, name):
		self._repos[name].clone()

	def pull(self, name):
		self._repos[name].pull()

	def clone_all(self):
		for name, repo in self._repos:
			repo.clone()

	def read_config(self, path):
		repos = get_config(path, "repos")
		# create repo paths from config data
		for name, rp in repos.items():
			self.add_repo_path(name, rp["repo"], rp["path"])

class ModuleList:
    def __init__(self, config_path) -> None:
        '''
            imports modules, calls functions, gets attributes
        '''
        self._modules = {}
    
    def add(self, name, module):
        self._modules[name] = helper.dyn_import(module)
    
    def call(self, name, func, kwargs):
        return self.read(self._modules[name], func)(kwargs)
    
    def read(self, name, attr):
        return getattr(self._modules[name], attr)
    
    def write(self, name, attr, val):
        setattr(self._modules[name], attr, val)

    def read_config(self, path):
        modules = get_config(path, "modules")
        for name, mod in modules:
            self._modules[name] = mod