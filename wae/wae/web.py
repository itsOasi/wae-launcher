from wae import helper, json

class Response:
	def __init__(self, term, callback) -> None:
		'''
			a request term to listen for and corresponding callback
			
		'''
		self._term = term
		self._callback = callback
	
	def check(self, term, kwargs):
		if self._term == term: 
			return self._callback(**kwargs)

class ResponseList:
	def __init__(self) -> None:
		'''
			a list of responses
		'''
		self._responses = []
	
	def _add_response(self, term, callback):
		self._responses.append(Response(term, callback))
	
	def check(self, term, kwargs):
		for response in self._responses:
			return response.check(term, kwargs)

def render_page(page):
	return helper.read_file(page)

