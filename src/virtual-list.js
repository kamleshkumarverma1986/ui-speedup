class VirtualList {

	constructor(config) {
		if(!(config.container instanceof Element || config.container instanceof HTMLDocument)) {
			throw new Error("Container should be present as DOM node");
		}

		if(!(config.items && Array.isArray(config.items) && config.items.length)) {
			throw new Error("Items should be an array with at least one element");
		}

		if(!config.generatorFn || typeof config.generatorFn !== "function") {
			throw new Error("generatorFn is not valid type");
		}

		this.height = (config.container && config.container.offsetHeight) || 500;
		this.itemPadding = config.itemPadding || 2;
		const itemHeight = this.getItemHeight(config);

		if(itemHeight > this.height) {
			throw new Error("Container's height should be greater than item's height");
		}
		this.itemHeight = itemHeight ? itemHeight : this.height / 2;

		this.items = config.items;
		this.totalRows = config.items && config.items.length;
		this.generatorFn = config.generatorFn;
		
		var totalHeight = this.itemHeight * this.totalRows;

		this.scroller = this.createScroller(totalHeight);
		this.container = this.createContainer(config.container, this.height);

		const VIEWPORT_ITEMS_LENGTH = Math.ceil(this.height / this.itemHeight);
		console.log("VIEWPORT_ITEMS_LENGTH ", VIEWPORT_ITEMS_LENGTH);

		// Cache 3 times the number of items that fit in the container viewport
		const CACHED_ITEMS_LENGTH = VIEWPORT_ITEMS_LENGTH * 3;
		this.renderChunk(this.container, 0, CACHED_ITEMS_LENGTH / 2);

		this.lastRepaintY;
		const MAX_BUFFER = VIEWPORT_ITEMS_LENGTH * this.itemHeight;

		this.container.addEventListener("scroll", (e) => {
			const scrollTop = e.target.scrollTop;
		    console.log("scrollTop ", scrollTop);

		    var first = parseInt(scrollTop / this.itemHeight) - VIEWPORT_ITEMS_LENGTH;
		    console.log("first ", first);
		    first = first < 0 ? 0 : first;
		    if (!this.lastRepaintY || Math.abs(scrollTop - this.lastRepaintY) > MAX_BUFFER) {
		      this.renderChunk(this.container, first, CACHED_ITEMS_LENGTH);
		      this.lastRepaintY = scrollTop;
		    }

		    e.preventDefault && e.preventDefault();
		});
	}

	getItemHeight(config) {
		config.container.innerHTML = config.generatorFn(config.items[0]);
		const itemHeight = config.container.children[0].offsetHeight;
		config.container.innerHTML = "";
		return itemHeight;
	}

	renderChunk(node, fromPos, howMany) {
		const fragment = document.createDocumentFragment();
		fragment.appendChild(this.scroller);

		let finalItem = fromPos + howMany;
		if (finalItem > this.totalRows) {
			finalItem = this.totalRows;
		} 

		for (var i = fromPos; i < finalItem; i++) {
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = this.generatorFn(this.items[i]);
			const listElement = tempDiv.children[0];
			listElement.setAttribute('style', `position:absolute !important; top: ${i*this.itemHeight}px; height: ${this.itemHeight - this.itemPadding}px`);
			fragment.appendChild(tempDiv.children[0]);
		}

		node.innerHTML = "";
		node.appendChild(fragment);
	}

	createContainer(element, h) {
	  element.style.height = `${h}px`;
	  element.style.overflow = "auto";
	  element.style.position = "relative";
	  return element;
	}

	createScroller(h) {
	  const scroller = document.createElement("div");
	  scroller.style.opacity = 0;
	  scroller.style.position = "absolute";
	  scroller.style.top = 0;
	  scroller.style.left = 0;
	  scroller.style.width = "1px";
	  scroller.style.height = `${h}px`;
	  return scroller;
	}
}

export default VirtualList;