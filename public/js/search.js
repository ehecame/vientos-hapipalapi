$( document ).ready(function() {
	$(".projectType").click(onProjectTypeClicked);
});

function onProjectTypeClicked() {
	if($(this).hasClass("selected")){
		$(this).removeClass("selected");
	}else{
		$(this).addClass("selected");
	}
}