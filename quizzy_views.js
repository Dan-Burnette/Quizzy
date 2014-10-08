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
				'<label class="temporary">Enter your new quiz name</label>',
				'<input type="text" class="name temporary"><br>',
				'<button class="add-question temporary"> Add a question </button>',
				'<button class="save-quiz temporary"> Save Quiz </button><br>'
				].join('');
	var $view = $(html);
	$container.html($view);

	$('.add-question').on('click', function(){
		var questionHTML = [
		'<br><label class="temporary">Enter the question</label>',
		'<br><input type="text" class="question temporary">',
		'<br><label class="temporary">Enter the answer </label>',
		'<br><input type="text" class="answer temporary">',
		'<br><label class="temporary">Enter the choices </label><br>',
		'<input type="text" class="choice temporary"><br>',
		'<input type="text" class="choice temporary"><br>',
		'<input type="text" class="choice temporary"><br>',
		'<input type="text" class="choice temporary"><br>',
		].join('');

		var $question  = $(questionHTML);
		$container.append($question);
	});

	this.show = function() {
		$view.show();
	};
	this.hide = function() {
		$view.hide();
	};

	var me = this;

	$('.save-quiz').on('click', function() {
		var quizModel = creationController.processQuizCreationView($container);
		$('.temporary').remove();
		$('.pick-a-quiz').show();
		ApplicationController.startQuiz($container, quizModel);
	})

}

