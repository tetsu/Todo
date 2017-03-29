//Initialize the main page with the latest todo and done lists
window.onload = function(){
  refreshTodoList();
  refreshDoneList();
}

//Show error messages on the main page as a modal
function showErrorMessage(message){
  document.getElementById('api-return-message').innerHTML = `${message}`;
  document.getElementById('api-alert').className = "alert alert-danger";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
  setTimeout(function(){
    document.getElementById('api-alert').setAttribute("style", "visibility:hidden;");
  }, 5000);
}

//Show success messages on the main screen as a modal
function showSuccessMessage(message){
  document.getElementById('api-return-message').innerHTML = `${message}`;
  document.getElementById('api-alert').className = "alert alert-success";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
  setTimeout(function(){
    document.getElementById('api-alert').setAttribute("style", "visibility:hidden;");
  }, 5000);
}

//Refresh the todo list on the main page
function refreshTodoList(){
  //remove current todo items
  todoTable = document.getElementById('todo-table');
  while (todoTable.firstChild) {
    todoTable.removeChild(todoTable.firstChild);
  }

  user_id = document.getElementById('user-data').getAttribute("data-id");
  todoLiStSpinner = document.getElementById('todo-table-spinner');

  //show spinner
  todoLiStSpinner.innerHTML = `<i class="fa fa-refresh fa-spin" style="font-size:24px"/></i>`;

  todoApiCall({'callName':'index' ,'request':{user_id, 'done':0}, 'method':'GET' });
}

//Refresh the done list on the main page
function refreshDoneList(){
  //remove current done items
  doneTable = document.getElementById('done-table');
  while (doneTable.firstChild) {
    doneTable.removeChild(doneTable.firstChild);
  }

  user_id = document.getElementById('user-data').getAttribute("data-id");
  doneListSpinner = document.getElementById('done-table-spinner');

  //show spinner
  doneListSpinner.innerHTML = `<i class="fa fa-refresh fa-spin" style="font-size:24px"/></i>`;

  todoApiCall({'callName':'done' ,'request':{user_id, 'done':1}, method:'GET' });
}

//Add task
//Get information from Add Task modal.
function addTask(){
  var title = document.getElementById('title-add-input').value;
  var due_date = document.getElementById('due-date-add-input').value;
  var user_id = document.getElementById('user-data').getAttribute("data-id");
  for(var i=1;i<=5;i++){
    if (document.getElementById(`priority-add-input-${i}`).checked) {
      var priority = document.getElementById(`priority-add-input-${i}`).value;
    }
  }
  var detail = document.getElementById('detail-add-input').value;
  todoApiCall({'callName':'add' ,'request':{title, due_date, user_id, priority, detail}, 'method':'GET'});
}

//Add task
//Get information from Edit Task modal.
function updateTask(){
  var id = document.getElementById('confirm-update-button').getAttribute("data-key");
  var title = document.getElementById('todo-title-edit-input').value;
  var due_date = document.getElementById('due-date-edit-input').value;
  var comp_date = document.getElementById('comp-date-edit-input').value;
  var user_id = document.getElementById('user-data').getAttribute("data-id");
  for(var i=1;i<=5;i++){
    if (document.getElementById(`priority-edit-input-${i}`).checked) {
      var priority = document.getElementById(`priority-edit-input-${i}`).value;
    }
  }
  var detail = document.getElementById('detail-edit-input').value;
  todoApiCall({'callName':'update' ,'request':{id, title, due_date, comp_date, user_id, priority, detail}, 'method':'PUT'});
}

//Delete one task.
function deleteTask(todo_id){
  todoApiCall({'callName':'delete' ,'request':{'id':todo_id}, 'method':'DELETE'});
}

//Set one task as completed
function compTask(id){
  todoApiCall({'callName':'comp' ,'request':{id, 'comp_date':getToday()}, 'method':'PUT'});
}

//Set one task as incompleted
function uncompTask(id){
  todoApiCall({'callName':'comp' ,'request':{id, 'comp_date':'uncomp'}, 'method':'PUT'});
}

//Delete multiple tasks
function deleteTasks(ids){
  todoApiCall({'callName':'group' ,'request':{ids, 'action':'delete'}, 'method':'POST'});
}

//Set multiple tasks as completed
function compTasks(ids){
  todoApiCall({'callName':'group' ,'request':{ids, 'action':'comp'}, 'method':'POST'});
}

//Set multiple tasks as incompleted
function uncompTasks(ids){
  todoApiCall({'callName':'group' ,'request':{ids, 'action':'uncomp'}, 'method':'POST'});
}

//Edit one tasks
//Clean up Edit modal first.
function editTask(todo_id){
  //empty values in Edit Modal
  document.getElementById('todo-title-edit-input').value = null;
  document.getElementById('due-date-edit-input').value = null;
  document.getElementById('comp-date-edit-input').value = null;
  document.getElementById('detail-edit-input').value = null;
  document.getElementsByClassName('priority-edit-input').checked=false;

  //API Call
  todoApiCall({'callName':'get_one_todo' ,'request':{todo_id}, 'method':'GET'});
}

//Get today's date
function getToday(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) dd='0'+dd;
  if(mm<10) mm='0'+mm;
  return `${yyyy}-${mm}-${dd}`;
}

//Get tasks which checkboxes are checked
// Return: Array of IDs of checked tasks
function getCheckedItems(group_name){
  var checkedItems = document.getElementsByClassName(`${group_name}-checkbox`);
  var delKeys = [];
  [].forEach.call(checkedItems, function (item) {
    if(item.checked){
      delKeys.push(item.getAttribute('data-key'));
    }
  });
  return delKeys;
}

//Activate Todo group buttons to delete/complete multiple tasks when there are checked tasks.
function activateTodoGroupButtons(){
  var checkedItems = getCheckedItems('todo');
  if(checkedItems.length > 0){
    document.getElementById('todo-group-del-btn').disabled = "";
    document.getElementById('todo-group-comp-btn').disabled = "";
    document.getElementById('todo-group-delete-confirm-button').setAttribute('data-key', `[${checkedItems}]`);
    document.getElementById('todo-group-comp-confirm-button').setAttribute('data-key', `[${checkedItems}]`);
  } else {
    document.getElementById('todo-group-del-btn').disabled = "true";
    document.getElementById('todo-group-comp-btn').disabled = "true";
    document.getElementById('todo-group-delete-confirm-button').setAttribute('data-key', ``);
    document.getElementById('todo-group-comp-confirm-button').setAttribute('data-key', ``);
  }
}

//Activate Done group buttons to delete/incomplete multiple tasks when there are checked tasks.
function activateDoneGroupButtons(){
  var checkedItems = getCheckedItems('done');
  if(checkedItems.length > 0){
    document.getElementById('done-group-del-btn').disabled = "";
    document.getElementById('done-group-uncomp-btn').disabled = "";
    document.getElementById('done-group-delete-confirm-button').setAttribute('data-key', `[${checkedItems}]`);
    document.getElementById('done-group-uncomp-confirm-button').setAttribute('data-key', `[${checkedItems}]`);
  } else {
    document.getElementById('done-group-del-btn').disabled = "true";
    document.getElementById('done-group-uncomp-btn').disabled = "true";
    document.getElementById('done-group-delete-confirm-button').setAttribute('data-key', ``);
    document.getElementById('done-group-uncomp-confirm-button').setAttribute('data-key', ``);
  }
}

//Handle all the API calls
function todoApiCall(apiJson){
  reqStr = "";

  //Generate request strings
  if(apiJson.method === 'GET' || apiJson.method === 'PUT'){
    firstLoop = true;
    for (key in apiJson.request) {
      if(firstLoop){firstLoop = false;}
      else {reqStr += "&";}
      reqStr += `${key}=${apiJson.request[key]}`;
    }
  } else if(apiJson.method === 'POST') {
    reqStr = JSON.stringify(apiJson.request);
  }

  //Set API request URIs
  var request = new XMLHttpRequest();
  if(apiJson.callName === 'index' || apiJson.callName === 'done' || apiJson.callName === 'get_one_todo'){
    request.open('GET', '/api/todo?'+reqStr, true);
  } else if(apiJson.callName === 'add'){
    request.open('GET', '/api/todo/create?'+reqStr, true);
  } else if(apiJson.callName === 'delete'){
    request.open('DELETE', '/api/todo/'+apiJson.request['id'], true);
  } else if(apiJson.callName === 'update' || apiJson.callName === 'comp'){
    request.open('PUT', '/api/todo/'+apiJson.request['id']+'?'+reqStr, true);
  } else if(apiJson.callName === 'group'){
    request.open('POST', '/api/todo', true);
  }

  //Actions after API callbacks
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var responseJson = JSON.parse(request.responseText);
      if(responseJson.status == 'success'){
        if(apiJson.callName == 'index'){
          reflectGetList(responseJson.data);
        } else if(apiJson.callName == 'done'){
          reflectDoneList(responseJson.data);
        } else if(apiJson.callName == 'get_one_todo'){
          reflectEditRequest(responseJson.data);
        } else if(apiJson.callName == 'add'){
          reflectAddRequest(responseJson.data);
        } else if(apiJson.callName == 'update'){
          updateAllLists(responseJson);
        } else if(apiJson.callName == 'comp'){
          updateAllLists(responseJson);
        } else if(apiJson.callName == 'delete'){
          reflectDeleteRequest(responseJson.data);
        } else if(apiJson.callName == 'group'){
          updateAllLists(responseJson);
        }
      } else {
        if(responseJson.status === 'fail' && responseJson.message){
          showErrorMessage(responseJson.message);
        } else {
          showErrorMessage('Error');
        }
      }
    } else {
      showErrorMessage('Error');
    }
  };
  //show error message
  request.onerror = function() {
    showErrorMessage('Database Error');
  };

  //Sent request
  if(apiJson.method === 'GET' || apiJson.method === 'PUT' || apiJson.method === 'DELETE'){
    request.send();
  } else {
    request.send(reqStr);
  }

}


//Show Todo task list on the main page
function reflectGetList(data){
  todoLiStSpinner = document.getElementById('todo-table-spinner');
  if(data.length > 0){
    data.map(function(item){
      if(typeof item.due_date == 'undefined') item.due_date = "未定";
      var priority = '';
      if(item.priority == 5){priority = '最重要';}
      else if(item.priority == 4){priority = '重要';}
      else if(item.priority == 3){priority = '普通';}
      else if(item.priority == 2){priority = '重要でない';}
      else if(item.priority == 1){priority = '全く重要でない';}
      var todoList = document.createElement("tr");
      todoList.id = `todo-${item.id}`;
      todoList.innerHTML =
         `<th style="width:120px;" scope="row"><input id="todo-checkbox-${item.id}" class="todo-checkbox" type="checkbox" name="todo-checkbox" data-key="${item.id}" value="${item.id}"></th>
          <td class="edit-btn" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}">${item.title}</th>
          <td class="edit-btn" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}" style="width:100px;">${item.due_date}</td>
          <td class="edit-btn" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}" style="width:120px;">${priority}</td>
          <td style="width:190px;">
            <button type="button" class="del-btn btn btn-default" data-toggle="modal" data-target="#delModal" data-key="${item.id}">削除</button>
            <button type="button" class="edit-btn btn btn-default" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}">詳細</button>
            <button type="button" class="comp-btn btn btn-success" data-toggle="modal" data-target="#compModal" data-key="${item.id}">完了</button>
          </td>`;
      var listElement = document.getElementById("todo-table").appendChild(todoList);
    });
    //remove spinner
    while (todoLiStSpinner.firstChild) {
      todoLiStSpinner.removeChild(todoLiStSpinner.firstChild);
    }
  } else {
    //remove spinner
    while (todoLiStSpinner.firstChild) {
      todoLiStSpinner.removeChild(todoLiStSpinner.firstChild);
    }
    document.getElementById('todo-table-spinner').innerHTML = `未完了タスクはありません`;
  }

}

//Show Done task list on the main page
function reflectDoneList(data){
  doneListSpinner = document.getElementById('done-table-spinner');
  if(data.length > 0){
    data.map(function(item){
      if(typeof item.due_date == 'undefined') item.due_date = "未定";
      var priority = '';
      if(item.priority == 5){priority = '最重要';}
      else if(item.priority == 4){priority = '重要';}
      else if(item.priority == 3){priority = '普通';}
      else if(item.priority == 2){priority = '重要でない';}
      else if(item.priority == 1){priority = '全く重要でない';}
      var doneList = document.createElement("tr");
      doneList.id = `todo-${item.id}`;
      doneList.innerHTML =
         `<th style="width:120px;" scope="row"><input id="done-checkbox-${item.id}" class="done-checkbox" type="checkbox" name="done-checkbox" data-key="${item.id}" value="${item.id}"></th>
          <td class="edit-btn" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}">${item.title}</td>
          <td class="edit-btn" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}" style="width:100px;">${item.comp_date}</td>
          <td class="edit-btn" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}" style="width:120px;">${priority}</td>
          <td style="width:190px;">
            <button type="button" class="del-btn btn btn-default" data-toggle="modal" data-target="#delModal" data-key="${item.id}">削除</button>
            <button type="button" class="edit-btn btn btn-default" data-toggle="modal" data-target="#editTodoModal" data-key="${item.id}">詳細</button>
            <button type="button" class="uncomp-btn btn btn-default" data-key="${item.id}">未完</button>
          </td>`;
      var listElement = document.getElementById("done-table").appendChild(doneList);
    });
    //remove spinner
    while (doneListSpinner.firstChild) {
      doneListSpinner.removeChild(doneListSpinner.firstChild);
    }
  } else {
    //remove spinner
    while (doneListSpinner.firstChild) {
      doneListSpinner.removeChild(doneListSpinner.firstChild);
    }
    document.getElementById('done-table-spinner').innerHTML = `完了タスクはありません`;
  }

}

//Show updated todo and done tasks after API calls
function updateAllLists(res){
  refreshTodoList();
  refreshDoneList();
  if(res.message) showSuccessMessage(res.message);
  activateTodoGroupButtons();
  activateDoneGroupButtons();
}

//Show added Task
//Clean up Add Task Modal first.
function reflectAddRequest(data){
  //show success message
  showSuccessMessage(`「${data.title}」を作成しました。`);

  //Reset Add Task form
  document.getElementById('title-add-input').value = "";
  document.getElementById('due-date-add-input').value = getToday();
  document.getElementById(`priority-add-input-5`).checked = true;
  document.getElementById(`priority-add-input-4`).checked = false;
  document.getElementById(`priority-add-input-3`).checked = false;
  document.getElementById(`priority-add-input-2`).checked = false;
  document.getElementById(`priority-add-input-1`).checked = false;

  refreshTodoList();
}

function reflectDeleteRequest(data){
  targetTable = data.comp_date ? `done-table` : `todo-table`;
  document.getElementById(targetTable).removeChild(document.getElementById(`todo-${data.id}`));
  if(!document.getElementById(targetTable).firstChild){
    var mi = '';
    if(targetTable === 'todo-table') mi = '未';
    document.getElementById(`${targetTable}-spinner`).innerHTML = `${mi}完了タスクはありません`;
  }
  //data.comp_date ? refreshDoneList() : refreshTodoList() ;
  showSuccessMessage(`「${data.title}」を削除しました。`);
}

function reflectEditRequest(data){
  document.getElementById('todo-title-edit-input').value = data.title;
  document.getElementById('due-date-edit-input').value = data.due_date;
  document.getElementById('comp-date-edit-input').value = data.comp_date;
  document.getElementById(`priority-edit-input-${data.priority}`).setAttribute("checked", true);
  document.getElementById('detail-edit-input').value = data.detail;
  document.getElementById("confirm-update-button").setAttribute("data-key", data.id);
}

//Event Listeners
document.addEventListener('click', function (event) {
  if (event.target.className.split(" ")[0] ==='edit-btn') {
    editTask(event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='del-btn') {
    document.getElementById("confirm-delete-button").setAttribute("data-key", event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='comp-btn') {
    compTask(event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='uncomp-btn') {
    uncompTask(event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='todo-checkbox') {
    activateTodoGroupButtons();
  } else if (event.target.className.split(" ")[0] ==='done-checkbox') {
    activateDoneGroupButtons();
  } else if (event.target.id === 'confirm-delete-button'){
    deleteTask(event.target.getAttribute("data-key"));
  } else if (event.target.id === 'confirm-update-button'){
    updateTask();
  } else if (event.target.id === 'confirm-add-button'){
    addTask();
  } else if (event.target.id === 'todo-group-delete-confirm-button'){
    deleteTasks(document.getElementById('todo-group-delete-confirm-button').getAttribute('data-key'));
  } else if (event.target.id === 'todo-group-comp-confirm-button'){
    compTasks(document.getElementById('todo-group-comp-confirm-button').getAttribute('data-key'));
  } else if (event.target.id === 'done-group-delete-confirm-button'){
    deleteTasks(document.getElementById('done-group-delete-confirm-button').getAttribute('data-key'));
  } else if (event.target.id === 'done-group-uncomp-confirm-button'){
    uncompTasks(document.getElementById('done-group-uncomp-confirm-button').getAttribute('data-key'));
  }
});
