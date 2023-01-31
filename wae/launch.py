from waitress import serve
from wae import app

serve(app, listen="*:80")
