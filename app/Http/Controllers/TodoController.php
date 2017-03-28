<?php

namespace App\Http\Controllers;

use App\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      if(isset($request->todo_id)){
        $todo = Todo::where('id', $request->todo_id)->first();
      }

      else if($request->done){
        $todo = Todo::where('user_id', $request->user_id)
          ->whereNotNull('comp_date')
          ->orderBy('comp_date','DESC')
          ->get();
      }

      else {
        $todo = Todo::where('user_id', $request->user_id)
          ->where('comp_date', null)
          //->orderBy('priority','DESC')
          ->orderBy('due_date','ASC')->get();
      }

      return response()->json([
        'status'=>'success',
        'data' => $todo,
      ]);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $todo = new Todo;
        $todo->title = $request->title;
        $todo->due_date = $request->due_date;
        $todo->priority = $request->priority;
        $todo->user_id = $request->user_id;
        $todo->detail = $request->detail;
        if($todo->save()){
          return response()->json([
            'status'=>'success',
            'data' => $todo,
          ]);
        } else {
          return response()->json([
            'status'=>'fail',
            'message'=>'データベースエラー'
          ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->json()->all();
        if($data['action'] === 'delete'){
          $result = Todo::wherein('id', json_decode($data['ids'], true))->delete();
          if($result > 0){
            return response()->json([
              'status'=>'success',
              'data' => $result,
              'message' => 'タスクを削除しました。'
            ]);
          }
        } elseif($data['action'] === 'comp') {
          $result = Todo::wherein('id', json_decode($data['ids'], true))
                      ->update(['comp_date' => date("Y-m-d")]);
          if($result > 0){
            return response()->json([
              'status'=>'success',
              'data' => $result,
              'message' => 'タスクを完了にしました。'
            ]);
          }
        } elseif($data['action'] === 'uncomp') {
          $result = Todo::wherein('id', json_decode($data['ids'], true))
                      ->update(['comp_date' => null]);
          if($result > 0){
            return response()->json([
              'status'=>'success',
              'data'=>$result,
              'message' => 'タスクを未完にしました。'
            ]);
          }
        }

        return response()->json([
          'status'=>'fail',
          'message'=>'エラー'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function show(Todo $todo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function edit(Todo $todo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Todo $todo)
    {
      if( $request->comp_date === 'uncomp' ){
        $message = 'を未完にしました。';
        $success = Todo::where('id', $todo->id)
          ->update(['comp_date' => null]);
      } elseif(isset($request->comp_date)){
        if($request->title && $request->due_date && $request->comp_date && $request->priority && $request->detail){
          $message = 'を更新しました。';
          $success = Todo::where('id', $todo->id)
            ->update([
              'title' => $request->title,
              'due_date'=>$request->due_date,
              'comp_date'=>$request->comp_date,
              'priority'=>$request->priority,
              'detail'=>$request->detail
            ]);
        } else {
          $message = 'を完了しました。';
          $success = Todo::where('id', $todo->id)
            ->update(['comp_date' => $request->comp_date]);
        }

      } elseif(isset($request->title) && isset($request->due_date) && isset($request->priority)) {
        $message = 'を更新しました。';
        $success = Todo::where('id', $todo->id)
          ->update([
            'title' => $request->title,
            'due_date'=>$request->due_date,
            'comp_date'=>$request->comp_date,
            'priority'=>$request->priority,
            'detail'=>$request->detail
          ]);
      } else {
        return response()->json([
          'status'=>'fail',
          'message'=>'データベースエラー'
        ]);
      }


      if($success){
        $new = Todo::where('id', $todo->id)->first();
        return response()->json([
          'status'=>'success',
          'data' => $new,
          'message'=> '「'.$new->title.'」'.$message
        ]);
      } else {
        return response()->json([
          'status'=>'fail',
          'message'=>'データベースエラー'
        ]);
      }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Todo $todo)
    //public function destroy(Request $request)
    {
      $copy = $todo;
      $success = Todo::destroy($todo->id);
      return response()->json([
        'status'=>'success',
        'data' => $copy,
        'message' => '「'.$copy->title.'」を削除しました。'
      ]);
    }
}
