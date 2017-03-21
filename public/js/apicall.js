function addTodo(user_id){
  if(document.getElementById('new_event_group').value !== ""){
    todoApiCall({'callName':'add' ,'request':{'event_id':event_id, 'value':document.getElementById('new_event_group').value}});
  } else {
    console.log("Input value is empty.");
  }

}

function updateTodo(event_group_id){
  if(document.getElementById(`event_group_input_${event_group_id}`).value !== "" ){
    todoApiCall({'callName':'update' ,'request':{'id':event_group_id, 'value':document.getElementById(`event_group_input_${event_group_id}`).value}});
  } else {
    console.log("Input Value is empty.");
  }

}

function deleteTodo(todo_id){
    todoApiCall({'callName':'delete' ,'request':{'id':todo_id}});
}


function todoApiCall(apiJson){
  firstLoop = true;
  requestString = "";
  for (key in apiJson.request) {
    if(firstLoop){
      requestString = "?";
      firstLoop = false;
    } else {
      requestString += "&";
    }
    requestString += `${key}=${apiJson.request[key]}`;
  }
  var request = new XMLHttpRequest();
  if(apiJson.callName === 'index'){
    request.open('GET', '/api/todo'+requestString, true);
  } else if(apiJson.callName === 'delete'){
    request.open('DELETE', '/api/todo/'+apiJson.request['id'], true);
  } else {
    request.open('GET', '/api/todo/'+apiJson.callName+requestString, true);
  }
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var responseJson = JSON.parse(request.responseText);
      if(responseJson.status == 'success'){
        if(apiJson.callName == 'index'){
          reflectGetList(responseJson.data);
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
  if(data.length > 0){
    data.map(function(item){
      if(typeof item.start_at == 'undefined') item.start_at = "未定";
      var todoList = document.createElement("tr");
      todoList.id = `todo-${item.id}`;
      todoList.innerHTML =
         `<th scope="row">${item.title}</th>
          <td>${item.start_at}</td>
          <td>
            <button type="button" class="edit-btn btn btn-default" data-toggle="modal" data-target="#editModal" data-key="${item.id}">編集</button>
            <button type="button" class="del-btn btn btn-default" data-toggle="modal" data-target="#delModal" data-key="${item.id}">削除</button>
          </td>`;
      var listElement = document.getElementById("todo-table").appendChild(todoList);
    });
  } else {
    document.getElementById('api-return-message').innerHTML = `未完了タスクがありません`;
    document.getElementById('api-alert').className = "alert alert-warning";
    document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
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
  document.getElementById(`event_group_input_${data.event_group_id}`).value = data.name;
  document.getElementById('event_group_message').innerHTML = "イベントグループ名更新成功。";
}

function reflectDeleteRequest(data){
  document.getElementById(`todo-table`).removeChild(
    document.getElementById(`todo-${data.id}`)
  );
  document.getElementById('api-return-message').innerHTML = `${data.title}削除成功。`;
  document.getElementById('api-alert').className = "alert alert-success";
  document.getElementById('api-alert').setAttribute("style", "visibility:visible;");
}

document.addEventListener('click', function (event) {
  if (event.target.className.split(" ")[0] ==='edit-btn') {
    console.log(event.target.getAttribute("data-key"));
  } else if (event.target.className.split(" ")[0] ==='del-btn') {
    document.getElementById("delete-button").setAttribute("data-key", event.target.getAttribute("data-key"));
  } else if (event.target.id === 'delete-button'){
    return deleteTodo(event.target.getAttribute("data-key"));
  }
});
