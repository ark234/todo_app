$(function() {
	console.log('first_todo.js loaded!');

	// submit new todo form
	$('#submit-btn').click(event => {
		// prevent default form action -- USE AJAX
		event.preventDefault();
		// $.post('/todos/new', { title: $('#title-input').val(), description: $('#desc-input').val() });
		$.post('/todos/new', $('#new-todo-form').serialize());
		$('#new-todo-form').hide();
		$('h1').after('<p>todo added</p>');
		console.log('new todo added!');
	});
});
