function removeUnderscoreAndDot(email) {
    var username = email.substring(0, email.lastIndexOf("@"));
    username = username.replace(/[._]/g, "");
    var domain = email.substring(email.lastIndexOf("@"));
  
    return (username + domain).toLowerCase();
  }
module.exports =  {removeUnderscoreAndDot}