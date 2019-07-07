class TypeAhead {

	constructor() {
		 this.getDataCB = this.getData();
	}

	getCallback({url, requestHeader, successCB, errorCB, abortCB, waitTime=TypeAhead.WAIT_TIME}) {
		if(!url) {
			throw new Error(`URL should be valid`);
		}
		return this.debounce((event) => {
			if(event.target.value) {
				const URL = url.replace(`{query}`, event.target.value);
				this.getDataCB(URL, requestHeader, successCB, errorCB, abortCB);
			}
		}, waitTime);
	}

	debounce(cb, waitTime) {
		var timeout;
		return function() {
			let args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				cb.apply(this, args);
			}, waitTime);
		}
	}

	getData() {
		let xhr = null;
		return function(URL, requestHeader, successCB, errorCB, abortCB) {
			if (xhr) {
		       xhr.abort();
		       xhr = null;
		    }
			xhr = new XMLHttpRequest();
			xhr.open("GET", URL, true);
			if(requestHeader) {
				for(const key in requestHeader) {
					xhr.setRequestHeader(key, requestHeader[key]);
				}
			}
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(successCB) {
						successCB(JSON.parse(xhr.responseText));
					}
				}
			}
			xhr.onerror = () => {
				if(errorCB) {
					xhr.responseText? errorCB(JSON.parse(xhr.responseText)): errorCB("Network Error");
				}
			}
			xhr.onabort = () => {
				if(abortCB) {
					abortCB();
				}
			}
			xhr.send();
		}
		
	}

}

/* All CONSTANTS */
Object.defineProperties(TypeAhead, {
	WAIT_TIME: {
		value: 3000, /* 3 sec */
		writable : false,
		enumerable : false,
		configurable : false
	}
});

export default TypeAhead;