function QuestionView(questionModel, $container) {
	var myTemplate = _.template([
		'<div>',
			'<h2><%= question %></h2>',
			'<p>the answer is <%= answer %></p>',
			'<% for (var i = 0; i < choices.length; i++) { %>',
				'<input name="<%= id %>" type="radio" value="<%= choices[i] %>">',
				'<label><%= choices[i] %></label>',
			'<% } %>',
			'<button class="next-question-button" type="button">Next Question</button>',
		'</div>'
	].join(''));
	var compiledHTML = myTemplate({
		question: questionModel.question,
		answer: questionModel.answer,
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