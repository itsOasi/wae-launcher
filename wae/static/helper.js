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

export default http