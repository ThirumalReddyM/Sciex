({ 
    doInIt: function(component, event, helper) {
        var myPageRef = component.get("v.pageReference");
        var workOrderId = myPageRef.state.c__WOid;
        console.log('ID -> ' + workOrderId)
        component.set("v.workOrderId", workOrderId);
        component.set('v.workOrderIdLoaded', true);
        var columns = [
            {'label': 'Location Name', 'fieldName': 'Name', 'type': 'text', 'sortable' : true},
            {'label': 'Service Resource', 'fieldName': 'Service_Resource__c', 'type': 'text', 'sortable' : true},
            {'label': 'City','fieldName': 'FS_City__c', 'type': 'text', 'sortable' : true},
            {'label': 'State','fieldName': 'FS_State__c', 'type': 'text', 'sortable' : true},
            {'label': 'Country','fieldName': 'FS_Country__c', 'type': 'text', 'sortable' : true}
        ]; 
        component.set("v.locationcols",columns);
        var action = component.get("c.fetchLocations");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS"){
                let result = response.getReturnValue(); 
                console.log('Response -> ', JSON.stringify(result));
                result.forEach(element=>{
                    if (element.Service_Resource__r.Name){ element.Service_Resource__c = element.Service_Resource__r.Name;}
                               })
                console.log('Response -> ', JSON.stringify(result));
                component.set("v.locationrows", result);
                component.set("v.locationoriginalData", result);
            }
        });
        $A.enqueueAction(action);
    },
    openLocation: function(component, event, helper) {
        component.set("v.objectName", "Search Location");
        component.set("v.locationloaded",true);
    },
    handleSearch: function(component, event, helper) {
        var searchedParam = event.getParam("searchedParam");
        component.set("v.searchedParam", searchedParam);  
        console.log('Searched Param from search event ->' +component.get('v.searchedParam'));
        var action = component.get("c.fetchLocations");
        action.setParams({
            "searchParam" : component.get('v.searchedParam')    
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS"){
                let result = response.getReturnValue(); 
                console.log('Response -> ', JSON.stringify(result)); 
                component.set("v.locationrows", result);
                component.set("v.locationoriginalData", result);
            }
        });
        $A.enqueueAction(action);
    },
    handleSelect: function(component,event){
        console.log('Data Coming -> ' + event.getParam("selectedId"));
        console.log('Data Value Coming -> ' + event.getParam("selectedRowName"));
        var sourceLocationId = event.getParam('selectedId');
        if(event.getParam("headerName")==="Search Location"){
            component.set("v.locationloaded",false);   
            component.set("v.selectedLocation",sourceLocationId);
            component.set("v.selectedLocationName",event.getParam("selectedRowName"));
        }
    },
     handleCloseModal: function(component,event){
        component.set("v.locationloaded",false);
    },
    parentComponentEvent: function(component, event, helper) {
        var selectedRecord = event.getParam("selectedRecord");
        component.set("v.selectedRecord", selectedRecord);  
        console.log(JSON.stringify(selectedRecord));
    },
    handleOnSubmit : function(component, event, helper) {
        event.preventDefault(); //Prevent default submit
        console.log('eventFields:==> ' + JSON.stringify(event.getParam("returnWorkOrderLineItems")));
        component.set("v.returnOrderLineItemDetails",event.getParam("returnWorkOrderLineItems"));
        var showValidationError = false;
        var fields = component.find("field");
        var vaildationFailReason = '';
 
        fields.forEach(function (field) {
            if(field.get("v.fieldName") === 'FS_RMA_Type__c' && $A.util.isEmpty(field.get("v.value"))){
                showValidationError = true;
                vaildationFailReason = "'RMA Type' cannot be empty!";
            } else if (field.get("v.fieldName") === 'FS_Courier__c' && $A.util.isEmpty(field.get("v.value"))) {
                showValidationError = true;
                vaildationFailReason = "'Courier' cannot be empty!";
            }else if (field.get("v.fieldName") === 'FS_Tracking_Number__c' && $A.util.isEmpty(field.get("v.value"))) {
                showValidationError = true;
                vaildationFailReason = "'Tracking Number' cannot be empty!";
            }else if ($A.util.isEmpty(component.get("v.selectedLocationName"))) {
                showValidationError = true;
                vaildationFailReason = "'Source Location' cannot be empty!";
            }
        });
         
        if (!showValidationError) {
            component.find("ReturnOrderCreateForm").submit();  
        } else {
           // component.find('ReturnOrderMessage').setError(vaildationFailReason);
           const toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Required Field Missing",
                message: vaildationFailReason,
                type: "error",
                duration:' 2000',
            });
            toastEvent.fire();
        }
    },
    handleOnSuccess:  function(component, event, helper) {
        var record = event.getParams().response;  
        console.log('Created Return Order Id->' +record.id)
        let action = component.get("c.insertReturnLines");
       /* var destinationLocation = component.get('v.selectedLocation');
        console.log('Destination Location Id -> '+destinationLocation)
        var sourceLocation = component.find('sourceLocation').get('v.value');
        console.log('Source Location Id -> '+sourceLocation)*/
        action.setParams({
            "jsonOfListOfReturnLines": JSON.stringify(component.get("v.returnOrderLineItemDetails")),
            "destinationLocation":component.find('destinationLocation').get('v.value'),
            "sourceLocation":component.get('v.selectedLocation'),
            "parentRecId":record.id
        });
        action.setCallback(this, function(response) {
            component.find('field').forEach(function(f) {
                f.reset();
            });
          	component.set('v.selectedLocationName', null);
            
            const toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                message: "Return Order Line Items successfully created!",
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
    },
     handleError: function (component, event, helper) {
        component.find('ReturnOrderMessage').setError('Undefined error occured');
    },
})