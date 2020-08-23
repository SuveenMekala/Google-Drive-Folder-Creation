//Parameters needed:
//1)  Parent folder URL
//(since id is needed for the GDrive API, we will obtain it using a formula on the spreadsheet)
//2)  List of child folder names
//Return: The folder id's of the newly created folders
//Create 2 sheets:
//one will be called Create Folders(This is our main sheet)
//and the other is called File Mapping(Returned Id's are stored here)

//This function creates the folders and calls the function to get the id's of the newly created folders
function createFolders(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Create Folders');
  var lastRow = sheet.getMaxRows()-2; //adjust based on the sheet setup
  var folderNames = sheet.getRange(2,1,lastRow,1).getValues();
  var parentFolderURL = sheet.getRange(2,2).getValue();
  if (parentFolderURL === "") {
    SpreadsheetApp.getUi().alert('Parent folder URL in cell C2 is blank');
  }
  if (parentFolderURL !== "") {
    //Getting the folder ID from the parentFolderURL
    var parentfolderId = parentFolderURL.match(/[-\w]{25,}/);
    var getparentFolderId = DriveApp.getFolderById(parentfolderId);
    for (i=0;i<lastRow;i++){
      if(folderNames[i] == ""){
        SpreadsheetApp.getUi().alert('Error in one or more folder names in Column A');
        break;
      }
      var childFolder = getparentFolderId.createFolder(folderNames[i]); //Bulk creation of folders
    }
    ss.toast("Folder Creation Status: ", "SUCCESS", 5);
  }
  listAllFoldersUnderRootFolder()
}

function listAllFoldersUnderRootFolder(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Create Folders');
  var parentFolderURL = sheet.getRange(2,2).getValue();
  if (parentFolderURL !== "") {
    //Getting the folder ID from the parentFolderURL
    var parentfolderId = parentFolderURL.match(/[-\w]{25,}/);
  }
  var getparentFolderId = DriveApp.getFolderById(parentfolderId);
  var updateSheet = ss.getSheetByName('File Mapping')
  //Logger.log("Folder details"+getparentFolderId)
  var list = [];
  list.push('Name','Folder ID', 'Parent Folder ID'); //Can be adjusted per requirement
  var childFolders = getparentFolderId.getFolders();
  //Logger.log("Child Folder details"+childFolders)
  while(childFolders.hasNext()){
    childFolder = childFolders.next();
    var row = []
    row.push(childFolder.getName(), childFolder.getId(),getparentFolderId)
    list.push(row);
  }
  updateSheet.getRange(1,1,list.length,list[0].length).setValues(list);
}
