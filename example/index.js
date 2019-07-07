import VirtualList from "../lib/virtual-list.js";
import TypeAhead from "../lib/typeahead.js";

class Main {
	constructor() {
		this.allData = [];
		for (var i = 0; i < 100000; i++) {
			this.allData.push({index: i, title: `i am best - ${i}`, subtitle: `i am sub ${i}`});
		}

		this.typeahead = new TypeAhead();
		this.handleSearchMovie();
	}

	renderList(data) {
		var list = new VirtualList(document.getElementById("container"), {
		  items: data,
		  itemPadding: 10,
		  renderItem: function(row) {
		    return `
		    	<div class="card">
		    		<div> ${row.title} </div>
		    		<div> ${row.subtitle} </div>
		    	</div>
		    `;
		  }
		});
	}

	handleSearchMovie() {
		let inputElement = document.getElementById("search-movie");
		let handleCB = this.typeahead.getCallback({
			url: `https://api.themoviedb.org/3/search/movie?api_key=211c82a0d555bd5261131d22b761ce29&language=en-US&page=11&query={query}`,
			successCB: (response) => {
				if(response.results.length) {
					this.renderList(response.results);
				}
			},
			errorCB: (error) => {
				console.log("This is the error ", error);
			},
			abortCB: () => {
				console.log("This is the abort");
			},
			waitTime: 1300
		});
		inputElement.addEventListener("keyup", handleCB);
	}
}

var main = new Main();