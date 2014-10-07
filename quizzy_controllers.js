var ApplicationController = {
	$container: undefined,
	questionViews: [],
	questionModels: [],
	totalQuestions: undefined,
	correctAnswers: 0,
	highScore: 0,

	startQuiz: function($container) {

		this.$container = $container;
		var questionsData = quizData.questions;
		this.totalQuestions = questionsData.length;

		//High Score logic initiation--------
		//If localStorage keys exist
		if (localStorage['highScore'] != undefined && localStorage['highScorePlayerName'] != undefined) {
			this.highScore = localStorage['highScore'];
			this.highScorePlayerName = localStorage['highScorePlayerName'];
		}
		//Else initialize them
		else {
			localStorage['highScore'] = 0;
			localStorage['highScorePlayerName'] = "nobody";
		}

		//Question average score logic initiation-----------
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

	getHighScore: function(){
		this.highScore = this.calculateScore();
		//If your score is a new high score
		if (this.highScore > localStorage['highScore']) {
			var highScorePlayerName = prompt("You've gotten the highest score yet! Enter your name!");
			localStorage['highScore'] = this.highScore;
			localStorage['highScorePlayerName'] = highScorePlayerName;
		}
	},

	showResults: function(percentScore) {
		this.hideQuestions();
		this.getHighScore();
		var highScore = parseInt(localStorage['highScore']);
		var yourScoreStr = '<h1>You got ' + percentScore + '%! That\'s ' + this.correctAnswers + ' out of ' + this.totalQuestions + '! ';
		var highScoreStr = " The current high score is " + highScore +  "% by " + localStorage['highScorePlayerName'];
		var questionAveragesStrings = [];
		for (var i=1; i < this.totalQuestions + 1; i++) { 
			var questionAvg = "<br><h1> Question " + i + "'s average is: " + localStorage['avg'+i] + "</h1>";
			questionAveragesStrings.push(questionAvg);
		}
		var finalQuestionAverageString = questionAveragesStrings.join('');
					
		this.$container.append(yourScoreStr + highScoreStr + finalQuestionAverageString);
	}
};


