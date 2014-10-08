function QuestionView(questionModel, $container) {
	var myTemplate = _.template([
		'<div>',
			'<h2><%= question %></h2>',
			'<% for (var i = 0; i < choices.length; i++) { %>',
				'<input name="<%= id %>" type="radio" value="<%= choices[i] %>">',
				'<label><%= choices[i] %></label>',
			'<% } %>',
			'<button class="next-question-button" type="button">Next Question</button>',
		'</div>'
	].join(''));
	var compiledHTML = myTemplate({
		question: questionModel.question,
		choices: questionModel.choices,
		id: questionModel.id
	});
	var me = this;
	var $view = $(compiledHTML);
	$container.append($view);
	$view.find('.next-question-button').on('click', function() {
		var selectedChoice = $view.find('input[type=radio]:checked').val();
		ApplicationController.checkAnswer(selectedChoice);
		ApplicationController.nextQuestion();
	});

	this.show = function() {
		$view.show();
	};
	this.hide = function() {
		$view.hide();
	};

}

function QuizCreationView($container){
	var html = [
				'<label>Enter your new quiz name</label>',
				'<input type="text" class="name"><br>',
				'<button class="add-question"> Add a question </button>',
				'<button class="save-quiz"> Save Quiz </button><br>'
				].join('');
	var $view = $(html);
	$container.append($view);
	$('.add-question').on('click', function(){
		var questionHTML = [
		'<br><label>Enter the question</label>',
		'<br><input type="text" class="question">',
		'<br><label>Enter the answer </label>',
		'<br><input type="text" class="answer">',
		'<br><label>Enter the choices </label><br>',
		'<input type="text" class="choice"><br>',
		'<input type="text" class="choice"><br>',
		'<input type="text" class="choice"><br>',
		'<input type="text" class="choice"><br>',
		].join('');

		var $question  = $(questionHTML);
		$container.append($question);
	});

	$('.save-quiz').on('click', function() {
		
		creationController.processQuizCreationView($container);
	})

	this.show = function() {
		$view.show();
	};
	this.hide = function() {
		$view.hide();
	};



}