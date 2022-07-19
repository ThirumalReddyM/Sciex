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
    }
});