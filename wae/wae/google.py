from zdrive import Downloader
from zdrive import Uploader

def upload(path, folder_id):
	u = Uploader()
	result = u.uploadFolder(path, max_depth=3, parentId=folder_id)
	print(result)


def download(folder_id, path):
	d = Downloader()
	d.downloadFolder(folder_id, destinationFolder=path)
	