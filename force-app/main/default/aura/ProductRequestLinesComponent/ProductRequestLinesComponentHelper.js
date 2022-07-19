({
    createRow: function(component) {
        let listOfRequestLines = component.get("v.listOfRequestLines");
        let RequestLineObject = {};
        console.log('listOfRequestLines1::::', JSON.stringify(listOfRequestLines));
        if(listOfRequestLines.length > 0) {
            RequestLineObject.index = listOfRequestLines[listOfRequestLines.length - 1].index + 1;
        } else {
            RequestLineObject.index = 1;
        }
        RequestLineObject.Product2Id = null;
        RequestLineObject.Product2Name = null;
        RequestLineObject.QuantityReturned = 1;
        listOfRequestLines.push(RequestLineObject);
        console.log('listOfRequestLines::::', JSON.stringify(listOfRequestLines));
        console.log('testt111');
        component.set("v.listOfRequestLines", listOfRequestLines);
        console.log('testt');
    }, 
    
    validateLines : function(component, auraID) {
        let linesList = [];
        let productLineItemList = component.get("v.listOfRequestLines");
        let focusElement;
        console.log('auraID::',JSON.stringify(auraID));
        console.log('productLineItemList', productLineItemList.length);
        if(productLineItemList.length == 0) {
            return true;
        } else if(productLineItemList.length == 1) {
            linesList = JSON.parse(JSON.stringify(component.find(auraID)));
            if(auraID == 'productNameField' || auraID == 'quantityField') {
                if(component.find(auraID).get("v.value") == null) {
                    component.find(auraID).setCustomValidity("Complete this field");
        			component.find(auraID).reportValidity();
                    component.find(auraID).focus();
                    return false;
                } else {
                    component.find(auraID).setCustomValidity("");
        			component.find(auraID).reportValidity();
                }
            }
            if(auraID == 'quantityField') {
                if(component.find(auraID).get("v.value") < 1) {
                    component.find(auraID).setCustomValidity("Quantity cannot be less than 1");
                    component.find(auraID).reportValidity();
                    component.find(auraID).focus();
                    return false;
                } else {
                    component.find(auraID).setCustomValidity("");
        			component.find(auraID).reportValidity();
                }
            }            
        } else {
            linesList = component.find(auraID);
        }
        console.log('linesList:::', JSON.stringify(linesList));
        console.log('linesList11:::', linesList);
    	if(linesList) {
            console.log('linesList len', linesList.length);
            for(var i=0;i<linesList.length;i++) {
                if(linesList[i] == null || linesList[i].get("v.value") == null || linesList[i].get("v.value") == '' || linesList[i].get("v.value") == undefined) {
                    linesList[i].setCustomValidity("Complete this field");
        			linesList[i].reportValidity();
                    if(focusElement == null || focusElement == undefined) {
                        focusElement = linesList[i];
                    }
                } else {
                    linesList[i].setCustomValidity("");
        			linesList[i].reportValidity();
                }
                if(auraID == "quantityField" && linesList[i].get("v.value") != null) {
                    if(linesList[i].get("v.value") < 1) {
                        linesList[i].setCustomValidity("Quantity cannot be less than 1");
                        linesList[i].reportValidity();
                        if(focusElement == null || focusElement == undefined) {
                            focusElement = linesList[i];
                        }
                    } else {
                        linesList[i].setCustomValidity("");
        				linesList[i].reportValidity();
                    }
                }
            }
            if(focusElement != null) {
                focusElement.focus();
                return false;
            }
            return true;
        }
	}
});