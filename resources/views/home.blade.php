@extends('layouts.app')

@section('content')
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
              <th>
                <span><button id="todo-group-comp-btn" class="todo-group-comp-btn btn btn-info btn-sm" data-toggle="modal" data-target="#todoGroupCompModal" disabled>完了</button></span>
                <span><button id="todo-group-del-btn" class="todo-group-del-btn btn btn-info btn-sm" data-toggle="modal" data-target="#todoGroupDelModal" disabled>削除</button></span>
              </th>
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
              <th>
                <span><button id="done-group-uncomp-btn" class="group-uncomp-btn btn btn-info btn-sm" data-toggle="modal" data-target="#doneGroupUncompModal" disabled>未完</button></span>
                <span><button id="done-group-del-btn" class="done-group-del-btn btn btn-info btn-sm" data-toggle="modal" data-target="#doneGroupDelModal" disabled>削除</button></span>
              </th>
              <th>完了タスク</th>
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
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">詳細</label>
            <textarea class="form-control" id="detail-add-input"></textarea>
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
<div class="modal fade bd-example-modal-lg" id="editTodoModal" tabindex="-1" role="dialog" aria-labelledby="editTodoModalLabel" aria-hidden="true">
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
            <label for="recipient-name" class="form-control-label">完了日</label>
            <input id="comp-date-edit-input" type="date" class="form-control">
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
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">詳細</label>
            <textarea class="form-control" id="detail-edit-input"></textarea>
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
<div class="modal fade" id="delModal" tabindex="-1" role="dialog" aria-labelledby="deleteTodoModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">タスク削除</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        このタスクを削除しますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="delete-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="confirm-delete-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>

<!-- TODOまとめ削除モーダル -->
<div class="modal fade" id="todoGroupDelModal" tabindex="-1" role="dialog" aria-labelledby="todoGroupDelModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">タスク削除</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        未完タスクをまとめて削除しますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="todo-group-delete-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="todo-group-delete-confirm-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>

<!-- DONEまとめ削除モーダル -->
<div class="modal fade" id="doneGroupDelModal" tabindex="-1" role="dialog" aria-labelledby="doneGroupDelModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">タスク削除</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        完了タスクをまとめて削除しますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="done-group-delete-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="done-group-delete-confirm-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>

<!-- TODOまとめ完了モーダル -->
<div class="modal fade" id="todoGroupCompModal" tabindex="-1" role="dialog" aria-labelledby="todoGroupCompModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">未完タスクをまとめて完了</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        未完タスクをまとめて完了にしますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="todo-group-comp-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="todo-group-comp-confirm-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>

<!-- DONEまとめ未完モーダル -->
<div class="modal fade" id="doneGroupUncompModal" tabindex="-1" role="dialog" aria-labelledby="doneGroupUncompModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">完了タスクをまとめて未完</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="text-align: center;">
        完了タスクをまとめて未完にしますか？
      </div>
      <div class="modal-footer">
        <button type="button" id="done-group-uncomp-cancel-button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
        <button type="button" id="done-group-uncomp-confirm-button" class="btn btn-primary" data-dismiss="modal">削除</button>
      </div>
    </div>
  </div>
</div>


<script src="{{ asset('js/apicall.js') }}"></script>
<script src="{{ asset('js/bootstrap.js') }}"></script>
@endsection
