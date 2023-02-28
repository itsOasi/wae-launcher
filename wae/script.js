let http = {
	get: async(url) =>
	{
		let res = await fetch(url)
		return await res
	},
	post: async(url, data) => {
		let res = await fetch(url, {
			method: "post",
			body: data
		})
		return await res
	}

}

document.querySelector("#get_articles").onclick = async function(){
	let res = await http.get("/get_all");
	let res_text = await res.text()
	document.body.append(Object.keys(JSON.parse(res_text)));
}
document.querySelector("#get_list").onclick = async function(){
	let res = await http.get("/get_latest");
	let res_text = await res.text()
	document.body.append(Object.keys(JSON.parse(res_text)));
}