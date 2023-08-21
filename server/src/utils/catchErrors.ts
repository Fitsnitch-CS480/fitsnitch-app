export const catchErrors = (endpoint) => {
	// return an express handler
	return async (req, res, next) => {
		try {
			await endpoint(req, res, next)
		}
		catch (error) {
			console.log("Uncaught error thrown from endpoint");
			console.log(error)
			res.status(500).send({success: false, message: "Unknown error", error})
		}
	}
}
