var QuizesRepo = {

	quizes: undefined,

	setupRepo: function(){
		var quizes = localStorage['quizes'];
		if (quizes != undefined){
			this.quizes = quizes;
		}
		else {
			localStorage['quizes'] = JSON.stringify([]);
			this.quizes = JSON.parse(localStorage['quizes']);
		}
	},

	saveQuiz: function(quizModel) {
		var name = quizModel.name;
		var quiz = JSON.stringify(quizModel);
		var quizes = JSON.parse(localStorage['quizes']);
		quizes.push(quiz);
		localStorage['quizes'] = JSON.stringify(quizes);
	},

	getQuiz: function() {

	},

}