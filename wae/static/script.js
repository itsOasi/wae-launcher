import http from './helper.js';
import GenericApp from './apps.js';

const payment_host = "https://payment-server-2jochkae6a-uc.a.run.app";

let apps = {
    "budgets": {...GenericApp },
    "income": {...GenericApp },
    "support": {...GenericApp}
};

let saved_data = JSON.parse(localStorage.getItem("InnovaFi_data")) || {};

////////////////////////////////////////////
/* Budget App */
apps.budgets.setup = function(root_id){
    this._set_root(root_id);
    
    this._add_hbox("budget_header");
    this._add_element("income_text", "b", "Income", "budget_header");
    this._add_data_element("income", "input", 7000, "budget_header");
    this._add_element("break1", "br");
    
    this._add_swapbox("lists", null, ["space_between"]);
    this._add_vbox("needs", "lists");
    this._add_vbox("wants", "lists");
    this._add_vbox("savings", "lists");
    this._add_element("need_item_name", "input", "Electricity bill", "needs");
    this._add_element("want_item_name", "input", "Xbox", "wants");
    this._add_element("savings_account_name", "input", "Mortgage Savings", "savings");
    this._add_data_element("need_item_amount", "input", 100, "needs");
    this._add_data_element("want_item_amount", "input", 300, "wants");
    this._add_data_element("savings_account_amount", "input", 100, "savings");
    this._add_element("break2", "br");
    this._add_data_element("needs_list", "div", {}, "needs");
    this._add_data_element("wants_list", "div", {}, "wants");
    this._add_data_element("savings_list", "div", {}, "savings");
    this._add_button("add_need", "Add Need", () =>{
      this.data.needs_list_value[this.dom.need_item_name_el.value] = Number(this.dom.need_item_amount_el.value);
      console.log(JSON.stringify(this.data.needs_list_value));
      this.update();
    }, "needs", ["menu_button", "outline"]);
    this._add_button("add_want", "Add Want", () =>{
      this.data.wants_list_value[this.dom.want_item_name_el.value] = Number(this.dom.want_item_amount_el.value);
      console.log(JSON.stringify(this.data.wants_list_value));
      this.update();
    }, "wants", ["menu_button", "outline"]);
    this._add_button("add_savings", "Add Savings", () =>{
      this.data.savings_list_value[this.dom.savings_account_name_el.value] = Number(this.dom.savings_account_amount_el.value);
      console.log(JSON.stringify(this.data.savings_list_value));
      this.update();
    }, "savings", ["menu_button", "outline"]);
    this._add_element("break3", "br");
    this._add_element("budget_text", "b", "Your Budget");
    this._add_hbox("results");
    this._add_data_element("needs_results", "b", 0, "results", ["theme_text"]);
    this._add_data_element("wants_results", "b", 0, "results", ["theme_text"]);
    this._add_data_element("savings_results", "b", 0, "results", ["theme_text"]);
    this._add_button("save", "💾", () => {
        saved_data.budget = {...this.data};
        localStorage.setItem("InnovaFi_data", JSON.stringify(saved_data));
        console.log(JSON.stringify(saved_data));
        show_note("Your data was saved! Please consider supporting us so we can make our products better", "Success!");
    }, null, ["menu_button", "outline", "center"]);
    if ("budget" in saved_data){
		console.log(saved_data)
        this.data = {...saved_data.budget};
        show_note("Your data was loaded! Happy budgeting!", "Success!");
    };
	if ("income" in saved_data && "total_income" in saved_data.income){
		this.dom.income_el.value = saved_data.income.total_income;
	}else{
		this.dom.income_el.value = this.data.income_value;
	}
    this.dom.income_el.onchange = _ =>{this.update();};
    
    this.update();
}

apps.budgets.update = function(){
    this.data.income_value = this.dom.income_el.value;
    this.calculate_budgets();
    this.dom.needs_results_el.innerHTML = `Needs: ${this.data.needs_results_value}`;
    this.dom.wants_results_el.innerHTML = `Wants: ${this.data.wants_results_value}`;
    this.dom.savings_results_el.innerHTML = `Savings: ${this.data.savings_results_value}`;
    this._build_list("needs_list", this.data.needs_list_value, ["space_between"], ["theme_text", "menu_button", "outline"]);
    this._build_list("wants_list", this.data.wants_list_value, ["space_between"], ["theme_text", "menu_button", "outline"]);
    this._build_list("savings_list", this.data.savings_list_value, ["space_between"], ["theme_text", "menu_button", "outline"]);
}

apps.budgets.calculate_budgets = function(){
    let over_budget = false;
    let needs_list_amount = 0;
    let wants_list_amount = 0;
    let savings_list_amount = 0;
    let needs_list = this.data.needs_list_value;
    let wants_list = this.data.wants_list_value;
    let savings_list = this.data.savings_list_value;
    
    Object.values(needs_list).forEach(function (item) {
        needs_list_amount += item;
    });
    Object.values(wants_list).forEach(function (item) {
        wants_list_amount += item;
    });
    Object.values(savings_list).forEach(function (item) {
        savings_list_amount += item;
    });
    
    this.data.needs_results_value = this.data.income_value * .5;
    this.data.wants_results_value = this.data.income_value * .3;
    this.data.savings_results_value = this.data.income_value * .2;
    
    over_budget = needs_list_amount + wants_list_amount + savings_list_amount> this.data.income_value;
    if (over_budget){
        show_note("You are over budget", "Warning");
    };
}
////////////////////////////////////////////////
/* Income App */
apps.income.setup = function(root_id){
	this._set_root(root_id);
	this._add_vbox("income_body");
	this._add_vbox("income_list", "income_body");
	this._add_hbox("input_panel", "income_body", ["full_width", "space_between"]);
	this._add_element("new_income_name", "input", "Income Source", "input_panel");
	this._add_element("new_income_salary", "input", 40000, "input_panel");
	this._add_button("add_income", "Add Income", () =>{
		console.log("This data "+JSON.stringify(this.data))
		this.data.income_list[this.dom.new_income_name_el.value] = Number(this.dom.new_income_salary_el.value);
		this.update();
	}, "input_panel", ["menu_button", "outline"]);

	this._add_button("save", "💾", () => {
		saved_data.income = {...this.data};
		console.log("Full data "+JSON.stringify(saved_data));
		localStorage.setItem("InnovaFi_data", JSON.stringify(saved_data));
		show_note("Your data was saved! Please consider supporting us so we can make our products better", "Success!");
	}, null, ["menu_button", "outline", "center"]);
	this._add_button("reset", "Reset", ()=>{
		this.data = {}
		this.data.income_list = {}
		show_note("data reset")
	}, null, ["menu_button", "outline", "center"]);
	this._add_element("total_income", "b", "", null, ["theme_text"])
	if ("income" in saved_data){
		this.data = {...saved_data.income};
		show_note("Your data was loaded! Happy budgeting!", "Success!");
	}else{
		this.data.income_list = {}
		this.data.total_income = 0
	}
	this.update();
}

apps.income.update = function () {
    this._build_list("income_list", this.data.income_list, ["space_between"], ["theme_text", "menu_button", "outline"]);
	this.data.total_income = this.calculate_income();
	document.querySelector("#total_income").innerHTML = "Total Income: "+this.data.total_income;
	console.log("Income Data "+JSON.stringify(this.data));
}

apps.income.calculate_income = function(){
	let income_list = this.data.income_list;
	let total_income = 0;
	for (let source in income_list){
		total_income += income_list[source];
	}
	console.log(total_income)
	return total_income;
}

/* support app */
apps.support.setup = function(root_id) {
    this._set_root(root_id);
    this._add_element("support_title", "div", "We appreciate your support!", null, ["text_center",  "title", "theme_text"]);
    this._add_data_element("amount", "input", 5, null, ["center"]);
    this._add_element("break", "br");
    this._add_button("confirm_support", "Confirm", async ()=>{
        let amount = this.data.amount_value;
		let key_res = await http.get(payment_host+"/get_test_key");
		let key_text = await key_res.json();
		console.log(JSON.stringify(this.data))
		let form = new FormData()
			form.append("price_id", amount);
			form.append("success", "test");
			form.append("cancel", "test");
			form.append("api_key", key_text["test_key"]);
		let res = await http.post(payment_host+"/single_purchase", form)
		let res_text = await res.text();
        show_note(res_text);
    }, null, ["menu_button", "outline","center"]);
}

/* Basic web stuff */
document.body.onload = function(){
    switch_app("budgets");
    document.querySelector("#budgets").onclick = _ => {switch_app("budgets");};
    document.querySelector("#income").onclick = _ => {switch_app("income");};
    document.querySelector("#support").onclick = _ => {switch_app("support");};
}

function show_note(message="test message", title=""){
    console.log(message);
    let notification = document.querySelector("#notification");
    document.querySelector("#note_message").innerHTML = message;
    document.querySelector("#note_title").innerHTML = title;
    document.querySelector("#note_close").onclick = hide_note;
    notification.classList.add("visible");
}
export function hide_note(){
    notification.classList.remove("visible");
}

export function switch_app(name){
    apps[name].setup("app_root");
}
