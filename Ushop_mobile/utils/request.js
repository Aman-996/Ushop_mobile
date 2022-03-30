import baseUrl from "./baseUrl.js"

const http = (options)=>{
	/*
		options = {
			url:"",
			data:{},
			method:"",
			header
		}
	*/ 
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl +options.url,
			method:options.method ||  "GET",
			data:options.data || {},
			header:options.header || {
				"content-type":"application/json"
			},
			success(res) {
				resolve(res)
			},
			fail(error) {
				reject(error)
			},
			
		})
	})
}

export default http