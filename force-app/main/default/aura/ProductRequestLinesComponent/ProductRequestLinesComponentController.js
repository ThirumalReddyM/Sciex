({
    doInit: function(component, event, helper) {
        console.log('satrted next');
        let listOfRequestLines = [];
        helper.createRow(component, listOfRequestLines);
        var productcolumns = [
            {'label': 'Product Name', 'fieldName': 'Name', 'type': 'text', 'sortable' : true},
            {'label': 'Product Code', 'fieldName': 'ProductCode', 'type': 'text', 'sortable' : true},
            {'label': 'Product Family','fieldName': 'Family', 'type': 'text', 'sortable' : true},
            {'label': 'Service Product Line','fieldName': 'FS_Product_Line__c', 'type': 'text', 'sortable' : true},
            {'label': 'Available Qty','fieldName': '', 'type': 'text', 'sortable' : true},
			{'label': 'Unit of Measure','fieldName': 'FS_Unit_Of_Measure__c', 'type': 'text', 'sortable' : true},
            {'label': 'SER Instrument Model Group','fieldName': 'SVC_OrclInstrumentModelGroup__c', 'type': 'text', 'sortable' : true},
            {'label': 'SER Item Classification','fieldName': 'SVC_OrclSerItemClassification__c', 'type': 'text', 'sortable' : true},
            {'label': 'SER Returnable','fieldName': 'SVC_OrclSerReturnable__c', 'type': 'text', 'sortable' : true},
            {'label': 'Location','fieldName': '', 'type': 'text', 'sortable' : true},
            {'label': 'Item Status','fieldName': 'SVC_OrclItemStatus__c', 'type': 'text', 'sortable' : true},
            {'label': 'Item Remarks','fieldName': 'SVC_OrclItemRemarks__c', 'type': 'text', 'sortable' : true}
        ]; 
        component.set("v.productcols",productcolumns);
        console.log('satrted next2');
         
        var action1 = component.get("c.fetchProducts");
        action1.setCallback(this, function(response) {
            let state = response.getState();
            console.log(state)
            if (state === "SUCCESS"){
                let result = response.getReturnValue(); 
                console.log('Response -> ', JSON.stringify(result)); 
                component.set("v.productrows", result);
                component.set("v.productoriginalData", result);
                
            }
        });
        $A.enqueueAction(action1);
    },
            
    addNewRow: function(component, event, helper) {
        let productLineItemList = component.get("v.listOfRequestLines");
        console.log('productLineItemList', productLineItemList.length);
        var validationPassForQuantity = helper.validateLines(component, "quantityField");
        console.log('validationPassForQuantity::', validationPassForQuantity);
        var validationPassForProduct = helper.validateLines(component, "productNameField");
        console.log('validationPassForProduct::', validationPassForProduct);
        if((validationPassForProduct && validationPassForQuantity) || productLineItemList.length == 0) {
            let listOfRequestLines = component.get("v.listOfRequestLines");
            helper.createRow(component, listOfRequestLines);
            
        }
    },
            
    removeRow: function(component, event, helper) {
        let toBeDeletedRowIndex = event.getSource().get("v.name");
        let listOfRequestLines = component.get("v.listOfRequestLines");
        console.log('toBeDeletedRowIndex::',toBeDeletedRowIndex);
        component.set("v.listOfRequestLines", []);
        let newListOfRequestLines = [];
        for (let i = 0; i < listOfRequestLines.length; i++) {
            if (listOfRequestLines[i].index != toBeDeletedRowIndex) {
                /*
                let RequestLineObject = {};
                RequestLineObject.index = i;                
                RequestLineObject.Product2Id = listOfRequestLines[i].Product2Id;
                RequestLineObject.Product2Name = listOfRequestLines[i].Product2Name;
                RequestLineObject.QuantityReturned = 1;
                newListOfRequestLines.push(RequestLineObject);*/
            } else {
                listOfRequestLines.splice(i, 1); 

            }
        }
        newListOfRequestLines = listOfRequestLines;
        console.log('newListOfRequestLines after::',newListOfRequestLines);
        for (let i = 0; i < newListOfRequestLines.length; i++) {
            newListOfRequestLines[i].index = i + 1;
        }
        console.log('newListOfRequestLines after::',JSON.stringify(newListOfRequestLines));
        
        component.set("v.listOfRequestLines", newListOfRequestLines);
    },
    
    handleSearch: function(component, event, helper) {
        var searchedParam = event.getParam("searchedParam");
        component.set("v.searchedParam", searchedParam);  
        console.log('Searched Param from search event ->' +component.get('v.searchedParam'));
        var action1 = component.get("c.fetchProducts");
        action1.setParams({
            "searchParam" : component.get('v.searchedParam')    
        });
        action1.setCallback(this, function(response) {
            let state = response.getState();
            console.log(state)
            if (state === "SUCCESS"){
                let result = response.getReturnValue(); 
                console.log('Response -> ', JSON.stringify(result)); 
                component.set("v.productrows", result);
                component.set("v.productoriginalData", result);
            }
        });
        $A.enqueueAction(action1);
    },
    
    openProduct: function(component, event, helper) {
        component.set("v.objectName", "Search Products");
        component.set("v.productloaded",true);
        component.set("v.productcurrentIndex",parseInt(event.getSource().get("v.title")));
    },
    
    removeAllRows: function(component, event, helper) {
        let listOfRequestLines = [];
        helper.createRow(component, listOfRequestLines);
    },
    handleSelect: function(component,event, helper){
        console.log('Data Coming -> ' + event.getParam("selectedId"));
        console.log('Data Value Coming -> ' + event.getParam("selectedRowName")+' Index Val '+event.getParam("index"));
        console.log(JSON.stringify(component.get("v.listOfRequestLines")));
        let indexVal = event.getParam("index");
        let resultArr=component.get("v.listOfRequestLines");
        
        console.log('arr '+JSON.stringify(resultArr[indexVal]));
        
        
        if(event.getParam("headerName")==="Search Products"){
            console.log('arr '+JSON.stringify(resultArr[indexVal-1]));
            resultArr[indexVal-1].Product2Id=event.getParam("selectedId");
            resultArr[indexVal-1].Product2Name=event.getParam("selectedRowName");
            
            console.log(JSON.stringify(component.get("v.listOfRequestLines")));
            component.set("v.productloaded",false);   
            
        }
        component.set("v.listOfRequestLines",resultArr);
        var validationPassForProduct = helper.validateLines(component, "productNameField");
        console.log('validationPassForProduct::', validationPassForProduct);    
    },
     handleCloseModal: function(component,event){
        component.set("v.productloaded",false);
    },
    
    createReturnLines: function(component, event, helper) {
        var validationPassForQuantity = helper.validateLines(component, "quantityField");
        console.log('validationPassForQuantity::', validationPassForQuantity);
        var validationPassForProduct = helper.validateLines(component, "productNameField");
        console.log('validationPassForProduct::', validationPassForProduct);
        if(validationPassForQuantity && validationPassForProduct) {
            console.log(JSON.stringify(component.get("v.listOfRequestLines")));
            var evt = component.getEvent("ProductRequestSubmitEvent");
            evt.setParams({
                "returnProductRequestLineItems":component.get("v.listOfRequestLines")
            }).fire();
        }
    }
})