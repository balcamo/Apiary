const cards = {
	//nothing available to edit
	accounts: { id: "accounts", title: "Accounts", show: true, edit:false },
	apCert: { id: "apCert", title: "AP Cert Report", show: true, edit:false },
	basementRead: { id: "basementRead", title: "Basement Read", show: true, edit:false },
	customers: { id: "customers", title: "Customers", show: true, edit:false },
	disconnects: { id: "disconnects", title: "Disconnects", show: true, edit:false },
	electricMeters: { id: "electricMeters", title: "Electric Meters", show: true, edit:false },
	inventory: { id: "inventory", title: "Inventory", show: true, edit:false },
	meters: { id: "meters", title: "Meters", show: true, edit:false },
	payments: { id: "payments", title: "Payments", show: true, edit:false },
	powerBI: { id: "powerBI", title: "Power BI", show: true, edit:false },
	lots: { id: "lots", title: "Lots", show: true, edit:false },
	transferLetter: { id: "transferLetter", title: "Transfer Letter", show: true, edit:false },
	waterMeters: { id: "waterMeters", title: "Water Meters", show: true, edit:false },

	// the following cards need to be declared for each user type and edit status set
	workOrders: { id: "workOrders", title: "Work Orders", show: true, edit:false },
	material:{ id: "material", title: "Material", show: true, edit:false }
	// serviceRequests: { id: "serviceRequests", title: "Service Requests", show: true, edit:false },
};

export const defaultCards = {
	Super_User: {
		accounts: {
			customers: {id: "customers", title: "Customers", show: true, edit:false},
			meters: cards.meters,
		},
	
		customers: { accounts: cards.accounts },
		lots: { accounts: cards.accounts },
		search: { 
			customers: cards.customers, 
			lots: cards.lots, 
			workOrders:cards.workOrders
		},
		reports: {
			inventory: cards.inventory,
			apCert: cards.apCert,
			transferLetter: cards.transferLetter,
			basementRead: cards.basementRead,
			powerBI:cards.powerBI
		},
		tools: {
			workOrders: cards.workOrders,
			// serviceRequests: cards.serviceRequests
		},
		workOrders:{
			workOrders:{ id: "workOrders", title: "Work Orders", show: true, edit:true },
			material:{ id: "material", title: "Material", show: true, edit:true }
		}
	},
	Operations: {
		accounts: {
			customers: cards.customers,
			meters: cards.meters,
			// serviceRequests: cards.serviceRequests
		},
		customers: { accounts: cards.accounts },
		lots: { accounts: cards.accounts },
		search: { 
			customers: cards.customers, 
			lots: cards.lots, 
			workOrders:cards.workOrders
		},
		reports: {
			inventory: cards.inventory,
			apCert: cards.apCert,
			transferLetter: cards.transferLetter,
			basementRead: cards.basementRead,
			powerBI:cards.powerBI
		},
		tools: {
			workOrders: cards.workOrders,
			// serviceRequests: cards.serviceRequests
		},
		workOrders:{
			workOrders:{ id: "workOrders", title: "Work Orders", show: true, edit:true },
			material:{ id: "material", title: "Material", show: true, edit:true }
		}
	},
	Default_User: {
		accounts: {
			customers: cards.customers,
			meters: cards.meters,
			// serviceRequests: cards.serviceRequests
		},
		customers: { accounts: cards.accounts },
		lots: { accounts: cards.accounts },
		search: { 
			customers: cards.customers, 
			lots: cards.lots, 
			workOrders:{ id: "workOrders", title: "Work Orders", show: true, edit:false } },
		reports: {
			inventory: cards.inventory,
			apCert: cards.apCert,
			transferLetter: cards.transferLetter,
			basementRead: cards.basementRead,
			powerBI:cards.powerBI
		},
		tools: {
			workOrders: cards.workOrders,
			// serviceRequests: cards.serviceRequests
		},
		workOrders:{
			workOrders:{ id: "workOrders", title: "Work Orders", show: true, edit:false },
			material:{ id: "material", title: "Material", show: true, edit:false }
		},


	},
};
