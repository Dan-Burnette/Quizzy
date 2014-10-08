var ApplicationController = {
	$container: undefined,
	questionViews: [],
	questionModels: [],
	totalQuestions: undefined,
	correctAnswers: 0,
	highScore: 0,
	questionAveragesAndTimesPlayed: undefined,

	startQuiz: function($container, quizModel) {
		console.log(quizModel);
		this.$container = $container;
		var questionsData = quizModel.questions;
		this.totalQuestions = questionsData.length;

		//High Score logic initiation & TimesPlayed--------
		//If localStorage keys exist
		if (localStorage['highScore'] != undefined && localStorage['highScorePlayerName'] != undefined ) {
			this.highScore = localStorage['highScore'];
			this.highScorePlayerName = localStorage['highScorePlayerName'];
		}
		//Else initialize them
		else {
			localStorage['highScore'] = 0;
			localStorage['highScorePlayerName'] = "nobody";
		}

		//Question average score logic initiation with one JSON object-----------
		if (localStorage['questionAveragesAndTimesPlayed'] != undefined){
			this.questionAveragesAndTimesPlayed = JSON.parse(localStorage['questionAveragesAndTimesPlayed'])
			console.log("The JSON parsed back into the controller is : " , this.questionAveragesAndTimesPlayed);
		}
		else {
			this.questionAveragesAndTimesPlayed = [];
			for (var i=1; i < this.totalQuestions + 1; i++){
				this.questionAveragesAndTimesPlayed.push([0,0])
			}
			localStorage['questionAveragesAndTimesPlayed'] = JSON.stringify(this.questionAveragesAndTimesPlayed);
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

		var index = index;
		var oldAvg = parseInt(JSON.parse(localStorage['questionAveragesAndTimesPlayed'])[index][0]);
		var oldTimesPlayed = parseInt(JSON.parse(localStorage['questionAveragesAndTimesPlayed'])[index][1]);
		var oldTotal = oldAvg * oldTimesPlayed;
		var timesPlayed = oldTimesPlayed + 1;
		var arrayAveragesAndTimesPlayed = JSON.parse(localStorage['questionAveragesAndTimesPlayed']);
		if (isCorrect == true){
			var newTotal = oldTotal+1;
			arrayAveragesAndTimesPlayed[index][0] = (newTotal)/timesPlayed;
		}
		else {
			arrayAveragesAndTimesPlayed[index][0] = (oldTotal)/timesPlayed;
		}

		arrayAveragesAndTimesPlayed[index][1] = timesPlayed;
		localStorage['questionAveragesAndTimesPlayed'] = JSON.stringify(arrayAveragesAndTimesPlayed);

	},

	getHighScore: function(){
		this.highScore = this.calculateScore();
		//If your score is a new high score
		if (this.highScore > parseInt(localStorage['highScore'])) {
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
		for (var i=0; i < this.totalQuestions; i++) { 
			var questionAvg = JSON.parse(localStorage['questionAveragesAndTimesPlayed'])[i][0] * 100;
			var questionAvgStr = "<br><h1> Question " + i + "'s average is: " + questionAvg + "% correct</h1>";
			questionAveragesStrings.push(questionAvgStr);
		}
		var finalQuestionAverageString = questionAveragesStrings.join('');
					
		this.$container.append(yourScoreStr + highScoreStr + finalQuestionAverageString);
	}

};



var creationController = {

	setupNewQuiz: function($container) {
		var quizCreationView = new QuizCreationView($container);
	},

	processQuizCreationView: function($container){
		var name = $container.find('.name').val();
		var $questions = $($container.find('.question'));
		var $answers = $($container.find('.answer'));
		var $choices = $($container.find('.choice'));
		var questions = [];
		var answers = [];
		var choices = [];

		$questions.each(function() {
			var question = $(this).val();
			questions.push(question);
		})

		$answers.each(function() {
			var answer = $(this).val();
			answers.push(answer);
		})

		$choices.each(function() {
			var choice = $(this).val();
			choices.push(choice);
		})

		var questionData = [];
		choiceCounter = 0;
		for (var i=0; i < questions.length; i++){
			var data = {
				id : i,
				question : questions[i],
				answer : answers[i],
				choices: [choices[choiceCounter], 
						  choices[choiceCounter+1], 
						  choices[choiceCounter+2], 
						  choices[choiceCounter+3]
						 ]
			};
			choiceCounter += 4;
			questionData.push(data);
		}
		var quizModel = creationController.createNewQuiz(name, questionData);
		return quizModel;
	},

	createNewQuiz: function(name, questionDataArray) {
		QuizesRepo.setupRepo();
		var newQuiz = new QuizModel(name, questionDataArray);
		QuizesRepo.saveQuiz(newQuiz);
		return newQuiz;
	}


};
