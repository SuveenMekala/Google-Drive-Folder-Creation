function onOpen(){
  var ss = SpreadsheetApp.getActiveSpreadsheet(),
  menuItems = [
    { name: "Create Folders",
      functionName: "createFolders"
    }
  ];
  ss.addmenu("Create Multiple Child Folders", menuItems);
}
