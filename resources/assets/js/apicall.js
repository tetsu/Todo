function addNewEventGroup(event_id){
  if(document.getElementById('new_event_group').value !== ""){
    todoApiCall({'callName':'add' ,'request':{'event_id':event_id, 'value':document.getElementById('new_event_group').value}});
  } else {
    console.log("Input value is empty.");
  }

}

function updateEventGroupName(event_group_id){
  if(document.getElementById(`event_group_input_${event_group_id}`).value !== "" ){
    todoApiCall({'callName':'update' ,'request':{'id':event_group_id, 'value':document.getElementById(`event_group_input_${event_group_id}`).value}});
  } else {
    console.log("Input Value is empty.");
  }

}

function deleteEventGroup(event_group_id){
    todoApiCall({'callName':'delete' ,'request':{'id':event_group_id}});
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
  request.open('GET', '/api/todo/'+apiJson.callName+requestString, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var responseJson = JSON.parse(request.responseText);
      if(responseJson.status == 'success'){
        if(apiJson.callName == 'add'){
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
    document.getElementById(`event-group-list`).removeChild(
      document.getElementById(`event_group_${data.event_group_id}`)
    );
    document.getElementById('event_group_message').innerHTML = "イベントグループ削除成功。";
  }
