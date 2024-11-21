

//  for user name 
$(document).ready(function(){
    $(".submit").click(function(event){
     event.preventDefault();
    let validation= true;
    if(!check("#firstname", "#errorMessage1")){
        validation=false;
    }if(!check("#lastname", "#errorMessage2")){
        validation=false;
    }if(!check("#email", "#errorMessage3")){
        validation=false;
    }if(!check("#address", "#errorMessage4")){
        validation=false;
    }if(!check("#city", "#errorMessage5")){
        validation=false;
    }
    if(validation){
        alert("Form submitted successfullly");
    }else{
        alert("Invalid information ");
    }
    });

});

//first name
function check(id,msg){
    var value =$(id).val();
    if(value==""){
        $(msg).text("Invalid").addClass("error");
        return false;
    }else{
        $(id).removeClass("error");
        $(msg).text("Valid").addClass("valid");
        return true;
    }

}
