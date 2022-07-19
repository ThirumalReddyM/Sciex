@IsTest
public class ReturnOrderHandlerTest {
    @testSetup static void setup() {
        
        Schema.Location sourceLoc=new Schema.Location();
        sourceLoc.Name='Source Hyderabad';
        sourceLoc.LocationType='Warehouse';
        sourceLoc.IsInventoryLocation=true;
        insert sourceLoc;
        
        Schema.Location destinationLoc=new Schema.Location();
        destinationLoc.Name='Destination Hyderabad';
        destinationLoc.LocationType='Warehouse';
        destinationLoc.IsInventoryLocation=true;
        insert destinationLoc;
        
        Schema.Location testLoc=new Schema.Location();
        testLoc.Name='Test Hyderabad';
        testLoc.LocationType='Warehouse';
        testLoc.IsInventoryLocation=true;
        insert testLoc;
        
        
        Product2 prod = new Product2();
        prod.Name = 'Test Product';
        prod.Family = 'Hardware';
        prod.ProductCode = '123';
        insert prod;
        
        ProductItem proditem = new ProductItem();
        proditem.CurrencyIsoCode = 'USD';
        proditem.LocationId=testLoc.Id;
        proditem.Product2Id=prod.Id;
        proditem.QuantityOnHand=1;
        insert proditem;
        
        FS_Product_Serial__c stockedSerial = new FS_Product_Serial__c();
        stockedSerial.Name = 'Test Serial';
        stockedSerial.FS_Product__c = prod.Id;
        stockedSerial.SVC_OrclLotNumber__c = null;
        insert stockedSerial;
        
        Case cas = new Case();
        cas.Status ='New';
        cas.Priority = 'Medium';
        cas.Origin = 'Email';
        insert cas;
        
        WorkOrder wo = new WorkOrder();
        wo.subject ='title';
        wo.CaseId = cas.Id;
        insert wo;
        
        ReturnOrder ro = new ReturnOrder();
        ro.FS_Service_Order__c = wo.Id;
        ro.CaseId = cas.Id;
        ro.CurrencyIsoCode = 'USD';
        ro.DestinationLocationId = destinationLoc.Id;
        insert ro;
    }
    @IsTest
    public static void fetchLocations(){
        Schema.Location Loc1= [Select Id, Name, Service_Resource__c, SVC_My_Trunk_Stock_Location__c,  Service_Resource__r.Name, FS_City__c, FS_State__c, FS_Country__c 
                               from Location where Name = 'Source Hyderabad']; 
        String param = null;
        Test.startTest();
        List<Schema.Location> LocationRecparams = ReturnOrderHandler.fetchLocations(Loc1.Name);
        Test.stopTest();
        System.assertEquals(LocationRecparams.size()>0,false);
        List<Schema.Location> LocationRecs = ReturnOrderHandler.fetchLocations(param);
        System.assertEquals(LocationRecs.size()>0,false);
    }
    @IsTest
    public static void fetchProducts(){
        Product2 prod2 =[Select Id, Name, ProductCode, Family, FS_Product_Line__c, SVC_OrclEHSDocofDeconReq__c,Manufacturer__c, FS_Unit_Of_Measure__c from Product2 
                         where Name ='Test Product'];
        String param = null;
        Test.startTest();
        List<Product2> ProductRecparams = ReturnOrderHandler.fetchProducts(prod2.Name);
        Test.stopTest();
        System.assertEquals(ProductRecparams.size()>0,true);
        List<Product2> ProductRecs = ReturnOrderHandler.fetchProducts(param);
        System.assertEquals(ProductRecs.size()>0,true);
    }
    @IsTest
    public static void fetchStockedSerials(){
        FS_Product_Serial__c stockedSerial =[Select Id, Name, FS_Product__c, FS_Product__r.Name, FS_Product_Item__r.ProductName, FS_Product_Item__c,FS_Product_Item__r.ProductItemNumber,SVC_OrclLotNumber__c 
                                             from FS_Product_Serial__c where Name ='Test Serial']; 
        String param = null;
        Test.startTest();
        List<FS_Product_Serial__c> stockedSerialRecparams = ReturnOrderHandler.fetchStockedSerials(stockedSerial.Name);
        Test.stopTest();
        System.assertEquals(stockedSerialRecparams.size()>0,true);
        List<FS_Product_Serial__c> stockedSerialRecs = ReturnOrderHandler.fetchStockedSerials(param);
        System.assertEquals(stockedSerialRecs.size()>0,true);
    }
    @IsTest
    public static void insertReturnLines(){
        Schema.Location sloc =[Select Id, Name from Location where Name='Source Hyderabad'];
        Schema.Location tloc =[Select Id, Name from Location where Name='Test Hyderabad'];
        Schema.Location dloc =[Select Id, Name from Location where Name='Destination Hyderabad'];
        ReturnOrder parent = [Select Id, SourceLocationId, DestinationLocationId  from ReturnOrder limit 1];
        ProductItem pi = [Select Id from ProductItem];
        Product2 prod2 =[Select Id, Name, ProductCode, Family, FS_Product_Line__c, SVC_OrclEHSDocofDeconReq__c,Manufacturer__c, FS_Unit_Of_Measure__c from Product2 
                         where Name ='Test Product'];
        String json1 = '[{"index":1,"Product2Id":"'+prod2.Id+'","Product2Name":"'+prod2.Name+'","QuantityReturned":1}]';//{"index":2,"Product2Id":"Null","Product2Name":"Null","QuantityReturned":1,"ProductItemId":"'+pi.Id+'"}
        Test.startTest();
        ReturnOrderHandler.insertReturnLines(json1, parent.Id, dloc.Id, sloc.Id);
        System.assertNotEquals(parent.DestinationLocationId,sloc.Id);
        ReturnOrderLineItem roli = [Select Id, SourceLocationId, DestinationLocationId, ReturnOrderId from ReturnOrderLineItem];
        System.assertEquals(sloc.Id, roli.SourceLocationId);
        Test.stopTest(); 
    }
}