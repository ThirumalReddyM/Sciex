public class ReturnOrderHandler {
    @AuraEnabled
    public static List<sObject> fetchLocations(string searchParam) {
        String likeParam = '%' +searchParam+ '%';
        String Query ='';
        if(searchParam != null){
            Query = 'Select Id, Name, Service_Resource__c, SVC_My_Trunk_Stock_Location__c,  Service_Resource__r.Name, FS_City__c, FS_State__c, FS_Country__c from Location where SVC_My_Trunk_Stock_Location__c = 1 and Name like : searchParam LIMIT 50';
        }else{
            Query = 'Select Id, Name, Service_Resource__c, SVC_My_Trunk_Stock_Location__c,  Service_Resource__r.Name, FS_City__c, FS_State__c, FS_Country__c from Location where SVC_My_Trunk_Stock_Location__c = 1 LIMIT 50';
        }
        
        List<SObject> sObjectList = Database.query(Query);
        return sObjectList;
    }

    @AuraEnabled
    public static List<sObject> fetchProducts(string searchParam) {
        String likeParam = '%' +searchParam+ '%';
        String Query ='';
        if(searchParam != null){
            Query = 'Select Id, Name, ProductCode, Family, FS_Product_Line__c, SVC_OrclEHSDocofDeconReq__c,Manufacturer__c, FS_Unit_Of_Measure__c from Product2 where Name Like: likeParam or ProductCode like: likeParam LIMIT 30';
        }else{
            Query = 'Select Id, Name, ProductCode, Family, FS_Product_Line__c, SVC_OrclEHSDocofDeconReq__c,Manufacturer__c, FS_Unit_Of_Measure__c from Product2 LIMIT 30';
        }
        
        List<SObject> sObjectList = Database.query(Query);
        return sObjectList;
    }
    @AuraEnabled
    public static List<sObject> fetchStockedSerials(string searchParam) {
        String likeParam = '%' +searchParam+ '%';
        String Query ='';
        if(searchParam != null){
            Query = 'Select Id, Name, FS_Product__c, FS_Product__r.Name, FS_Product_Item__r.ProductName, FS_Product_Item__c,FS_Product_Item__r.ProductItemNumber,SVC_OrclLotNumber__c from FS_Product_Serial__c where Name Like: likeParam and SVC_OrclLotNumber__c = null LIMIT 100';
        }else{
            Query = 'Select Id, Name, FS_Product__c, FS_Product__r.Name, FS_Product_Item__r.ProductName, FS_Product_Item__c,FS_Product_Item__r.ProductItemNumber,SVC_OrclLotNumber__c from FS_Product_Serial__c where SVC_OrclLotNumber__c = null LIMIT 100';
        }
        
        List<SObject> sObjectList = Database.query(Query);
        return sObjectList;
    }
    @AuraEnabled
    public static void insertReturnLines(String jsonOfListOfReturnLines,Id parentRecId, Id destinationLocation, Id sourceLocation) {
        ReturnOrder RO = [Select Id, SourceLocationId, DestinationLocationId, FS_Service_Order__c from ReturnOrder where Id =: parentRecId];
        WorkOrder WO = [Select Id, WorkOrderNumber, CaseId from WorkOrder where Id =: RO.FS_Service_Order__c];
        RecordType returnOrderRecType = [SELECT Id,Name, DeveloperName FROM RecordType WHERE SobjectType='ReturnOrder' and DeveloperName ='Return_Order'];
        //updating Return Order
        RO.RecordTypeId = returnOrderRecType.Id;
        RO.SourceLocationId = sourceLocation;
        RO.CaseId = WO.CaseId;
        Update RO;
        
        List<ReturnOrderLineItem> listOfReturnLines = (List<ReturnOrderLineItem>) JSON.deserialize(jsonOfListOfReturnLines, List<ReturnOrderLineItem>.class);
        System.debug('Inserting '+listOfReturnLines);
        for(Integer counter=0;counter<listOfReturnLines.size();counter++){
            if(listOfReturnLines[counter].Product2Id==null){
                listOfReturnLines.remove(counter);
            }else{
                listOfReturnLines[counter].ReturnOrderId=parentRecId;
                listOfReturnLines[counter].DestinationLocationId=destinationLocation;
                listOfReturnLines[counter].SourceLocationId=sourceLocation;
            }
        }
        insert listOfReturnLines;
    }
}