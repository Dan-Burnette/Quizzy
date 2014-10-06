var ApplicationController = {
	$container: undefined,
	questionViews: [],
	questionModels: [],
	totalQuestions: undefined,
	correctAnswers: 0,
	highScore: 0,
	startQuiz: function($container) {

		if (localStorage['highScore'] != undefined) {
			this.highScore = localStorage['highScore']
		}
		else {
			localStorage['highScore'] = 0;
		}

		this.$container = $container;
		var questionsData = quizData.questions;
		this.totalQuestions = questionsData.length;
		for (var i = 0; i < questionsData.length; i++) {
			var questionModel = new Question(questionsData[i]);
			var questionView = new QuestionView(questionModel, this.$container);
			this.questionModels.push(questionModel);
			this.questionViews.push(questionView);
		}
		this.currentQuestionIndex = 0;
		this.showQuestion(this.currentQuestionIndex);
	},

	showQuestion: function(index) {
		this.hideQuestions();
		this.questionViews[index].show();
	},

	hideQuestions: function() {
		for (var i = 0; i < this.questionViews.length; i++) {
			this.questionViews[i].hide();
		}
	},

	checkAnswer: function(userAnswer) {
		console.log(userAnswer);
		var currentQuestion = this.questionModels[this.currentQuestionIndex];
		var answer = currentQuestion.answer;
		if (userAnswer === answer) {
			this.correctAnswers++;
		}
	},

	calculateScore: function() {
		return (this.correctAnswers / this.totalQuestions) * 100;
	},

	nextQuestion: function() {
		this.currentQuestionIndex++;
		if (this.questionViews[this.currentQuestionIndex]) {
			this.showQuestion(this.currentQuestionIndex);
		} else {
			var percentScore = this.calculateScore();
			this.showResults(percentScore);
		}
	},

	showResults: function(percentScore) {
		this.hideQuestions();

		this.highScore = this.correctAnswers/this.totalQuestions;
		if (this.highScore > localStorage['highScore']) {
			localStorage['highScore'] = this.highScore
		}
		this.$container.append(
			'<h1>You got ' + percentScore + '%! That\'s ' +
			this.correctAnswers + ' out of ' + this.totalQuestions + '!!!!!!!' +
			"The current high score is " + this.highScore
		);
	}
};