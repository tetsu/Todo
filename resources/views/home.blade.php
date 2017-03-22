@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div id="api-alert" class="alert alert-success" role="alert" aria-hidden="true" style="visibility:hidden;">
          <strong id="api-return-message"></strong>
        </div>
        <div><button type=button class="btn btn-primary" data-toggle="modal" data-target="#addModal">TODO追加</button></div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <table class="table table-striped">
          <thead class="thead-inverse">
            <tr>
              <th>未完タスク</th>
              <th>予定日</th>
              <th>優先度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="todo-table">
          </tbody>
        </table>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <table class="table table-striped">
          <thead class="thead-inverse">
            <tr>
              <th>完了タスク</th>
              <th>予定日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="done-table">
          </tbody>
        </table>
      </div>
    </div>
</div>

<!-- TODO追加モーダル -->
<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">新規TODO作成</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">タスク名</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">完了予定日</label>
            <input type="date" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="message-text" class="form-control-label">優先度</label>
            <div>
              <input type="radio" name="q1" value="5"> 最重要
              <input type="radio" name="q1" value="4"> 重要
              <input type="radio" name="q1" value="3"> 普通
              <input type="radio" name="q1" value="2"> 重要でない
              <input type="radio" name="q1" value="1"> 全く重要でない
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" class="btn btn-primary">作成</button>
      </div>
    </div>
  </div>
</div>

<!-- TODO編集モーダル -->
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">TODO編集</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">タイトル</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">開始日</label>
            <input type="date" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">開始時間</label>
            <input type="time" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">終了日</label>
            <input type="date" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">終了時間</label>
            <input type="time" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="message-text" class="form-control-label">詳細</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" class="btn btn-primary">作成</button>
      </div>
    </div>
  </div>
</div>


<!-- TODO削除モーダル -->
<div class="modal fade" id="delModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">削除</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        このTODOを削除しますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="delete-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="delete-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>

<script>
window.onload = function(){
  user_id = {{$id}};
  todoApiCall({'callName':'index' ,'request':{'user_id':user_id, 'done':0} });
}
</script>
<script src="{{ asset('js/apicall.js') }}"></script>
<script src="{{ asset('js/bootstrap.js') }}"></script>
@endsection
