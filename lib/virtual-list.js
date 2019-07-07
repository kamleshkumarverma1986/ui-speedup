class VirtualList {

	constructor(container, {items, itemPadding=VirtualList.ITEM_DEFAULT_PADDING, renderItem}) {
		if(!(container instanceof Element || container instanceof HTMLDocument)) {
			throw new Error("Container should be present as DOM node");
		}

		if(!(items && Array.isArray(items) && items.length)) {
			throw new Error("Items should be an array with at least one element");
		}

		if(!renderItem || typeof renderItem !== "function") {
			throw new Error("renderItem is not valid type");
		}

		container.setAttribute("style", VirtualList.CONTAINER_STYLE);

		const containerHeight = container.offsetHeight || VirtualList.CONTAINER_DEFAULT_HEIGHT;
		this.itemPadding = itemPadding;
		const itemHeight = this.getItemHeight(container, items, renderItem);

		if(itemHeight > containerHeight) {
			throw new Error("Container's height should be greater than item's height");
		}
		this.itemHeight = itemHeight ? itemHeight : containerHeight / VirtualList.DEFAULT_NUMBER_OF_ITEMS_IN_VIEWPORT;

		this.items = items;
		this.totalRows = items && items.length;
		this.renderItem = renderItem;
		
		const totalHeight = this.itemHeight * this.totalRows;
		this.scroller = this.createScroller(totalHeight);

		const VIEWPORT_ITEMS_LENGTH = Math.ceil(containerHeight / this.itemHeight);
		console.log("VIEWPORT_ITEMS_LENGTH ", VIEWPORT_ITEMS_LENGTH);

		// Cache 3 times the number of items that fit in the container viewport
		const CACHED_ITEMS_LENGTH = VIEWPORT_ITEMS_LENGTH * 3;
		this.renderChunk(container, 0, CACHED_ITEMS_LENGTH / 2);

		this.lastRepaintY;
		container.addEventListener("scroll", (e) => {
			const scrollTop = e.target.scrollTop;
		    let startIndex = parseInt(scrollTop / this.itemHeight) - VIEWPORT_ITEMS_LENGTH;
		    startIndex = startIndex < 0 ? 0 : startIndex;
		    if (!this.lastRepaintY || Math.abs(scrollTop - this.lastRepaintY) > containerHeight) {
		      this.renderChunk(container, startIndex, CACHED_ITEMS_LENGTH);
		      this.lastRepaintY = scrollTop;
		    }
		    e.preventDefault && e.preventDefault();
		});
	}

	getItemHeight(container, items, renderItem) {
		/* innerHTML is always faster than DOM manipulation */
		container.innerHTML = renderItem(items[0]);
		const itemHeight = container.children[0].offsetHeight;
		container.innerHTML = "";
		return itemHeight;
	}

	renderChunk(node, fromPos, howMany) {
		try {
			console.log(`fromPos- ${fromPos} && howMany- ${howMany}`);
			const fragment = document.createDocumentFragment();
			fragment.appendChild(this.scroller);

			let finalItem = fromPos + howMany;
			if (finalItem > this.totalRows) {
				finalItem = this.totalRows;
			} 

			for (let i = fromPos; i < finalItem; i++) {
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = this.renderItem(this.items[i]);
				const listElement = tempDiv.children[0];
				listElement.setAttribute('style', `position:absolute; top: ${i*this.itemHeight}px; height: ${this.itemHeight - this.itemPadding}px`);
				listElement.setAttribute('id', i);
				fragment.appendChild(listElement);
			}

			node.innerHTML = "";
			node.appendChild(fragment);
		}
		catch(error) {
			throw new Error(error);
		}
	}

	createScroller(h) {
	  const scroller = document.createElement("div");
	  scroller.setAttribute("style", VirtualList.SCROLLER_STYLE);
	  scroller.style.height = `${h}px`;
	  return scroller;
	}

}

/* All CONSTANTS */
Object.defineProperties(VirtualList, {
	CONTAINER_STYLE: {
		value: `overflow: auto; position: relative`,
		writable : false,
		enumerable : false,
		configurable : false
	},
	SCROLLER_STYLE: {
		value: `position: absolute; top: 0; left: 0; width: 1px`,
		writable : false,
		enumerable : false,
		configurable : false
	},
	CONTAINER_DEFAULT_HEIGHT: {
		value: 500,
		writable : false,
		enumerable : false,
		configurable : false
	},
	ITEM_DEFAULT_PADDING: {
		value: 2,
		writable : false,
		enumerable : false,
		configurable : false
	},
	DEFAULT_NUMBER_OF_ITEMS_IN_VIEWPORT: {
		value: 5,
		writable : false,
		enumerable : false,
		configurable : false
	}
});

export default VirtualList;