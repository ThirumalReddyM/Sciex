({
    createRow: function(component, listOfReturnLines) {
        let ReturnLineObject = {};
        if(listOfReturnLines.length > 0) {
            ReturnLineObject.index = listOfReturnLines[listOfReturnLines.length - 1].index + 1;
        } else {
            ReturnLineObject.index = 1;
        }
        ReturnLineObject.Product2Id = null;
        ReturnLineObject.Product2Name = null;
        ReturnLineObject.QuantityReturned = 1.00;
        ReturnLineObject.SVC_Stocked_Serial__c = null;
        ReturnLineObject.SVC_Stocked_SerialName__c=null;
        listOfReturnLines.push(ReturnLineObject);
        component.set("v.listOfReturnLines", listOfReturnLines);
    },
    validateLines : function(component, auraID) {
        let linesList = [];
        let returnLineItemList = component.get("v.listOfReturnLines");
        let focusElement;
        console.log('auraID::',JSON.stringify(auraID));
        console.log('returnLineItemList', returnLineItemList.length);
        console.log('Return Lines List -> ' +JSON.stringify(component.get("v.listOfReturnLines")));
        if(returnLineItemList.length == 0) {
            return true;
        } else if(returnLineItemList.length == 1) {
            linesList = JSON.parse(JSON.stringify(component.find(auraID)));
            if(auraID == 'productNameField' || auraID == 'QuantityExpected') {
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
            if(auraID == 'QuantityExpected') {
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
                if(auraID == "QuantityExpected" && linesList[i].get("v.value") != null) {
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