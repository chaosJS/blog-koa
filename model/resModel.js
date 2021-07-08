class BaseModel {
	constructor(data, msg) {
		// compe
		if (typeof data === 'string') {
			this.msg = data;
			data = null;
			msg = null;
		}

		if (data) {
			this.data = data;
		}

		if (msg) {
			this.msg = msg;
		}
	}
}

class SuccessModel extends BaseModel {
	constructor(data, msg) {
		super(data, msg);
		this.success = true;
	}
}
class ErrorModel extends BaseModel {
	constructor(data, msg) {
		super(data, msg);
		this.success = false;
	}
}
module.exports = {
	SuccessModel,
	ErrorModel,
};
