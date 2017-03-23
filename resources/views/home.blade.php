@extends('layouts.app')

@section('content')
<div id="main">
<div id="user-data" data-id="{{$id}}"></div>
<div class="container">
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div id="api-alert" class="alert alert-success" role="alert" aria-hidden="true" style="visibility:hidden;">
          <strong id="api-return-message"></strong>
        </div>
        <div><button type=button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#addModal">タスク追加</button></div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <table class="table table-striped">
          <thead class="thead-inverse">
            <tr>
              <th><button class="btn btn-info btn-sm">削除</button></th>
              <th><button class="btn btn-info btn-sm">完了</button></th>
              <th>未完タスク</th>
              <th>予定日</th>
              <th>優先度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="todo-table">
          </tbody>
        </table>
        <div id="todo-table-spinner" style="text-align: center;">
          <i class="fa fa-refresh fa-spin" style="font-size:24px"/></i>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <table class="table table-striped">
          <thead class="thead-inverse">
            <tr>
              <th><button class="btn btn-info btn-sm">削除</button></th>
              <th><button class="btn btn-info btn-sm">未完</button></th>
              <th>完了タスク</th>
              <th>予定日</th>
              <th>完了日</th>
              <th>優先度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="done-table">
          </tbody>
        </table>
        <div id="done-table-spinner" style="text-align: center;">
          <i class="fa fa-refresh fa-spin" style="font-size:24px"/></i>
        </div>
      </div>
    </div>
</div>

<!-- TODO追加モーダル -->
<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">タスク作成</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">タスク</label>
            <input id="title-add-input" type="text" class="form-control" id="todo-title-input">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">完了予定日</label>
            <input id="due-date-add-input" type="date" class="form-control" min="{{date("Y-m-d")}}" max="2050-12-31" value="{{date("Y-m-d")}}">
          </div>
          <div class="form-group">
            <label for="message-text" class="form-control-label">優先度</label>
            <div>
              <input id="priority-add-input-5" type="radio" name="priority" value="5" checked> 最重要
              <input id="priority-add-input-4" type="radio" name="priority" value="4"> 重要
              <input id="priority-add-input-3" type="radio" name="priority" value="3"> 普通
              <input id="priority-add-input-2" type="radio" name="priority" value="2"> 重要でない
              <input id="priority-add-input-1" type="radio" name="priority" value="1"> 全く重要でない
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button id="confirm-add-button" type="button" class="btn btn-primary" data-dismiss="modal">作成</button>
      </div>
    </div>
  </div>
</div>

<!-- TODO編集モーダル -->
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">タスク編集</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">タスク</label>
            <input id="todo-title-edit-input" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">完了予定日</label>
            <input id="due-date-edit-input" type="date" class="form-control">
          </div>
          <div class="form-group">
            <label for="message-text" class="form-control-label">優先度</label>
            <div>
              <input id="priority-edit-input-5" class="priority-edit-input" type="radio" name="priority" value="5"> 最重要
              <input id="priority-edit-input-4" class="priority-edit-input" type="radio" name="priority" value="4"> 重要
              <input id="priority-edit-input-3" class="priority-edit-input" type="radio" name="priority" value="3"> 普通
              <input id="priority-edit-input-2" class="priority-edit-input" type="radio" name="priority" value="2"> 重要でない
              <input id="priority-edit-input-1" class="priority-edit-input" type="radio" name="priority" value="1"> 全く重要でない
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button id="confirm-update-button" type="button" class="btn btn-primary" data-dismiss="modal">更新</button>
      </div>
    </div>
  </div>
</div>


<!-- TODO削除モーダル -->
<div class="modal fade" id="delModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">タスク削除</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        このTODOを削除しますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="delete-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="confirm-delete-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>

</div>
<script src="{{ asset('js/apicall.js') }}"></script>
<script src="{{ asset('js/bootstrap.js') }}"></script>
@endsection
