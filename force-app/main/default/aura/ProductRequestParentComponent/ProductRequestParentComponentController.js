({ 
    doInitialization: function(component, event, helper) {
        var myPageRef = component.get("v.pageReference");
        var workOrderId = myPageRef.state.c__WOid;
        console.log('ID -> ' + workOrderId);
        component.set("v.workOrderId", workOrderId);
        component.set('v.workOrderIdLoaded', true);
        component.set("v.productRequestStatus", "Submitted");
        component.set("v.spinner", false);
    },
    handleOnSubmit : function(component, event, helper) {
        component.set("v.spinner", true);
        event.preventDefault(); //Prevent default submit
        console.log('eventFields:==> ' + JSON.stringify(event.getParam("returnProductRequestLineItems")));
        component.set("v.productRequestLineItemDetails",event.getParam("returnProductRequestLineItems"));
        component.find("needByDate").reportValidity();
        component.find("shipmentPriority").reportValidity();
        if(component.find("needByDate").get("v.value") == null) {
            component.find("needByDate").focus();
        } else if(component.find("shipmentPriority").get("v.value") == null) {
            component.find("shipmentPriority").focus();
        } else if(component.find("needByDate").get("v.value") != null && component.find("shipmentPriority").get("v.value") != null) {
        	component.find('ProductRequestCreateForm').submit();
            console.log('submit started::');
        } else {
            component.set("v.spinner", false);
        }
        component.set("v.spinner", false);
    },
    handleOnSuccess:  function(component, event, helper) {
        console.log('handleOnSuccess started::');
        var record = event.getParams().response;  
        console.log('Created Product Request Id->' +record.id);
        let productReqLineItemList = [];
        let productRequestLineItemDetails = component.get("v.productRequestLineItemDetails");
        console.log('Created productRequestLineItemDetails->' +JSON.stringify(productRequestLineItemDetails));
        if(productRequestLineItemDetails) {
            console.log('In');
            for(var i=0;i<productRequestLineItemDetails.length;i++) {
                let productReqLineItem = {};
                productReqLineItem.QuantityRequested = productRequestLineItemDetails[i].QuantityReturned;
                productReqLineItem.Product2Id = productRequestLineItemDetails[i].Product2Id;
                productReqLineItem.ParentId = record.id;
                productReqLineItem.AccountId = component.get("v.recordFields").AccountId;
                productReqLineItem.CaseId = component.get("v.recordFields").CaseId;
                productReqLineItem.SourceLocationId = component.find('sourceLoc').get('v.value');
                productReqLineItem.DestinationLocationId = component.find('destinationLoc').get('v.value');
                productReqLineItem.NeedByDate = component.find('needByDate').get('v.value');
                productReqLineItem.WorkOrderId = component.get("v.recordFields").Id;
                productReqLineItemList.push(productReqLineItem);
            }
            console.log('Created productReqLineItemList->' +JSON.stringify(productReqLineItemList));
            let action = component.get("c.insertReturnLines");
            action.setParams({
                "jsonOfListOfReturnLines": JSON.stringify(productReqLineItemList)
            });
            action.setCallback(this, function(response) {
                const toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    message: "Product Request and Line Items are successfully created!",
                    type: "success",
                    duration: '2000',
                });
                toastEvent.fire();
            });
            $A.enqueueAction(action);
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": record.id
            });
            navEvt.fire();
        }
    }
})