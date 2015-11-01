$( document ).ready(function() {
	console.log( "ready register!" );
});

function onRegisterBtnClicked() {
	$.post( 
		"/api/project", 
		$("#registerForm").serialize(), 
		function( data ) {
			console.log( data );
		}
	);
}