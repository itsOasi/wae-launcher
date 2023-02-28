from waitress import serve
from wae_main import app

serve(app, listen="*:8080")
