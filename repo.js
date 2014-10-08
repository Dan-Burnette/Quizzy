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
		var quiz = JSON.stringify(quizModel);
		var quizes = JSON.parse(localStorage['quizes']);
		quizes.push(quiz);
		localStorage['quizes'] = JSON.stringify(quizes);
	},

	getQuiz: function(name) {
		var quizes = JSON.parse(localStorage['quizes']);
		for (var i=0; i < quizes.length; i++){
			var quiz = JSON.parse(quizes[i]);
			console.log(quiz);
			if (quiz.name == name){
				return quiz;
			}
		}
	},

	getQuizNames: function(){
		var names = [];
		var quizes = JSON.parse(localStorage['quizes']);
		console.log("quizes are : ", quizes);
		for (var i=0; i < quizes.length; i++){
			var quiz = JSON.parse(quizes[i]);
			names.push(quiz.name);
		}
		return names;
	}

}