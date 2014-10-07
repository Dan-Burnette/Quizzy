var ApplicationController = {
	$container: undefined,
	questionViews: [],
	questionModels: [],

	questionAvgScores: 
	{
		question1: {timesPlayed: undefined, avg: undefined},
		question2: {timesPlayed: undefined, avg: undefined},
		question3: {timesPlayed: undefined, avg: undefined},
		question4: {timesPlayed: undefined, avg: undefined},
		question5: {timesPlayed: undefined, avg: undefined},
		question6: {timesPlayed: undefined, avg: undefined},
	},

	totalQuestions: undefined,
	correctAnswers: 0,
	highScore: 0,
	startQuiz: function($container) {

		this.$container = $container;
		var questionsData = quizData.questions;
		this.totalQuestions = questionsData.length;

		//High Score logic initiation
		if (localStorage['highScore'] != undefined) {
			this.highScore = localStorage['highScore'];
		}
		else {
			localStorage['highScore'] = 0;
		}

		//Question average score logic initiation
		for (var i=1; i < this.totalQuestions + 1; i++){
			timesPlayed = localStorage['timesPlayed' + i];
			avg = localStorage['avg' + i];
			if (timesPlayed == undefined){
				timesPlayed = 0;
			    localStorage['timesPlayed' + i] = timesPlayed;
			} 
			if (avg == undefined){
				avg = 0;
				localStorage['avg' + i] = avg;
			}
		}
		


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
		var currentQuestion = this.questionModels[this.currentQuestionIndex];
		var answer = currentQuestion.answer;
		var oldCorrectAnswers = this.correctAnswers;
		if (userAnswer === answer) {
			this.correctAnswers++;
		}

		// So that we know how to update the average!
		if (this.correctAnswers == oldCorrectAnswers + 1){
			this.updateQuestionAverage(this.currentQuestionIndex, true);
		}
		else {
			this.updateQuestionAverage(this.currentQuestionIndex, false);
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

	updateQuestionAverage: function(index, isCorrect){
		var index = index+1;
		var oldAvg = parseInt(localStorage['avg'+ index]);
		var oldTimesPlayed = parseInt(localStorage['timesPlayed' + index]);
		var oldTotal = oldAvg * oldTimesPlayed;
		var timesPlayed = parseInt(localStorage['timesPlayed' + index]) + 1;
		if (isCorrect == true){
			var newTotal = oldTotal+1;
			localStorage['avg' + index] = (newTotal)/timesPlayed;
		}
		else {
			localStorage['avg' + index] = (oldTotal)/timesPlayed;
		}

		localStorage['timesPlayed' + index] = timesPlayed;
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
			"The current high score is " + this.highScore + " Question 1's average is: " + localStorage['avg1'] +
			" Question 2's average is: " + localStorage['avg2'] + " Question 3's average is: " + localStorage['avg3'] +
			" Question 4's average is: " + localStorage['avg4'] + " Question 5's average is: " + localStorage['avg5'] +
			" Question 6's average is: " + localStorage['avg6']
		);
	}
};