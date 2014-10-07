function Question(questionData) {
	this.question = questionData.question;
	this.answer   = questionData.answer;
	this.choices  = questionData.choices;
	this.id       = questionData.id;
}


function QuizModel(name, questionDataArray){
	var questions = [];
	for (var i=0; i < questionDataArray.length; i++){
		var question = new Question(questionDataArray[i]);
		questions.push(question);
	}

	this.name = name;
	this.questions = questions;
}