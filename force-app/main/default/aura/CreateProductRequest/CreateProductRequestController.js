({
    init : function(component, event, helper) {
        console.log('staretd::');
        var navService = component.find("navService");
        var pageReference = {
           "type": "standard__component",
            "attributes": {
                "componentName": "c__ProductRequestParentComponent"    
            },    
            "state": {
                "c__WOid":  component.get('v.recordId')
            }
        };
          navService.navigate(pageReference);
    }
})