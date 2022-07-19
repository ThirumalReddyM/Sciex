({
    onSearchTermChange : function(component,event,helper){
        var delayMillis = 500;
        var timeoutId = component.get("v.searchTimeoutId");
        clearTimeout(timeoutId);
        timeoutId = setTimeout($A.getCallback(function(){
            helper.handleSearch(component,event);
        }), delayMillis);
        component.set("v.searchTimeoutId",timeoutId);
        
        var event = component.getEvent("SearchEvent");
        event.setParams({
            "searchedParam": component.get("v.searchTerm")
        }).fire();
    },
    
    handleSort : function(component, event, helper){
        //Returns the field which has to be sorted
        var sortBy = event.getParam("fieldName");
        //returns the direction of sorting like asc or desc
        var sortDirection = event.getParam("sortDirection");
        //Set the sortBy and sortDirection attributes
        component.set("v.sortBy",sortBy);
        component.set("v.sortDirection",sortDirection);
        // call sortData helper function
        helper.sortData(component,sortBy,sortDirection);
    },
    
    handleRowSelection: function(component,event){
        var selectedRows = event.getParam('selectedRows');
        console.log('Selected Row -> ' + JSON.stringify(selectedRows));
        let obj = [];
        let objName = [];
        let stockProdName=[];
        let stockProdId=[];
        for(var i = 0; i < selectedRows.length; i++){
            obj.push(selectedRows[i].Id);
            objName.push(selectedRows[i].Name);
            if(component.get("v.objectName") === "Search Stocked Serial"){   
                stockProdName.push(selectedRows[i].FS_ProductName);
                stockProdId.push(selectedRows[i].FS_Product__c);
            }
        }
        
        component.set("v.selectedId",obj.toString());
        component.set("v.selectedRowName",objName.toString());
        if(component.get("v.objectName") === "Search Stocked Serial"){
            component.set("v.selectedStockProdId",stockProdId.toString());
            component.set("v.selectedStockProdName",stockProdName.toString());
            
        }
    },
    
    handleSelect: function(component,event){
        var evt = component.getEvent("SelectRow");
        if(component.get("v.objectName") === "Search Products"){
            evt.setParams({
                "selectedId": component.get("v.selectedId"),
                "selectedRowName": component.get("v.selectedRowName"),
                "headerName": component.get("v.objectName"),
                "index":component.get("v.indexProd")
            }).fire(); 
        }
        else if(component.get("v.objectName") === "Search Stocked Serial"){
            evt.setParams({
                "selectedId": component.get("v.selectedId"),
                "selectedRowName": component.get("v.selectedRowName"),
                "headerName": component.get("v.objectName"),
                "index":component.get("v.indexProd"),
                "selectedStockProdRowName":component.get("v.selectedStockProdName"),
                "selectedStockProdId":component.get("v.selectedStockProdId")
            }).fire();
        }
        else if(component.get("v.objectName") === "Search Location"){
            evt.setParams({
                "selectedId": component.get("v.selectedId"),
                "selectedRowName": component.get("v.selectedRowName"),
                "headerName": component.get("v.objectName")               
            }).fire();
        }
        else{
            evt.setParams({
                "selectedId": component.get("v.selectedId"),
                "selectedLocationName": component.get("v.selectedRowName"),
                "headerName": component.get("v.headerName")
            }).fire();
        }
    },
    
    closeModal: function(component,event){
        var evt = component.getEvent("CloseModal");
        evt.fire();
    }
})