function AMapWX(params){
	return new Promise((resolve, reject)=>{
		uni.getLocation({
			success(data) {
				let location = data.longitude+','+data.latitude
				uni.request({
					url:'https://restapi.amap.com/v3/geocode/regeo',
					data:{
						key:params.key,
						location
					},
					success({data}) {
						resolve({data,location})
					}
				})
			}
		})
		
		
	})
}
module.exports.AMapWX=AMapWX;