var GenericApp = {
    data: {},
    dom: {},
    setup: function(){},
    input: function(){},
    update: function(){},
    _set_root: function(id){
		this.dom = {}
		this.data = {}
        this.dom.root = document.getElementById(id);
        if (this.dom.root)
            this.dom.root.innerHTML = "";
    },
    _add_element: function (id, type, value, parent_id=null, classes=[]) {
        this.dom[id+"_el"] = document.createElement(type);
        this.dom[id+"_el"].id = id
        switch (type) {
            case "input":
                this.dom[id+"_el"].value = value;
                break;
            default:
                this.dom[id+"_el"].innerText = value;
                break;
        }
        classes.forEach((c)=>{
            this.dom[id+"_el"].classList.add(c)
        })        
        if (!parent_id){
            this.dom.root.append(this.dom[id+"_el"]);
            return
        }
        document.getElementById(parent_id).append(this.dom[id+"_el"]);
    },
    _add_data_element: function (id, type, value, parent_id=null, classes=[]) {
        this.dom[id+"_el"] = document.createElement(type);
        this.dom[id+"_el"].id = id
		this.data[id+"_value"] = value;
        switch (type) {
            case "input":
                this.dom[id+"_el"].value = value;
				this.dom[id+"_el"].onchange = () => {
					this.data[id+"_value"] = this.dom[id+"_el"].value;
					this.update()
				}
                break;
            default:
                this.dom[id+"_el"].innerText = this.data[id+"_value"];
                break;
        }
        classes.forEach((c)=>{
            this.dom[id+"_el"].classList.add(c)
        })        
        if (!parent_id){
            this.dom.root.append(this.dom[id+"_el"]);
            return
        }
        document.getElementById(parent_id).append(this.dom[id+"_el"]);
    },
    _add_button: function (id, value, callback, parent_id=null, classes=[]) {
        this.dom[id+"_btn"] = document.createElement("button");
        this.dom[id+"_btn"].id = id
        this.dom[id+"_btn"].onclick = callback
        this.dom[id+"_btn"].innerText = value
        classes.forEach((c)=>{
            this.dom[id+"_btn"].classList.add(c)
        })
        if (!parent_id){
            this.dom.root.append(this.dom[id+"_btn"]);
            return
        }
        document.getElementById(parent_id).append(this.dom[id+"_btn"]);
    },
    _add_hbox: function (id, parent_id=null, classes=[]) {
        this.dom[id+"_el"] = document.createElement("div");
        this.dom[id+"_el"].id = id
        this.dom[id+"_el"].classList.add("hbox")
        classes.forEach((c)=>{
            this.dom[id+"_el"].classList.add(c)
        })
        if (!parent_id){
            this.dom.root.append(this.dom[id+"_el"]);
            return
        }
        document.getElementById(parent_id).append(this.dom[id+"_el"]);
    },
    _add_vbox: function (id, parent_id=null, classes=[]) {
        this.dom[id+"_el"] = document.createElement("div");
        this.dom[id+"_el"].id = id
        this.dom[id+"_el"].classList.add("vbox")
        classes.forEach((c)=>{
            this.dom[id+"_el"].classList.add(c)
        })
        if (!parent_id){
            this.dom.root.append(this.dom[id+"_el"]);
            return
        }
        document.getElementById(parent_id).append(this.dom[id+"_el"]);
    },
	_add_swapbox: function (id, parent_id=null, classes=[]) {
        this.dom[id+"_el"] = document.createElement("div");
        this.dom[id+"_el"].id = id
        this.dom[id+"_el"].classList.add("swapbox")
        classes.forEach((c)=>{
            this.dom[id+"_el"].classList.add(c)
        })
        if (!parent_id){
            this.dom.root.append(this.dom[id+"_el"]);
            return
        }
        document.getElementById(parent_id).append(this.dom[id+"_el"]);
    },
	_build_list: function (list_el_id, list_data, list_classes, item_button_classes){
		let list_el = document.getElementById(list_el_id);
		list_el.innerHTML = "";
		console.log("building list "+JSON.stringify(list_data));
		for (let item in list_data){  
			if (item){
				console.log("item: "+item);
				this._add_hbox("item_"+item,  list_el.id, list_classes);
				this._add_element(item+ "_item_title", "div", item, "item_"+item);
				this._add_element(item+ "_item_value", "div", list_data[item], "item_"+item);
				this._add_button("remove_"+item, "X", ()=>{
					delete list_data[item];
					this.update();      
				}, "item_"+item, item_button_classes);
			};
			console.log(JSON.stringify(list_data));
		};
	},
	save: function(key){
		this.data = {...this.data}
	},
	load: function(key){
		this.data[key] = {...this.data}
	},
}

export {GenericApp as default}
