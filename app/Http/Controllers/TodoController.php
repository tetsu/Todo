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
          ->orderBy('priority','DESC')
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $todo = new Todo;
        $todo->title = $request->title;
        $todo->content = $request->content;
        $todo->starts_at = $request->starts_at;
        $todo->ends_at = $request->ends_at;
        $todo->user_id = $request->id;
        $todo->save();
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
      $success = Todo::where('id', $todo->id)
        ->update(['title' => $request->title, 'due_date'=>$request->due_date, 'priority'=>$request->priority]);

      if($success){
        $new = Todo::where('id', $todo->id)->first();
        return response()->json([
          'status'=>'success',
          'data' => $new
        ]);
      } else {
        return response()->json([
          'status'=>'fail'
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
      $todo = Todo::destroy($todo->id);
      return response()->json([
        'status'=>'success',
        'data' => $copy,
      ]);
    }
}
