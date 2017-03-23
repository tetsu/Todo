window.onload = function(){
  refreshTodoList();
  refreshDoneList();
}

function showErrorMessage(message){
  document.getElementById('api-return-message').innerHTML = `${message}`;
  document.getElementById('api-alert').className = "alert alert-danger";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
}

function showSuccessMessage(message){
  document.getElementById('api-return-message').innerHTML = `${message}`;
  document.getElementById('api-alert').className = "alert alert-success";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
  //setInterval(document.getElementById('api-alert').setAttribute("style", "visibility:hidden;"), 5000);
}

function refreshTodoList(){
  //remove current todo items
  todoTable = document.getElementById('todo-table');
  while (todoTable.firstChild) {
    todoTable.removeChild(todoTable.firstChild);
  }

  user_id = document.getElementById('user-data').getAttribute("data-id");
  todoLiStSpinner = document.getElementById('todo-list-spinner');

  //show spinner
  todoLiStSpinner.innerHTML = `<i class="fa fa-refresh fa-spin" style="font-size:24px"/></i>`;

  todoApiCall({'callName':'index' ,'request':{user_id, 'done':0}, 'method':'GET' });
}

function refreshDoneList(){
  //remove current done items
  doneTable = document.getElementById('done-table');
  while (doneTable.firstChild) {
    doneTable.removeChild(doneTable.firstChild);
  }

  user_id = document.getElementById('user-data').getAttribute("data-id");
  doneListSpinner = document.getElementById('done-list-spinner');

  //show spinner
  doneListSpinner.innerHTML = `<i class="fa fa-refresh fa-spin" style="font-size:24px"/></i>`;

  todoApiCall({'callName':'done' ,'request':{user_id, 'done':1}, method:'GET' });
}

function addTask(){
  var title = document.getElementById('title-add-input').value;
  var due_date = document.getElementById('due-date-add-input').value;
  var user_id = document.getElementById('user-data').getAttribute("data-id");
  for(var i=1;i<=5;i++){
    if (document.getElementById(`priority-add-input-${i}`).checked) {
      var priority = document.getElementById(`priority-add-input-${i}`).value;
    }
  }
  todoApiCall({'callName':'add' ,'request':{title, due_date, user_id, priority}, 'method':'GET'});
}

function updateTask(){
  var id = document.getElementById('confirm-update-button').getAttribute("data-key");
  var title = document.getElementById('todo-title-edit-input').value;
  var due_date = document.getElementById('due-date-edit-input').value;
  var user_id = document.getElementById('user-data').getAttribute("data-id");
  for(var i=1;i<=5;i++){
    if (document.getElementById(`priority-edit-input-${i}`).checked) {
      var priority = document.getElementById(`priority-edit-input-${i}`).value;
    }
  }
  todoApiCall({'callName':'update' ,'request':{id, title, due_date, user_id, priority}, 'method':'PUT'});
}

function deleteTask(todo_id){
  todoApiCall({'callName':'delete' ,'request':{'id':todo_id}, 'method':'DELETE'});
}

function compTask(id){
  todoApiCall({'callName':'comp' ,'request':{id}, 'method':'PUT'});
}

function editTask(todo_id){
  //empty values in Edit Modal
  document.getElementById('todo-title-edit-input').value = null;
  document.getElementById('due-date-edit-input').value = null;
  document.getElementsByClassName('priority-edit-input').checked=false;

  //API Call
  todoApiCall({'callName':'get_one_todo' ,'request':{todo_id} });
}


function todoApiCall(apiJson){
  //encodeURIComponent
  firstLoop = true;
  reqStr = "";
  for (key in apiJson.request) {
    if(firstLoop){
      reqStr = "?";
      firstLoop = false;
    } else {
      reqStr += "&";
    }
    reqStr += `${key}=${apiJson.request[key]}`;
  }
  var request = new XMLHttpRequest();
  if(apiJson.callName === 'index'
  || apiJson.callName === 'done'
  || apiJson.callName === 'get_one_todo'){
    request.open('GET', '/api/todo'+reqStr, true);
  } else if(apiJson.callName === 'delete'){
    request.open('DELETE', '/api/todo/'+apiJson.request['id'], true);
  } else if(apiJson.callName === 'update'){
    request.open('PUT', '/api/todo/'+apiJson.request['id']+reqStr, true);
  } else if(apiJson.callName === 'add'){
    request.open('GET', '/api/todo/create'+reqStr, true);
  } else {
    request.open('GET', '/api/todo/'+apiJson.callName+reqStr, true);
  }

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
          reflectUpdateRequest(responseJson);
        } else if(apiJson.callName == 'delete'){
          reflectDeleteRequest(responseJson.data);
        }
      }
    } else {
      if(responseJson.status === 'fail' && responseJson.message){
        showErrorMessage(responseJson.message);
      } else {
        showErrorMessage('Database Error');
      }
    }
  };
  request.onerror = function() {
    showErrorMessage('Database Error');
  };
  if(apiJson.method === 'GET'){
    request.send();
  } else {
    request.send(JSON.stringify(apiJson.requst));
  }

}

function reflectGetList(data){
  todoLiStSpinner = document.getElementById('todo-list-spinner');
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
         `<th style="width:40px;" scope="row"><input type="checkbox" name="todo-checkbox" value="${item.id}"></th>
          <td>${item.title}</th>
          <td style="width:100px;">${item.due_date}</td>
          <td style="width:120px;">${priority}</td>
          <td style="width:190px;">
            <button type="button" class="del-btn btn btn-default" data-toggle="modal" data-target="#delModal" data-key="${item.id}">削除</button>
            <button type="button" class="edit-btn btn btn-default" data-toggle="modal" data-target="#editModal" data-key="${item.id}">編集</button>
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
    document.getElementById('todo-list-spinner').innerHTML = `未完了タスクはありません`;
  }

}

function reflectDoneList(data){
  doneListSpinner = document.getElementById('done-list-spinner');
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
         `<th style="width:40px;" scope="row"><input class="done-checkbox" type="checkbox" name="done-checkbox" value="${item.id}"></th>
          <td>${item.title}</td>
          <td style="width:100px;">${item.due_date}</td>
          <td style="width:100px;">${item.comp_date}</td>
          <td style="width:120px;">${priority}</td>
          <td style="width:190px;">
            <button type="button" class="del-btn btn btn-default" data-toggle="modal" data-target="#delModal" data-key="${item.id}">削除</button>
            <button type="button" class="uncomp-btn btn btn-default" data-toggle="modal" data-target="#editModal" data-key="${item.id}">未完にする</button>
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
    document.getElementById('done-list-spinner').innerHTML = `完了タスクはありません`;
  }

}

function reflectAddRequest(data){
  //show success message
  document.getElementById('api-return-message').innerHTML = `「${data.title}」を作成しました。`;
  document.getElementById('api-alert').className = "alert alert-success";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");

  //Reset Add Task form
  document.getElementById('title-add-input').value = "";
  document.getElementById('due-date-add-input').value = Date.now();
  document.getElementById(`priority-add-input-5`).checked = true;
  document.getElementById(`priority-add-input-4`).checked = false;
  document.getElementById(`priority-add-input-3`).checked = false;
  document.getElementById(`priority-add-input-2`).checked = false;
  document.getElementById(`priority-add-input-1`).checked = false;

  refreshTodoList();
}

function reflectUpdateRequest(res){
  refreshTodoList();
  showSuccessMessage(`${res.message}`);
}

function reflectDeleteRequest(data){
  targetTable = data.comp_date ? `done-table` : `todo-table`;
  document.getElementById(targetTable).removeChild(
    document.getElementById(`todo-${data.id}`)
  );
  showSuccessMessage(`「${data.title}」を削除しました。`);
}

function reflectEditRequest(data){
  document.getElementById('todo-title-edit-input').value = data.title;
  document.getElementById('due-date-edit-input').value = data.due_date;
  document.getElementById(`priority-edit-input-${data.priority}`).setAttribute("checked", true);
  document.getElementById("confirm-update-button").setAttribute("data-key", data.id);

}

document.addEventListener('click', function (event) {
  if (event.target.className.split(" ")[0] ==='edit-btn') {
    editTask(event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='del-btn') {
    console.log('test');
    document.getElementById("confirm-delete-button").setAttribute("data-key", event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='done-del-btn') {
    document.getElementById("confirm-delete-button").setAttribute("data-key", event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='comp-btn') {
    compTask(event.target.getAttribute("data-key"));
  } else if (event.target.id === 'confirm-delete-button'){
    deleteTask(event.target.getAttribute("data-key"));
  } else if (event.target.id === 'confirm-update-button'){
    updateTask();
  } else if (event.target.id === 'confirm-add-button'){
    addTask();
  }
});
