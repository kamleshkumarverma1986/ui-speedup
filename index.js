import VirtualList from "./src/virtual-list.js";

class Main {
	constructor() {
		this.allData = [];
		for (var i = 0; i < 100000; i++) {
			this.allData.push({index: i, title: `i am best - ${i}`, subtitle: `i am sub ${i}`});
		}
	}

	renderList() {
		var list = new VirtualList({
		  container: document.getElementById("container"),
		  items: this.allData,
		  itemPadding: 10,
		  generatorFn: function(row) {
		    return `
		    	<div class="card">
		    		<div> ${row.title} </div>
		    		<div> ${row.subtitle} </div>
		    	</div>
		    `;
		  }
		});
	}
}

var main = new Main();
main.renderList();