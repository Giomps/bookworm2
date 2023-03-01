const mongoose = require('mongoose')

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}
mongoose.connect('mongodb+srv://gio78:Madworld78@cluster0.x2zdzk2.mongodb.net/bookworm?retryWrites=true&w=majority', options,        
function(err) {
    console.log(err);
});
