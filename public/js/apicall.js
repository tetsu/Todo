window.onload = function(){
  refreshTodoList();
  refreshDoneList();
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

function addTask(user_id){
  if(document.getElementById('new_event_group').value !== ""){
    todoApiCall({
      'callName':'add',
      'request':{event_id, 'value':document.getElementById('new_event_group').value},
      'method':'POST'
    });
  } else {
    console.log("Input value is empty.");
  }

}

function updateTask(update_data){
  todoApiCall({'callName':'update' ,'request':update_data, 'method':'PUT'});
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
          reflectUpdateRequest(responseJson.data);
        } else if(apiJson.callName == 'delete'){
          reflectDeleteRequest(responseJson.data);
        }
      }
    } else {
      console.log('error');
    }
  };
  request.onerror = function() {
    console.log('error');
  };
  request.send();
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
      var todoList = document.createElement("tr");
      todoList.id = `todo-${item.id}`;
      todoList.innerHTML =
         `<th style="width:40px;" scope="row"><input class="done-checkbox" type="checkbox" name="done-checkbox" value="${item.id}"></th>
          <td>${item.title}</td>
          <td style="width:100px;">${item.due_date}</td>
          <td style="width:100px;">${item.comp_date}</td>
          <td style="width:120px;">${priority}</td>
          <td style="width:190px;">
            <button type="button" class="del-done-btn btn btn-default" data-toggle="modal" data-target="#delModal" data-key="${item.id}">削除</button>
            <button type="button" class="uncomp-btn btn btn-default" data-toggle="modal" data-target="#editModal" data-key="${item.id}">未完にする</button>
          </td>`;
      var listElement = document.getElementById("done-table").appendChild(todoList);
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
    var newList = document.createElement("li");
    newList.id = `event_group_${data.event_group_id}`;
    newList.innerHTML =
      `<input id="event_group_input_${data.event_group_id}" value="${data.name}"></input>
      <button onclick="updateEventGroupName(${data.event_group_id})">イベントグループ名更新</button>
      <button onclick="deleteEventGroup(${data.event_group_id})">削除</button>`;
    var listElement = document.getElementById("event-group-list").appendChild(newList);
    document.getElementById('new_event_group').value = "";
    document.getElementById('event_group_message').innerHTML = "イベントグループ追加成功。";
  }

function reflectUpdateRequest(data){
  refreshTodoList();
  document.getElementById('api-return-message').innerHTML = `「${data.title}」を更新しました。`;
  document.getElementById('api-alert').className = "alert alert-success";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
}

function reflectDeleteRequest(data){
  document.getElementById(`todo-table`).removeChild(
    document.getElementById(`todo-${data.id}`)
  );
  document.getElementById('api-return-message').innerHTML = `「${data.title}」を削除しました。`;
  document.getElementById('api-alert').className = "alert alert-success";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
}

function reflectEditRequest(data){
  document.getElementById('todo-title-edit-input').value = data.title;
  document.getElementById('due-date-edit-input').value = data.due_date;
  document.getElementById(`priority-edit-input-${data.priority}`).setAttribute("checked", true);
  document.getElementById("update-button").setAttribute("data-key", data.id);

}

document.addEventListener('click', function (event) {
  if (event.target.className.split(" ")[0] ==='edit-btn') {
    editTask(event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='del-btn') {
    document.getElementById("delete-button").setAttribute("data-key", event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='comp-btn') {
    compTask(event.target.getAttribute("data-key"));
  } else if (event.target.id === 'delete-button'){
    deleteTask(event.target.getAttribute("data-key"));
  } else if (event.target.id === 'update-button'){
    var id = event.target.getAttribute("data-key");
    var title = document.getElementById('todo-title-edit-input').value;
    var due_date = document.getElementById('due-date-edit-input').value;
    var user_id = document.getElementById('user-data').getAttribute("data-id");
    for(var i=1;i<=5;i++){
      if (document.getElementById(`priority-edit-input-${i}`).checked) {
        var priority = document.getElementById(`priority-edit-input-${i}`).value;
      }
    }
    return updateTask({id, title, due_date, priority, user_id});
  }
});
